const COLORS = ['#601114', '#11601c', '#2b2b49', '#2a3b4e', '#eb8931']
const SPRITE_INDICES = [15, 16, 17, 18, 19];

AFRAME.registerComponent('enemy', {
    schema: {
        speed: { default: 5 },
        health: { default: 80 },
        value: { default: 1 },
        type: { default: 1 },
        spawner: { default: -1 },
    },
    init: function () {
        this.immune = 500;
        this.game = this.el.sceneEl.components.game;
        this.alive = true;
        this.el.sceneEl.addEventListener('gameOver', this.gameOver.bind(this));

        this.targetIndex = 0;
        this.target = new THREE.Vector3(...this.game.nextTarget(this.targetIndex, this.data.spawner));

        this.direction =
            this.target.clone().sub(this.el.object3D.position).normalize();

        this.distance = this.el.object3D.position.distanceTo(this.target);
        this.fakedist = this.distance;
        this.auxVector = new THREE.Vector3();
        this.bob = 0;

        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(SPRITE_INDICES[this.data.type]);
        const whiteMaterial = new THREE.MeshStandardMaterial()
        var materials = [
            pixelMaterial,
            pixelMaterial,
            whiteMaterial,
            whiteMaterial,
            whiteMaterial,
            whiteMaterial,
        ];
        const mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh', mesh);

    },
    tick: function (time, timeDelta) {
        if (!this.alive) {
            return;
        }
        if(this.immune>0) this.immune -= timeDelta;

        this.auxVector.copy(this.direction);
        this.bob += timeDelta / 100;
        const deltaSpeed = timeDelta / 1000 * this.data.speed;
        this.el.object3D.position.add(this.auxVector.multiplyScalar(deltaSpeed));
        this.el.object3D.position.y += Math.sin(this.bob) / 100;
        this.fakedist -= deltaSpeed;
        if (this.fakedist < 0.01) {
            this.targetIndex++;
            const next = this.game.nextTarget(this.targetIndex, this.data.spawner);
            if (!next) {
                this.game.gameOver();
                this.alive = false;
            } else {
                this.el.object3D.position = this.target;
                this.target = new THREE.Vector3(...next);
                if (this.target !== null) {
                    this.direction =
                        this.target.clone().sub(this.el.object3D.position).normalize();
                    this.el.setAttribute('rotation', { y: Math.round(this.direction.z) != 0 ? rotate = 90 : 0 });
                    this.fakedist = this.el.object3D.position.distanceTo(this.target);
                }
            }
        }
    },
    /**
     * Called when the enemy is hit.
     * @param {Number} damage Damage to deal to the enemy
     */
    hit: function (damage) {
        this.data.health -= damage;
        if (this.data.health <= 0) {
            if (this.el) {
                try {
                    this.die();
                    sound.play(sound.explosion,this.el.object3D);
                    this.game.kill(this.data.value);
                } catch{ }
            }
        }
    },
    die: function () {        
        createExplosion(this.el, this.el.object3D.position, COLORS[this.data.type]);
        if (this.el && this.el.parentNode) {
            this.el.remove();        
        }
    },
    gameOver: function () {
        this.data.alive = false;
        setTimeout(this.die.bind(this), Math.random() * 1000);
    }
});



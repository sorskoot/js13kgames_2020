AFRAME.registerComponent('td-enemy', {
    schema: {
        speed: { default: 5 },
        alive: { default: true },
        health: { default: 40 },
        value: { default: 1 }
    },
    init: function () {
        this.system =
            document.querySelector('a-scene').systems['td-tower-defense'];

        this.targetIndex = 0;
        this.target = this.system.nextTarget(this.targetIndex);

        this.direction =
            this.target.clone().sub(this.el.object3D.position).normalize();

        this.distance = this.el.object3D.position.distanceTo(this.target);
        this.auxVector = new THREE.Vector3();
        this.bob = 0;
    },

    update: function (oldData) {

    },
    tick: function (time, timeDelta) {
        if (timeDelta > 100) { return };
        if (!this.data.alive) {
            return;
        }

        this.auxVector.copy(this.direction);
        this.bob += timeDelta / 100;
        this.el.object3D.position.add(this.auxVector.multiplyScalar(timeDelta / 1000 * this.data.speed));
        this.el.object3D.position.y += Math.sin(this.bob) / 100;
        const newDistance = this.el.object3D.position.distanceTo(this.target);
        if (newDistance > this.distance) {
            this.targetIndex++;
            this.target = this.system.nextTarget(this.targetIndex);
            if (this.target !== null) {
                this.direction =
                    this.target.clone().sub(this.el.object3D.position).normalize();
                this.distance = this.el.object3D.position.distanceTo(this.target);
            } else {
                this.data.alive = false;
                this.el.setAttribute('selfdestruct', 'timer:0');
            }
        } else {
            this.distance = newDistance;
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
                    this.el.remove();
                    document.querySelector('[game]').emit('kill', { value: this.data.value });
                } catch{ }
            }
        }
    }
});
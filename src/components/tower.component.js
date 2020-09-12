const TOWER_SPRITE_INDICES = [4, 14, 13, 10, 20];

AFRAME.registerComponent('tower', {
    schema: {
        speed: {
            default: 500
        },
        level: {
            default: 0
        },
        type: {
            default: 0
        },
        animated: {
            default: false
        },
        data: {
            type: 'array'
        },
        rot: {
            default: 0
        }
    },
    init: function () {
        /* setting all properties */
        const d = this.data.data;
        this.type = d[TOWER_INDEX];
        this.reach = [d[TOWER_REACH], d[TOWER_REACH2], d[TOWER_REACH3]];
        this.damage = [d[TOWER_DAMAGE], d[TOWER_DAMAGE2], d[TOWER_DAMAGE3]];
        this.life = [d[TOWER_LIFE], d[TOWER_LIFE2], d[TOWER_LIFE3]];
        this.specialEnemy = d[TOWER_SPECIALENEMY];
        this.seDamage = [d[TOWER_SE_DAMAGE], d[TOWER_SE_DAMAGE2], d[TOWER_SE_DAMAGE3]];

        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.game = this.el.sceneEl.components.game;

        this.pixelMaterial2 = createPixelMaterial(TOWER_SPRITE_INDICES[this.data.type]);
        var mesh = new THREE.Mesh(geometry, this.pixelMaterial2);
        this.el.setObject3D('mesh', mesh);
        this.q = 0.0;
        this.t = 0;
        this.bulletContainer = document.getElementById('bullets');
        this.countdown = this.data.speed;
    },
    update: function () {
        this.bullets = this.life[this.data.level];
        this.pixelMaterial2.uniforms.lookupIndex.value = this.data.level + 9;
    },
    tick: function (time, timeDelta) {
        this.countdown -= timeDelta;
        if (this.countdown < 0) {
            this.countdown = this.data.speed;
            let { found, distance } = closestEnemy(this.el.object3D.position, this.reach[this.data.level]);
            if (found && distance < this.reach[this.data.level]) {
                sound.play(sound.fire, this.el.object3D);
                const entity = document.createElement('a-entity');
                entity.setAttribute('mixin','template-bullet');
                entity.setAttribute('bullet', {
                    target: found,
                    damage: this.damage[this.data.level],
                    special: this.specialEnemy,
                    specialDamage: this.seDamage[this.data.level]
                });

                entity.setAttribute('pixelshader-material', { lookup: this.data.level + 9 })
                entity.setAttribute('position', this.el.object3D.position);
                this.bulletContainer.append(entity);
                this.bullets -= 1;
                if (this.bullets <= 0) {
                    sound.play(sound.explosion, this.el.object3D)
                    createExplosion(this.el.parentElement, this.el.object3D.position, '#00FFFF');
                    this.el.remove();
                    const p = this.el.object3D.position;
                    this.game.placePlaceholder([p.x, p.y, p.z, this.data.rot]);
                }
            }
        }
        if (this.data.animated) {
            this.t += timeDelta;
            if (this.t > 100) {
                this.q = (this.q + 1) % 5;
                this.pixelMaterial2.uniforms.lookupShift.value = this.q;
                this.t = 0;
            }
        }

    },

});
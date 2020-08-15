import { closestEnemy } from '../../lib/enemyhelper';

AFRAME.registerComponent('td-tower', {
    schema: {
        speed: {
            default: 150
        }
    },
    init: function () { this.update(); },
    update: function (oldData) {
        this.countdown = this.data.speed;
    },
    tick: function (time, timeDelta) {
        this.countdown -= timeDelta;
        if (this.countdown < 0) {
            this.countdown = this.data.speed;
            let { found, distance } = closestEnemy(this.el.object3D.position);
            if (found) {
              
                const entity = document.getElementById('template-bullet').cloneNode(true);
                entity.setAttribute('td-bullet', { target: found });
                entity.setAttribute('position',this.el.object3D.position);
                document.getElementById('bullets').append(entity);
                //find closest enemy
            }
        }
    },

});
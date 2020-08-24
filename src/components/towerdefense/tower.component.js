import { closestEnemy } from '../../lib/enemyhelper';
import {sound} from '../../lib/sound';

AFRAME.registerComponent('td-tower', {
    schema: {
        speed: {
            default: 500
        },
        reach:{
            default:5
        },
        bullet:{
            type:'selector'
        }
    },
    init: function () {  },
    update: function (oldData) {
        this.countdown = this.data.speed;        
    },
    tick: function (time, timeDelta) {
        this.countdown -= timeDelta;
        if (this.countdown < 0) {
            this.countdown = this.data.speed;
            let { found, distance } = closestEnemy(this.el.object3D.position);
            if (found && distance < this.data.reach) {              
                if(!this.data.bullet){
                    console.log();
                }
                //sound.play(sound.fire);
                const entity = this.data.bullet.cloneNode(true);
                entity.setAttribute('td-bullet', { target: found });
                entity.setAttribute('position',this.el.object3D.position);
                document.getElementById('bullets').append(entity);
            }
        }
    },

});
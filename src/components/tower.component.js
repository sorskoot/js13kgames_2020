
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
        },
        level: {
            default: 0
       },
       type:{
           default:0
       },
       numbullets:{
           default:10
       },
    animated:{
           default:false
       }
    },
    init: function () { 
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.pixelMaterial2 = createPixelMaterial(this.data.type);
        var mesh = new THREE.Mesh(geometry, this.pixelMaterial2);
        this.el.setObject3D('mesh', mesh);
        this.q = 0.0;
        this.t = 0;
        this.damage = {
           4:[1,2,3],
           14:[2,4,8],
           13:[3,6,12],
           10:[4,8,16],
           20:[5,10,20]
        }
        this.bulletContainer = document.getElementById('bullets');
     },
    update: function (oldData) {
        this.countdown = this.data.speed;
        this.bullets = this.data.numbullets;  
        this.pixelMaterial2.uniforms.lookupIndex.value = this.data.level + 9;      
    },
    tick: function (time, timeDelta) {
        this.countdown -= timeDelta;
        if (this.countdown < 0) {
            this.countdown = this.data.speed;
            let { found, distance } = closestEnemy(this.el.object3D.position, this.data.reach);
            if (found && distance < this.data.reach) {              
                sound.play(sound.fire);
                const entity = this.data.bullet.cloneNode(true);
                entity.setAttribute('td-bullet', { 
                    target: found ,
                    damage: this.damage[this.data.type][this.data.level]
                });
                
                entity.setAttribute('pixelshader-material',{lookup:this.data.level+9})
                entity.setAttribute('position',this.el.object3D.position);
                this.bulletContainer.append(entity);
                this.bullets -= 1;
                if(this.bullets <= 0){
                    createExplosion(this.el.parentElement, this.el.object3D.position, '#00FFFF');
                    this.el.remove();
                }
            }
        }
        if(this.data.animated){
        this.t += timeDelta;
        if (this.t > 100) {
            this.q= (this.q+1)%5;
            this.pixelMaterial2.uniforms.lookupShift.value = this.q;
            this.t = 0;
        }
        }
        
    },

});
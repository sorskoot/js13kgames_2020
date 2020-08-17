AFRAME.registerComponent('td-bullet', {
    schema: {
        speed: {
            default: 1
        },
        target: {
            type: 'selector'
        },
        damage:{
            default:1
        }
    },
    init: function () {
        this.dir = new THREE.Vector3();
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) {
        if(!this.data.target){
            this.el.remove();
            return;
        }
        if (this.el.object3D.position.distanceTo(this.data.target.object3D.position) > 1) {
            this.dir.subVectors(this.data.target.object3D.position, this.el.object3D.position).normalize();
           // this.dir.multiplyScalar(this.data.speed);
            this.el.object3D.position.add(this.dir);
        } else {
            this.data.target.components['td-enemy'].hit(this.data.damage);
            this.el.remove();
        }
    },
});
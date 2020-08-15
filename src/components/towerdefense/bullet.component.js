AFRAME.registerComponent('td-bullet', {
    schema: {
        speed: {
            default: 1
        },
        target: {
            type: 'selector'
        }
    },
    init: function () {
        this.dir = new THREE.Vector3();
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) {
        if (this.el.object3D.position.distanceTo(this.data.target.object3D.position) > 1) {
            this.dir.subVectors(this.data.target.object3D.position, this.el.object3D.position).normalize();
           // this.dir.multiplyScalar(this.data.speed);
            this.el.object3D.position.add(this.dir);
        } else {
            this.el.remove();
        }
    },
});
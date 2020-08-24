import { createPixelMaterial } from '../../lib/PixelMaterial';
AFRAME.registerComponent('tower-entity', {
    schema: {
        type: {
            default: 0
        }
    },
    init: function () {
        this.data.type = ~~(Math.random() * 3);
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(4);
        this.pixelMaterial2 = createPixelMaterial(4, "#ffffff", this.data.type + 9);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        var materials = [
            pixelMaterial,
            pixelMaterial,
            this.pixelMaterial2,
            pixelMaterial,
            pixelMaterial,
            pixelMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, this.pixelMaterial2);
        this.el.setObject3D('mesh', mesh);
        this.q = 0.0;
        this.t = 0;
    },
    update() {
        this.pixelMaterial2.uniforms.lookupIndex.value = this.data.type + 9;
    },
    tick(time, deltaTime) {
        // this.t += deltaTime;
        // if (this.t > 100) {
        //     this.q= (this.q-1)%5;
        //     this.pixelMaterial2.uniforms.lookupShift.value = this.q;
        //     this.t = 0;
        // }
    }
});
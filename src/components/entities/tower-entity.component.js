import { createPixelMaterial } from '../../lib/PixelMaterial';
AFRAME.registerComponent('tower-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(4);
        this.pixelMaterial2 = createPixelMaterial(10, "#ffffff", 1);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        var materials = [
            pixelMaterial,
            pixelMaterial,
            this.pixelMaterial2,
            pixelMaterial,
            pixelMaterial,
            pixelMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh', mesh);
        this.q=0.0;
        this.t=0;
    },
    tick(time, deltaTime) {
        this.t += deltaTime;
        if (this.t > 500) {
            this.q= (this.q+1)%5;
            //this.pixelMaterial2.uniforms.lookupShift.value = 1;//this.q;
            this.t = 0;
        }
    }
});
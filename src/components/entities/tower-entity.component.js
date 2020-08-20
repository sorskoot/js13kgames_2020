import { createPixelMaterial } from '../../lib/PixelMaterial';
AFRAME.registerComponent('tower-entity', {
    schema: {
        type:{
            default:0
        }
    },
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(4);
        this.pixelMaterial2 = createPixelMaterial(10, "#ffffff", this.data.type+2);
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
    update(){
        this.pixelMaterial2.uniforms.lookupIndex.value = this.data.type+2;
    },
    tick(time, deltaTime) {
        this.t += deltaTime;
        if (this.t > 100) {
            this.q= (this.q-1)%5;
            this.pixelMaterial2.uniforms.lookupShift.value = this.q;
            this.t = 0;
        }
    }
});
import {createPixelMaterial} from '../../lib/PixelMaterial';
AFRAME.registerComponent('tower-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(4);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        var materials = [
            pixelMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           pixelMaterial,
           pixelMaterial,
           pixelMaterial,
           pixelMaterial,
           pixelMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
    },
});
import {createPixelMaterial} from '../../lib/PixelMaterial';
AFRAME.registerComponent('block-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(3);
        //const whiteMaterial = 
        var materials = [
           pixelMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           pixelMaterial,
           createPixelMaterial(1),
           pixelMaterial,
           pixelMaterial,
           pixelMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
    },
});
AFRAME.registerComponent('target-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(.1, 1, 1);
        const pixelMaterial = createPixelMaterial(~~(Math.random()*3)+5);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        var materials = [
           pixelMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           pixelMaterial,
           whiteMaterial,
           whiteMaterial,
           whiteMaterial,
           whiteMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
    },
});
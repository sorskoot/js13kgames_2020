AFRAME.registerComponent('block-entity', {
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const sideMaterial = createPixelMaterial(3);
        this.pixelMaterial = createPixelMaterial(9, "#ffffff", 6);
        //const whiteMaterial = 
        var materials = [
           sideMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           sideMaterial,
           sideMaterial,           
           sideMaterial,
           this.pixelMaterial,
           sideMaterial, 
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
        this.q = 0.0;
        this.t = 0;
      },
      tick(time, deltaTime) {          
        this.t += deltaTime;
        if (this.t > 200) {
         
          this.q = (this.q + 1) % 5;
          this.pixelMaterial.uniforms.lookupShift.value = this.q;
          this.t = 0;
        }
      },
});
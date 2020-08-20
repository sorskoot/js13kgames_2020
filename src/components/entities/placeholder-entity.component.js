import { createPixelMaterial } from '../../lib/PixelMaterial';

AFRAME.registerComponent("placeholder-entity", {
  schema: {},
  init: function () {
    var geometry = new THREE.PlaneGeometry();
    this.pixelMaterial =  createPixelMaterial(11, "#ffffff", 5);
    this.pixelMaterial.transparent=true;
    this.pixelMaterial.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geometry, this.pixelMaterial);
    this.el.setObject3D("mesh", mesh);
    this.q = 0.0;
    this.t = 0;
  },
  tick(time, deltaTime) {
    this.el.object3D.rotateX(0.06);      
    this.el.object3D.rotateY(0.02);
    this.el.object3D.rotateZ(0.04);

    this.t += deltaTime;
    if (this.t > 100) {
     
      this.q = (this.q + 1) % 5;
      this.pixelMaterial.uniforms.lookupShift.value = this.q;
      this.t = 0;
    }
  },
});

import { createPixelMaterial } from "../lib/PixelMaterial";

AFRAME.registerComponent("pixelshader-material", {
  schema: {
    index: { type: "int", default: 0 },
    color: { default: "$ffffff" },
    lookup: { type: "int", default: -1 },
    animationSpeed: { default: 0 },
    repeat:{type:"vec2", default:"1 1"},
    transparent:{default:false}
  },

  init: function () {  },

  update: function () {
    // const texture = new THREE.ImageUtils.loadTexture(this.data.src);
    // texture.minFilter = texture.magFilter = 1003;
    // var material = new THREE.ShaderMaterial({
    //   extensions: {
    //     derivatives: true,
    //   },
    //   uniforms: {
    //     // some parameters for the shader
    //     time: { value: 0.0 },
    //     index: { value: this.data.index },
    //     DiffuseTexture: { value: texture },
    //     color: { value: new THREE.Color(this.data.color) },
    //     spriteDimensions: { value: { x: 8.0, y: 1.0 } },
    //     repeat: { value: { x: 1.0, y: 1.0 } },
    //     tint: { value: new THREE.Color(255, 255, 255) },
    //     tintAmount: { value: 0 },
    //   },
    //   vertexShader: vertShader,
    //   fragmentShader: fragShader,
    // });
    this.material = createPixelMaterial(
        this.data.index, 
        this.data.color, 
        this.data.lookup,
        this.data.repeat.x,
        this.data.repeat.y,
        this.data.transparent);
    this.el.getObject3D("mesh").depthWrite = false;
    this.el.getObject3D("mesh").material = this.material;
  },
});

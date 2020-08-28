import { createPixelMaterial } from "../lib/PixelMaterial";

AFRAME.registerComponent("pixelshader-material", {
  schema: {
    index: { type: "int", default: 0 },
    color: { default: "#ffffff" },
    lookup: { type: "int", default: -1 },
    animationSpeed: { default: 0 },
    repeat:{type:"vec2", default:{x:1, y:1}},
    transparent:{default:false}
  },

  init: function () {  },

  update: function () {
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

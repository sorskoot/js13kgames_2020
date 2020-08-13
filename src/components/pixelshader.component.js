import vertShader from '../shaders/shader.vert';
import fragShader from '../shaders/shader.frag';

AFRAME.registerComponent('pixelshader-material', {
    schema: {
        color:
        {
            type: 'color',
            default:'#ffffff'
        },
        index: { type: 'int', default: 0 },        
        src:{type:'string'}
    },

    init: function () {
        this.update();
    },
    update: function () {
        const texture =new THREE.ImageUtils.loadTexture(this.data.src);
        texture.minFilter = texture.magFilter = 1003;
        var material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true
            },
            uniforms: { // some parameters for the shader
                time: { value: 0.0 },
                index: { value: this.data.index },
                DiffuseTexture: { value: texture },                
                color: { value: new THREE.Color(this.data.color) },
                spriteDimensions: { value: { x: 8.0, y: 1.0 } },
                repeat: { value: { x: 1.0, y: 1.0 } },
                fogStart: { value: 5 },
                fogEnd: { value: 15 },                
                fogColor: { value: new THREE.Color(0, 0, 0) },
                tint: { value: new THREE.Color(255, 255, 255) },
                tintAmount: { value: 0 }
            },
            vertexShader: vertShader,
            fragmentShader: fragShader,
        });
        material.needsUpdate = true;
        this.el.getObject3D('mesh').material = material;
    },

});
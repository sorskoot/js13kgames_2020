import vertShader from '../shaders/shader.vert';
import fragShader from '../shaders/shader.frag';

const texture = new THREE.ImageUtils.loadTexture('js13k2020.png');
/**
 * Creates a pixel shader material
 * @param {number} tileIndex index of the sprite to use as a map
 * @param {string} color Hex color - defaults to #ffffff
 */
export function createPixelMaterial(tileIndex, color='#ffffff'){
   
    texture.minFilter = texture.magFilter = 1003;
    var material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: true
        },
        uniforms: { // some parameters for the shader
            time: { value: 0.0 },
            index: { value: tileIndex },
            DiffuseTexture: { value: texture },                
            color: { value: new THREE.Color(color) },
            spriteDimensions: { value: { x: 32.0, y: 1.0 } },
            repeat: { value: { x: 1.0, y: 1.0 } },         
            tint: { value: new THREE.Color(255, 255, 255) },
            tintAmount: { value: 0 }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
    });
    material.needsUpdate = true;
    return material;
}
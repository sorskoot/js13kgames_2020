import vertShader from '../shaders/shader.vert';
import fragShader from '../shaders/shader.frag';

const texture = new THREE.ImageUtils.loadTexture('js13k2020.png');
const textureLookup = new THREE.ImageUtils.loadTexture('js13k2020-colors.png');
/**
 * Creates a pixel shader material
 * @param {number} tileIndex index of the sprite to use as a map
 * @param {string} color Hex color - defaults to #ffffff
 */
export function createPixelMaterial(
    tileIndex,
    color = '#ffffff',
    lookupIndex = -1,
    repeatX=1,
    repeatY=1,
    transparent=false) {

    texture.minFilter = texture.magFilter = 1003;
    textureLookup.minFilter = textureLookup.magFilter = 1003;
    var material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: true
        },
        uniforms: { // some parameters for the shader
            time: { value: 0.0 },
            index: { value: tileIndex },
            DiffuseTexture: { value: texture },
            Lookup: { value: textureLookup },
            lookupIndex: { value: lookupIndex },
            lookupShift: { value: 0.0 },
            color: { value: new THREE.Color(color) },
            spriteDimensions: { value: { x: 32.0, y: 1.0 } },
            repeat: { value: { x: repeatX, y: repeatY } },
            tint: { value: new THREE.Color(255, 255, 255) },
            tintAmount: { value: 0 }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
    });
    material.transparent = transparent;
    material.needsUpdate = true;
    return material;
}
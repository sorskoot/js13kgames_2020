// const texture = new THREE.ImageUtils.loadTexture('js13k2020.webp');
// const textureLookup = new THREE.ImageUtils.loadTexture('js13k2020-colors.webp');
const texture = new THREE.ImageUtils.loadTexture('data:image/webp;base64,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');
const textureLookup = new THREE.ImageUtils.loadTexture('data:image/webp;base64,UklGRiQBAABXRUJQVlA4TBgBAAAvBMACENfhxLa1pfpwd3dPVEbAAJgticoi0qjwPJGe+zjc1ratRBd3d4g0I6INMmqhPgog95zIZiI3x7Vtq8mNu7u7J52mhlTAlH4YO8ycRSBpY/Px5A8AIH/if/whLOH1InCMTQRgws2PhzMAYLBYlvG+eYewAQAasBAKgMtEBgDBRE6r4csunn+e+CVMdA3rKYphOPmxnn5qfxwq13g641IC+bjbHZIRQESM9XfW4S/aDz51DpzbSsUOhsm81dKRIF1eiChSXx/EVrd2R4AVNKSm6unOjlFsPrGnuu2BQQCAZaPTbdu2GdH/OKpS5tpd1+hzXRT+zQqJBX3XRA70UDilichcpqFSwvb4QX7/ljuP8LNxPcQE');

/**
 * Creates a pixel shader material
 * @param {number} tileIndex index of the sprite to use as a map
 * @param {string} color Hex color - defaults to #ffffff
 */
function createPixelMaterial(
    tileIndex,
    color = '#ffffff',
    lookupIndex = -1,
    repeatX = 1,
    repeatY = 1,
    transparent = false,
    twosided = false) {
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
            spriteDimensions: { value: { x: 22.0, y: 1.0 } },
            repeat: { value: { x: repeatX, y: repeatY } },
            tint: { value: new THREE.Color(255, 255, 255) },
            tintAmount: { value: 0 }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
    });
    material.transparent = transparent;
    if (twosided) material.side = THREE.DoubleSide;
    material.needsUpdate = true;
    return material;
}
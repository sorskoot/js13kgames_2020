// const texture = new THREE.ImageUtils.loadTexture('js13k2020.webp');
// const textureLookup = new THREE.ImageUtils.loadTexture('js13k2020-colors.webp');
const texture = new THREE.ImageUtils.loadTexture('data:image/webp;base64,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');
const textureLookup = new THREE.ImageUtils.loadTexture('data:image/webp;base64,UklGRioBAABXRUJQVlA4TB4BAAAvBMADENfhxLZttXlhZmYmnxFkAJltVGxXZV0tg4oq8zjc1ratRBd3d4g0I6INMmqhPgog95zIZiI3x7Vtq8mNu7u7J52mhlTAlH4YO8ycRSBpY/Px5A8AIH/if/whLOH1InCMTQRgws2PhzMAYLBYlvG+eYewAQAasBAKgMtE5gCCiZxWw5ddPP888UtY0jWspyiG4eTHZvTT8ONQucbTGZcSyMfd7pAsAETEmH5nI/6i/eBT51DvsUYyg2Gy2mrpSJAuL0QU6a4PYqubuiPAChpSX/V0Z8coNp/Y0972wCAAwDLDbdu23T/cI0T0P/eykNhm01TqWGaZe9JcZEDX1qENXRSMSSzQp6ErJL/enp9dn+lMA3wtXPURAX4B');

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
            spriteDimensions: { value: { x: 23.0, y: 1.0 } },
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
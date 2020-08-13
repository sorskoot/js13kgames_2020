#define SPRITE_WIDTH 16.
#define SPRITE_HEIGHT 16.

precision highp float;

// Uniform variables
uniform sampler2D DiffuseTexture;
uniform float index;
uniform vec2 spriteDimensions;
uniform vec3 fogColor;

uniform vec3 tint;
uniform float tintAmount;

uniform float alphatest;

// Input variables
varying vec2 FragTexcoord;

varying float fogDepth;
uniform float fogStart;
uniform float fogEnd;

uniform vec2 vUv;

#define BlendAddf(base,blend)min(base+blend,1.)

void main()
{
    float u=clamp(floor(mod(FragTexcoord.x,1.)*SPRITE_WIDTH)/SPRITE_WIDTH,0.,1.)/spriteDimensions.x+(index*1./spriteDimensions.x);//+1.0/128.0;
    float v=clamp(floor(mod(FragTexcoord.y,1.)*SPRITE_HEIGHT)/SPRITE_HEIGHT,0.,1.)/spriteDimensions.y;//+1.0/16.0;    
    vec2 UV=vec2(u,v);
    vec4 texturedColor=texture2D(DiffuseTexture,vec2(UV.x,UV.y));  
    if(texturedColor.a<alphatest)discard;   
    gl_FragColor=texturedColor;
}
#define SPRITE_WIDTH 16.
#define SPRITE_HEIGHT 16.

precision highp float;

// Uniform variables
uniform sampler2D DiffuseTexture;
uniform float index;
uniform sampler2D Lookup;
uniform float lookupIndex;
uniform float lookupShift;

uniform vec2 spriteDimensions;

uniform vec3 tint;
uniform float tintAmount;

uniform float alphatest;

// Input variables
varying vec2 FragTexcoord;

uniform vec2 vUv;

#define BlendAddf(base,blend)min(base+blend,1.)

void main()
{
    float u=clamp(floor(mod(FragTexcoord.x,1.)*SPRITE_WIDTH)/SPRITE_WIDTH,0.,1.)/spriteDimensions.x+(index*1./spriteDimensions.x);//+1.0/128.0;
    float v=clamp(floor(mod(FragTexcoord.y,1.)*SPRITE_HEIGHT)/SPRITE_HEIGHT,0.,1.)/spriteDimensions.y;
    vec2 UV=vec2(u,v);
  
    vec4 texturedColor=texture2D(DiffuseTexture,vec2(UV.x,UV.y));  
  
    if( lookupIndex >= 0.0 && texturedColor.a > 0.0 && 
                            texturedColor.r == texturedColor.g && 
                            texturedColor.r == texturedColor.b){
        float ind = mod(texturedColor.r+(lookupShift/5.0),1.0);//mod((texturedColor.x*5.0)+lookupShift,5.0)/5.0; 
        // float ind = texturedColor.r (lookupShift/8.0);
        // if(ind >= 1.0){
        //     ind -= 1.0;
        // }

        float y = 1.0-lookupIndex*(1.0/16.0);
		texturedColor = texture2D(Lookup,vec2(ind, y));  
	}

    if(texturedColor.a<alphatest)discard;   
   
    gl_FragColor=texturedColor;
}


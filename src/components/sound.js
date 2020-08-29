let audiopool = [];
for (let i = 0; i < 50; i++) {
    audiopool.push(new Audio());
}
let currentSfxIndex = 0;
const SFX_FIRE = [0,0.0466,0.103,0.024,0.2249,0.6702,0.1782,-0.2617,0.0137,0.0222,0.0414,-0.0043,0.05,0.0513,0.0927,0.012,0.1749,-0.0778,1,-0.0314,0.0046,0.179,0.0127,0.5],
    SFX_EXPLOSION = [3, , 0.58, 0.35, 0.0547, 0.16, , -0.18, , , , -0.3774, 0.6619, , , , 0.598, -0.1327, 1, , , , , 0.28],
    SFX_GAMEOVER = [3, 0.09, 0.67, 0.35, 0.93, 0.2, , -0.12, , , , -0.3774, 0.62, , , , 0.1399, -0.3, 1, , , , , 0.28],
    SFX_SELECT = [1,,0.1628,,0.1462,0.473,,,,,,,,,,,,,1,,,0.1,,0.5],
    SFX_PLACE = [0,,0.0343,,0.2762,0.533,,-0.4588,,,,,,0.2202,,,,,1,,,,,0.5];

let soundfx = [  
    jsfxr(SFX_FIRE),
    jsfxr(SFX_EXPLOSION),
    jsfxr(SFX_GAMEOVER),
    jsfxr(SFX_SELECT),
    jsfxr(SFX_PLACE)];

const sound = {
    play: function (params) {
        audiopool[currentSfxIndex].src = soundfx[params];      
        audiopool[currentSfxIndex].play();
        currentSfxIndex = (currentSfxIndex + 1) % 50;
    },
    fire:0,
    explosion:1,
    gameover:2,
    select:3,
    place:4
}

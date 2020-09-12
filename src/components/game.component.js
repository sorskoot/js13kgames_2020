/*
const 
    TOWER_INDEX = 0,
    TOWER_COST = 1,
    TOWER_REACH = 2,
    TOWER_DAMAGE = 3,
    TOWER_LIFE = 4,
    TOWER_UPGRADE1 = 5,
    TOWER_UPGRADE2 = 6,
    TOWER_REACH2 = 7,s
    TOWER_REACH3 = 8,
    TOWER_DAMAGE2 = 9,
    TOWER_DAMAGE3 = 10,
    TOWER_LIFE2 = 11,
    TOWER_LIFE3 = 12,
    TOWER_SPECIALENEMY = 13,
    TOWER_SE_DAMAGE = 14,
    TOWER_SE_DAMAGE2 = 15,
    TOWER_SE_DAMAGE3 = 16
*/

/*
const GAMEMODE_NONE = 0,
    GAMEMODE_PLACE = 1,
    GAMEMODE_UPGRADE = 2;
*/

/*
const ARGUMENT_UPGRADE = 5,
    ARGUMENT_TOWER = 7;
*/
/*
const STATE_TITLE = 0,
    STATE_PLAY = 1,
    STATE_GAMEOVER = 2;
*/
/*
const START_SCORE = 25;
const RAYCASTER_FAR = 40;
*/


const forwardVector = new THREE.Vector3(0, 0, 1);
const zeroVector= new THREE.Vector3(0,0,0);

AFRAME.registerComponent('game', {
    init: function () {
        this.s = level.start;
        this.el.addEventListener('kill', this.kill.bind(this))

        this.currentlyPlacing = 0;
        this.placable =
            [
             // index, cost, reach, damage, life, upgrade cost 1, upgrade cost 2, reach 2, reach 3, damage 2, damage 3, life 2, life 3, special enemy, se damange 1,2,3                          
                [0,    1,    7,     1,      50,    25,            50,             9,      13,      2,        5,        100,    200,    3,             2,   3,  4],/*0:shield - se: ad*/
                [1,    3,    7,     2,      60,    50,            100,            9,      13,      4,        10,       120,    250,    1,             6,   8, 10],/*1:Certificate - se: unsafe */
                [2,    5,    7,     3,      70,    75,            150,            9,      13,      6,        15,       160,    300,    4,             9,  14, 19],/*2:First Aid - virus*/
                [3,    8,    7,     3,      80,   100,            200,            9,      13,      8,        20,       200,    400,    2,             11, 16, 21],/*3:Magnifier -  phising */
                [4,    10,   7,     3,      90,   150,            300,            9,      13,      10,       25,       250,    500,    0,             13, 18, 23],/*4:Firewall - spyware */
            ]
            
            this.el.sceneEl.addEventListener('enter-vr', this.enterVr.bind(this));
            this.el.sceneEl.addEventListener('exit-vr', this.exitVr.bind(this));

            this.updateScore(25);
            this.menu = document.getElementById('menu');
            this.titlescreen = document.getElementById('titlescreen');
            this.gameoverscreen = document.getElementById('gameoverscreen');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand-menu');
        this.cursor = document.getElementById('cursor');
        this.rightHand = document.getElementById('right-hand');
        this.towerTarget = document.getElementById('defense');

        this.container = document.getElementById('world');
        this.mode = 0/*GAMEMODE_NONE*/;
        this.isVR = false;
        
        this.messages = document.querySelectorAll('.message');
        this.setMessage('');
        
        this.state = 0/*STATE_TITLE*/;
        this.processState();
        this.rightHand.setAttribute('visible', 'false');
        
    },
    tick:function(){
        if(audioContext){
         const pos = this.el.camera.getWorldPosition(zeroVector);
         audioContext.listener.positionX.value = pos.x;
         audioContext.listener.positionY.value = pos.y;
         audioContext.listener.positionZ.value = pos.z;
         const dir = this.el.sceneEl.camera.getWorldDirection(forwardVector);
         audioContext.listener.forwardX.value = dir.x;
         audioContext.listener.forwardY.value = dir.y;
         audioContext.listener.forwardZ.value = dir.z;
        }
    },
    kill: function (score) {
        this.updateScore(this.score + score)
    },
    enterVr: function () {
        this.isVR = true;
        this.menu.remove();
        this.leftHand.setAttribute('visible', 'true');
        this.rightHand.setAttribute('visible', 'true');
        this.cursor.setAttribute('raycaster', { enabled: false });
        this.setRaycaster('.clickable, .upgradable');
    },
    exitVr: function () {
        this.isVR = false;
        this.menu.setAttribute('visible', 'true');
        this.leftHand.setAttribute('visible', 'false');
        this.rightHand.setAttribute('visible', 'false');
        this.rightHand.setAttribute('raycaster', { enabled: false });
        this.setRaycaster('.clickable, .upgradable');
    },
    clicked: function (sender, argument) {
        if (this.state !== 1/*STATE_PLAY*/) {
            if (argument === 42) {
                this.state = 1/*STATE_PLAY*/;
                this.processState();
            }
            return;
        }

        // check sender component type if it's menu, placeholder or tower
        switch (argument) {
            case 5/*ARGUMENT_UPGRADE*/: // upgrade
                this.mode = 2/*GAMEMODE_UPGRADE*/
                sound.play(3,this.el.camera);
                this.setRaycaster('.clickable, .upgradable');
                this.el.emit('item-selected', 5);
                break;
            case 7/*ARGUMENT_TOWER*/:
                if (this.mode === 1/*GAMEMODE_PLACE*/) {
                    if(this.score - this.placable[this.currentlyPlacing][1/*TOWER_COST*/] < 0){
                        this.el.emit('item-selected');
                        break;
                    }
                    this.setRaycaster('.clickable');
                    // replace placeholder                
                    this.updateScore(this.score - this.placable[this.currentlyPlacing][1/*TOWER_COST*/]);
                    sender.el.remove();
                    const newTower = document.createElement('a-entity');
                    newTower.setAttribute('mixin', 'template-defense');
                    newTower.classList.add('upgradable');
                    newTower.setAttribute("position", sender.el.object3D.position);
                    sound.play(6,sender.el.object3D);
                    newTower.setAttribute("tower", {
                        type: this.placable[this.currentlyPlacing][0/*TOWER_INDEX*/],
                        data: this.placable[this.currentlyPlacing],
                        rot: sender.el.components['placeholder-entity'].data.rot
                    });
                    this.towerTarget.append(newTower);
                }

                if (this.mode === 2/*GAMEMODE_UPGRADE*/) {
                    
                    var tower = sender.el.components["tower"];
                    if (!tower || tower.data.level == 2) break;
                    if (tower.data.level == 0) {
                        if (this.score - tower.data.data[5/*TOWER_UPGRADE1*/] < 0) {
                            this.setMessage(`Not enough money to upgrade ($${tower.data.data[5/*TOWER_UPGRADE1*/]}0K)`);
                            return;
                        }
                        this.updateScore(this.score - tower.data.data[5/*TOWER_UPGRADE1*/]);
                    } else {
                        if (this.score - tower.data.data[6/*TOWER_UPGRADE2*/] < 0) {
                            this.setMessage(`Not enough money to upgrade ($${tower.data.data[6/*TOWER_UPGRADE2*/]}0K)`);
                            return;
                        }
                        this.updateScore(this.score -tower.data.data[6/*TOWER_UPGRADE2*/]);
                    }
                    sound.play(5,tower.el.object3D);
                    sender.el.setAttribute('tower', {
                        level: tower.data.level + 1,
                        animated: tower.data.level === 1
                    });
                    this.setRaycaster('.clickable');
                    this.el.emit('item-selected');
                }

                break;
            case 42:
                break
            default:
                this.mode = 1/*GAMEMODE_PLACE*/;
                this.setRaycaster('.clickable, .placable');
                sound.play(3,this.el.camera);
                this.currentlyPlacing = argument;
                this.el.emit('item-selected', argument);
        }

    },
    processState: function () {
        switch (this.state) {
            case 0/*STATE_TITLE*/:
                document.querySelectorAll('.screen').forEach(e=>e.classList.add('clickable'));
                this.gameoverscreen.setAttribute('visible', 'false');
                this.titlescreen.setAttribute('visible', 'true');
                this.menu.setAttribute('visible', 'false');
                this.leftHand.setAttribute('visible', 'false');
                break;
            case 1/*STATE_PLAY*/:
                document.querySelectorAll('.screen').forEach(e=>e.classList.remove('clickable'));
                InitAudio();
                this.createLevel();
                this.updateScore(25);
                this.el.emit('startGame');
                this.gameoverscreen.setAttribute('visible', 'false');
                this.menu.setAttribute('visible', this.isVR ? 'false' : 'true');
                this.leftHand.setAttribute('visible', this.isVR ? 'true' : 'false');
                this.titlescreen.setAttribute('visible', 'false');
                break;
            case 2/*STATE_GAMEOVER*/:
                document.querySelectorAll('.screen').forEach(e=>e.classList.add('clickable'));
                this.gameoverscreen.setAttribute('visible', 'true');
                this.menu.setAttribute('visible', 'false');
                this.leftHand.setAttribute('visible', 'false');
                break;
        }
    },

    createLevel: function () {
        document.getElementById('defense').innerHTML = '';
        document.getElementById('world').innerHTML = '';

        // Create spawners
        level.targets.forEach((t, i) => {
            const spawner = document.createElement('a-entity');
            spawner.setAttribute('mixin', 'template-spawner');
            spawner.innerHTML = '<a-entity block-entity position="0 0 -.9"></a-entity>'
            const position = new THREE.Vector3(...t[0]);
            spawner.setAttribute("position", position)
            const direction =
                new THREE.Vector3(...t[1]).sub(position).normalize();
            let rotation = Math.round(direction.x) < 0 ? 270 : 90;
            if (Math.round(direction.z) < 0) rotation = 180;
            else if (Math.round(direction.z) > 0) rotation = 0;
            spawner.setAttribute("rotation", { y: rotation })

            spawner.setAttribute('spawner', { id: i });
            this.container.append(spawner);
        })

        // Create browser
        this.page = document.createElement('a-entity');
        this.page.setAttribute('mixin', 'template-page');
        this.page.setAttribute("position",
            new THREE.Vector3(...level.end))
        this.container.append(this.page);

        // create placeholders
        level.placeholders.forEach(pos => {
            this.placePlaceholder(pos);
        });

        // create static world
        level.box.forEach((t, i) => {
            const box = document.createElement('a-box');
            box.setAttribute("position", new THREE.Vector3(...t[0]))
            box.setAttribute("scale", new THREE.Vector3(t[1], t[1], t[1]))
            box.setAttribute("pixelshader-material", `index:12;repeat:${t[1]} ${t[1]};lookup:${t[2]}`)
            this.container.append(box);
        })
    },
    nextTarget: function (targetIndex, spawner) {
        if (targetIndex >= 0 && targetIndex < level.targets[spawner].length) {
            return level.targets[spawner][targetIndex];
        }
        return null;
    },
    gameOver: function () {
        if(this.state == 2/*STATE_GAMEOVER*/) return;
        this.state = 2/*STATE_GAMEOVER*/;

        sound.play(2,this.el.camera);
        this.el.emit('gameOver');        

        createExplosion(this.container, this.page.object3D.position, '#ffffff', .3,  32, 4000, 8,1500);       
        this.page.remove();        
       
        this.processState();
    },
    updateScore(newScore) {
        this.score = newScore;
        this.el.emit('update-score', newScore);
    },
    placePlaceholder: function (pos) {
        const ph = document.createElement('a-entity');
        ph.setAttribute('mixin', 'template-placeholder');
        ph.setAttribute("click-handler", "7");
        ph.setAttribute("position", new THREE.Vector3(...pos.slice(0, 3)));
        ph.setAttribute("rotation", {
            x: pos[3] === 0 ? 90 : 0,
            y: pos[3] === 2 ? 90 : 0,
            z: pos[3] === 1 ? 90 : 0,
        })
        ph.setAttribute("placeholder-entity", { rot: pos[3] });
        ph.classList.add("clickable");
        this.container.append(ph);
    },
    setRaycaster(objects) {
        if (this.isVR) {
            this.rightHand.setAttribute('raycaster', { objects: objects, enabled: true, far: 40 });

            this.rightHand.components.raycaster.refreshObjects();
        } else {
            this.cursor.setAttribute('raycaster', { objects: objects, enabled: true, far: 40 });
        }
    },
    setMessage(message) {
        this.messages.forEach(m => m.setAttribute("text", { value: message }));
        if(!message){
            setTimeout(()=>this.setMessage(''), 7000);
        }
    }
});
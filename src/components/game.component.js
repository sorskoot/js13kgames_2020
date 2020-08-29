import { findEntity } from "../lib/helpers";
import { sound } from "../lib/sound";
import level from "./levels/level01.json";

const TOWER_INDEX = 0,
    TOWER_COST = 1;

const GAMEMODE_NONE = 0,
    GAMEMODE_PLACE = 1,
    GAMEMODE_UPGRADE = 2;

const ARGUMENT_UPGRADE = 5,
    ARGUMENT_TOWER = 7;

const UPGRADE_PRICE_1 = 5,
    UPGRADE_PRICE_2 = 10;

const STATE_TITLE = 0,
    STATE_PLAY = 1,
    STATE_GAMEOVER = 2;

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.s = level.start;
        this.el.addEventListener('select', this.select.bind(this))
        this.el.addEventListener('kill', this.kill.bind(this))
        this.el.addEventListener('fire', (data) => {
            if (this.state != STATE_PLAY) {
                this.state = STATE_PLAY;
                this.processState();
            }
        });
        this.currentlyPlacing = 0;
        this.placable =
            [
        // index, cost, target, damage                          
        /*0:shield*/[4, 1],
        /*1:Certificate */[14, 2],
        /*2:First Aid*/[13, 3],
        /*3:Magnifier*/[10, 4],
        /*4:Firewall */[20, 5],
            ]
        // Test for the HoloLens
        // this.el.addEventListener('fire', ()=>{
        //     let ent = document.createElement("a-entity");
        //     ent.setAttribute("explosion", `color:#FF0000`);
        //     ent.setAttribute("position", this.el.object3D.position);
        //     this.el.append(ent);
        // });

        this.el.sceneEl.addEventListener('enter-vr', this.enterVr.bind(this));
        this.el.sceneEl.addEventListener('exit-vr', this.exitVr.bind(this));

        this.score = 10;

        this.menu = document.getElementById('menu');
        this.titlescreen = document.getElementById('titlescreen');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand-menu');
        this.cursor = document.getElementById('cursor');
        this.raycaster = this.cursor.components.raycaster;
        this.towerTemplate = document.getElementById('template-defense');
        this.towerTarget = document.getElementById('defense');
        
        this.container=document.getElementById('world');
        this.spawnerTemplate=document.getElementById('template-spawner');
        this.pageTemplate=document.getElementById('template-page');
        this.placeholderTemplate=document.getElementById('template-placeholder');

        this.el.emit("update-score", this.score);
        this.mode = GAMEMODE_NONE;
        this.isVR = false;

        this.state = STATE_TITLE;
        this.processState();
    },


    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click', {});
    },
    kill: function (score) {
        this.score += score;
        this.el.emit("update-score", this.score);
    },
    enterVr: function () {
        this.isVR = true;
        this.menu.setAttribute('visible', 'false');
        this.leftHand.setAttribute('visible', 'true');
    },
    exitVr: function () {
        this.isVR = false;
        this.menu.setAttribute('visible', 'true');
        this.leftHand.setAttribute('visible', 'false');
    },
    clicked: function (sender, argument) {
        if(this.state!==STATE_PLAY) return;
        // check sender component type if it's menu, placeholder or tower
        switch (argument) {
            case ARGUMENT_UPGRADE: // upgrade
                this.mode = GAMEMODE_UPGRADE
                sound.play(sound.select);
                this.cursor.setAttribute('raycaster', { objects: '.clickable, .upgradable' });
                break
            case ARGUMENT_TOWER:
                if (this.mode === GAMEMODE_PLACE) {
                    if (this.score - this.placable[this.currentlyPlacing][TOWER_COST] < 0) {
                        return;
                    }
                    this.cursor.setAttribute('raycaster', { objects: '.clickable' });
                    // replace placeholder                
                    sound.play(sound.place);
                    this.score -= this.placable[this.currentlyPlacing][TOWER_COST]
                    this.el.emit("update-score", this.score);
                    sender.el.remove();
                    const newTower = this.towerTemplate.cloneNode(true);
                    newTower.classList.add('upgradable');
                    newTower.setAttribute("position", sender.el.object3D.position);
                    newTower.setAttribute("td-tower", {
                        type: this.placable[this.currentlyPlacing][TOWER_INDEX]
                    });
                    this.towerTarget.append(newTower);
                }

                if (this.mode === GAMEMODE_UPGRADE) {
                    var tower = sender.el.components["td-tower"];
                    if (tower.data.level == 2) break;
                    if (tower.data.level == 0) {
                        if (this.score - UPGRADE_PRICE_1 < 0) {
                            return;
                        }
                        this.score -= UPGRADE_PRICE_1;
                    } else {
                        if (this.score - UPGRADE_PRICE_2 < 0) {
                            return;
                        }
                        this.score -= UPGRADE_PRICE_2;
                    }
                    this.el.emit("update-score", this.score);
                    sender.el.setAttribute('td-tower', { level: tower.data.level + 1 });
                    this.cursor.setAttribute('raycaster', { objects: '.clickable' });
                }

                break;
            default:
                this.mode = GAMEMODE_PLACE;
                this.cursor.setAttribute('raycaster', { objects: '.clickable, .placable' });
                sound.play(sound.select);
                this.currentlyPlacing = argument;
        }

    },
    processState: function () {
        switch (this.state) {
            case STATE_TITLE:
                this.titlescreen.setAttribute('visible','true');
                this.menu.setAttribute('visible','false');
                this.leftHand.setAttribute('visible', 'false');
                break;
            case STATE_PLAY:
                this.createLevel();
                this.menu.setAttribute('visible', this.isVR?'false':'true');
                this.leftHand.setAttribute('visible', this.isVR?'true':'false');
                this.titlescreen.setAttribute('visible','false');
                break;
            case STATE_GAMEOVER:
                this.menu.setAttribute('visible','false');
                this.leftHand.setAttribute('visible', 'false');
                break;
        }
    },

    createLevel: function () {
        
        const spawner = this.spawnerTemplate.cloneNode(true);
        spawner.setAttribute("position", new THREE.Vector3(...level.targets[0]))
        this.container.append(spawner);

        const page = this.pageTemplate.cloneNode(true);
        page.setAttribute("position", 
            new THREE.Vector3(...level.targets[level.targets.length - 1]))
        this.container.append(page);

        level.placeholders.forEach(pos => {
            const ph = this.placeholderTemplate.cloneNode(true);
            ph.setAttribute("click-handler", "7");
            ph.setAttribute("position", new THREE.Vector3(...pos));
            ph.classList.add("clickable")
            this.container.append(ph);
        });
    },
    nextTarget: function (targetIndex) {

        if (targetIndex >= 0 && targetIndex < level.targets.length) {
            return level.targets[targetIndex];
        }
        return null;
    }

});

const setParent = (el, newParent) => newParent.appendChild(el);
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

const START_SCORE = 10;

AFRAME.registerComponent('game', {
    init: function () {
        this.s = level.start;
        this.el.addEventListener('kill', this.kill.bind(this))

        // this.el.addEventListener('fire', () => {
        //     if (this.state != STATE_PLAY) {
        //         this.state = STATE_PLAY;
        //         this.processState();
        //     }
        // });


        this.currentlyPlacing = 0;
        this.placable =
            [

        // index, cost, target, damage                          
        /*0:shield*/[4, 1,],
        /*1:Certificate */[14, 2],
        /*2:First Aid*/[13, 3],
        /*3:Magnifier*/[10, 4],
        /*4:Firewall */[20, 5],
            ]

        this.el.sceneEl.addEventListener('enter-vr', this.enterVr.bind(this));
        this.el.sceneEl.addEventListener('exit-vr', this.exitVr.bind(this));

        this.updateScore(START_SCORE);
        this.menu = document.getElementById('menu');
        this.titlescreen = document.getElementById('titlescreen');
        this.gameoverscreen = document.getElementById('gameoverscreen');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand-menu');
        this.cursor = document.getElementById('cursor');
        this.raycaster = this.cursor.components.raycaster;
        this.towerTemplate = document.getElementById('template-defense');
        this.towerTarget = document.getElementById('defense');

        this.container = document.getElementById('world');
        this.spawnerTemplate = document.getElementById('template-spawner');
        this.pageTemplate = document.getElementById('template-page');
        this.placeholderTemplate = document.getElementById('template-placeholder');


        this.mode = GAMEMODE_NONE;
        this.isVR = false;

        this.state = STATE_TITLE;
        this.processState();
    },
    kill: function (score) {
        this.updateScore(this.score + score)
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
        if (this.state !== STATE_PLAY) {
            if (argument === 42) {
                this.state = STATE_PLAY;
                this.processState();
            }
            return;
        }
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
                    this.updateScore(this.score - this.placable[this.currentlyPlacing][TOWER_COST]);
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
                        this.updateScore(this.score - UPGRADE_PRICE_1);
                    } else {
                        if (this.score - UPGRADE_PRICE_2 < 0) {
                            return;
                        }
                        this.updateScore(this.score - UPGRADE_PRICE_2);
                    }
                    sender.el.setAttribute('td-tower', {
                        level: tower.data.level + 1,
                        animated: tower.data.level === 1
                    });
                    this.cursor.setAttribute('raycaster', { objects: '.clickable' });
                }

                break;
            case 42:
                break
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
                this.gameoverscreen.setAttribute('visible', 'false');
                this.titlescreen.setAttribute('visible', 'true');
                this.menu.setAttribute('visible', 'false');
                this.leftHand.setAttribute('visible', 'false');
                break;
            case STATE_PLAY:
                this.createLevel();
                this.updateScore(START_SCORE);
                this.el.emit('startGame');
                this.gameoverscreen.setAttribute('visible', 'false');
                this.menu.setAttribute('visible', this.isVR ? 'false' : 'true');
                this.leftHand.setAttribute('visible', this.isVR ? 'true' : 'false');
                this.titlescreen.setAttribute('visible', 'false');
                break;
            case STATE_GAMEOVER:
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
            const spawner = this.spawnerTemplate.cloneNode(true);
            spawner.setAttribute("position", new THREE.Vector3(...t[0]))
            spawner.setAttribute('td-spawner', { id: i });
            this.container.append(spawner);
        })

        // Create browser
        const page = this.pageTemplate.cloneNode(true);
        page.setAttribute("position",
            new THREE.Vector3(...level.end))
        this.container.append(page);

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
        this.el.emit('gameOver');
        this.state = STATE_GAMEOVER;
        this.processState();
    },
    updateScore(newScore) {
        this.score = newScore;
        this.el.emit('update-score', newScore);
    },
    placePlaceholder:function(pos) {
        const ph = this.placeholderTemplate.cloneNode(true);
        ph.setAttribute("click-handler", "7");
        ph.setAttribute("position", new THREE.Vector3(...pos));
        ph.classList.add("clickable");
        this.container.append(ph);
    }
});

const setParent = (el, newParent) => newParent.appendChild(el);



import { findEntity } from "../lib/helpers";
import { sound } from "../lib/sound";

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.el.addEventListener('select', this.select.bind(this))
        this.el.addEventListener('kill', this.kill.bind(this))

        this.currentlyPlacing = 0;
        this.placable =
            [
        // index, cost, target, damage                          
        /*0:shield*/    [4, 1],
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

        this.score = 0;

        this.menu = document.getElementById('menu');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand-menu');

        this.towerTemplate = document.getElementById('template-defense');
        this.towerTarget = document.getElementById('defense');

        this.el.emit("update-score", this.score);
    },


    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click', {});
    },
    kill: function ({ detail }) {
        this.score += detail.value;
        this.el.emit("update-score", this.score);
        console.log(this.score);
    },
    enterVr: function () {        
        this.menu.setAttribute('visible','false');
        this.leftHand.setAttribute('visible','true');
    },
    exitVr: function () {
        this.menu.setAttribute('visible','true');
        this.leftHand.setAttribute('visible','false');        
    },
    clicked: function (sender, argument) {
        // check sender component type if it's menu, placeholder or tower
        switch (argument) {
            case 5: // upgrade
                break
            case 7:
                // replace placeholder
                sound.play(sound.place);
                sender.el.remove();
                const newTower = this.towerTemplate.cloneNode(true);
                newTower.setAttribute("position", sender.el.object3D.position);
                newTower.setAttribute("td-tower", {
                    type: this.placable[this.currentlyPlacing]
                });
                this.towerTarget.append(newTower);
                break;
            default:
                this.currentlyPlacing = argument;
        }

    }

});

const setParent = (el, newParent) => newParent.appendChild(el);
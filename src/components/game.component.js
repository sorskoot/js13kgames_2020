const { findEntity } = require("../lib/helpers");

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.el.addEventListener('select', this.select.bind(this))
        this.el.addEventListener('kill', this.kill.bind(this))

        this.currentlyPlacing = 0;
        this.placable =
        [
        /*0:shield*/[4],
        /*1:Certificate */[14],
        /*2:First Aid*/[13]
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
        this.leftHand = document.getElementById('left-hand');

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

    },
    exitVr: function () {

    }

});
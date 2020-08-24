const { findEntity } = require("../lib/helpers");

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.el.addEventListener('select', this.select.bind(this))        
        this.el.addEventListener('kill', this.kill.bind(this))
        
        this.el.sceneEl.addEventListener('enter-vr', this.enterVr.bind(this));
        this.el.sceneEl.addEventListener('exit-vr', this.exitVr.bind(this));

        this.score = 0;

        

        this.menu = document.getElementById('menu');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand');
        
        this.el.emit("update-score",this.score);
    },


    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click',{});
    },
    kill:function({ detail }){
        this.score += detail.value;
        this.el.emit("update-score",this.score);
        console.log(this.score);        
    },
    enterVr:function(){
     
    },
    exitVr:function(){
     
    }

});
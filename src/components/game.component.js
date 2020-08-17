const { findEntity } = require("../lib/helpers");

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.el.addEventListener('select', this.select.bind(this))        
        this.el.addEventListener('kill', this.kill.bind(this))
        this.score = 0;
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click',{});
    },
    kill:function({ detail }){
        this.score += detail.value;
        console.log(this.score);        
    }

});
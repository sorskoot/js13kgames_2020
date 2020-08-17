const { findEntity } = require("../lib/helpers");

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.el.addEventListener('select', this.select.bind(this))
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click',{});
    }
});
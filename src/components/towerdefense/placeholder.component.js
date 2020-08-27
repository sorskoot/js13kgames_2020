const { sound } = require("../../lib/sound");

AFRAME.registerComponent('td-placeholder', {
    schema: {},
    init: function () {
        this.templateDefense = document.getElementById('template-defense');
        this.target = document.getElementById('defense');
        
        this.el.addEventListener('click', () => {            
            sound.play(sound.place);
            this.el.remove();
            var game = this.el.sceneEl.components.game;
            const newDefense = this.templateDefense.cloneNode(true);
            newDefense.setAttribute("position", this.el.object3D.position);
            newDefense.setAttribute("td-tower",{type:game.placable[game.currentlyPlacing]});

            this.target.append(newDefense);
        })
     },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    tock: function (time, timeDelta, camera){ },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function(data) { }
});
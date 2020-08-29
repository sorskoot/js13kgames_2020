AFRAME.registerComponent('select-to-place', {
    schema: {default:0},
    init: function () {
        this.el.addEventListener('click', () => {
            sound.play(sound.select);
            this.el.sceneEl.components.game.currentlyPlacing = this.data;
        })
    }
});
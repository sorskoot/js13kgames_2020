AFRAME.registerComponent('disable-menu', {
     schema: {
         type: 'number'
     },
    init: function () {
        this.el.sceneEl.addEventListener('update-score', (e) => {
            if (e.detail< this.data) {
                this.el.object3D.scale.set(.5,.5,.5);

                this.el.classList.remove('clickable');
            } else {
                this.el.object3D.scale.set(1,1,1);
                this.el.classList.add('clickable');
            }
        });
    }

});
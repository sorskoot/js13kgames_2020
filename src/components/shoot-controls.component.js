/* global AFRAME */
AFRAME.registerComponent('shoot-controls', {
    schema: {
        hand: { default: 'left' }
    },
    init: function () {
        this.game=document.querySelector('[game]')
        // this.el.addEventListener('buttondown', ()=>{
        //     this.game.emit('fire');
        // });
    },
    update: function () {
        var el = this.el;
        var config = {
            hand: this.data.hand,
            model: false
          };

        el.setAttribute('keyboardcontrols', {});
        el.setAttribute('vive-controls', config);
        el.setAttribute('oculus-touch-controls', config);
        el.setAttribute('windows-motion-controls', config);
        if (this.data.hand === 'right') {
            el.setAttribute('laser-controls', config)
        }
       
    }
});

AFRAME.registerComponent('keyboardcontrols', {
    init: function () {
        let reload = false;
        
         document.body.addEventListener('keydown', e => {
        
             if (e.keyCode === 32 && !reload) {
                 reload = true;
                 this.el.sceneEl.components.game.clicked(this,42);
             }
         });

        document.body.addEventListener('keyup', e => {
            if (e.keyCode === 32) {
                reload = false;
            }
        });
    }
});
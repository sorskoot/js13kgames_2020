AFRAME.registerComponent('disable-menu', {
     schema: {
         type: 'number'
     },
    init: function () {
        this.enabled = true;
        this.isSelected = false;
        this.oldPos = this.el.object3D.position.z;
        this.el.sceneEl.addEventListener('update-score', (e) => {
            let p = this.el.sceneEl.components['game'].placable[this.data];
            if (p && e.detail< p[1]) {
                this.el.object3D.scale.set(.5,.5,.5);
                this.el.object3D.position.z = this.oldPos;
                this.el.classList.remove('clickable');
                this.enabled = false;
            } else {
                this.el.object3D.scale.set(1,1,1);
                this.el.classList.add('clickable');
                this.enabled = true;
            }
        });
        
        this.el.sceneEl.addEventListener('item-selected', (e) => {
            if (e.detail === this.data) {
                this.el.object3D.position.z = this.oldPos + .75
                this.isSelected = true;
            } else {
                this.el.object3D.position.z = this.oldPos;
                if(this.enabled) this.el.object3D.scale.set(1,1,1) 
                else this.el.object3D.scale.set(.5,.5,.5) 
                this.isSelected = false;
            }
        });
    }

});
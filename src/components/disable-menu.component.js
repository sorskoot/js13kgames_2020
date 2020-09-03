AFRAME.registerComponent('disable-menu', {
     schema: {
         type: 'number'
     },
    init: function () {
        this.el.sceneEl.addEventListener('update-score', (e) => {
            if (e.detail< this.data) {
                console.log(e.detail+' < '+this.data)
                this.el.setAttribute('scale', ".5 .5 .5");

                this.el.classList.remove('clickable');
            } else {
                console.log(e.detail+' >= '+this.data)
                this.el.setAttribute('scale', "1 1 1");
                this.el.classList.add('clickable');
            }
        });
    }

});
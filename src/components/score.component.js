AFRAME.registerComponent('score', {
    init: function () {
        document.querySelector('[game]')
            .addEventListener('update-score', this.scoreUpdate.bind(this));        
    },
    scoreUpdate: function ({ detail }) {
        
        let score = 0;
        if(detail > 0 && detail < 100){
            score = `${detail * 10}K`;
        }else if(detail >= 100){
            score = `${(detail * 10)/1000.0}M`
        }

        this.el.setAttribute('text',`value:$${score}`);
    }
});
AFRAME.registerComponent('td-placeholder', {
    schema: {},
    init: function () {
        this.templateDefense = document.getElementById('template-defense');
        this.target = document.getElementById('defense');
        
        this.el.addEventListener('click', (evt) => {
            this.el.remove();
            const newDefense = this.templateDefense.cloneNode(true);
            newDefense.setAttribute("position", this.el.object3D.position);
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
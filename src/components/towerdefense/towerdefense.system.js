AFRAME.registerSystem('td-tower-defense', {
    schema: {
        page:{
            type:'selector'
        },
        start:{
            type:'selector'
        },
        container:{
            type:'selector'
        }

    },
    init: function () {
        console.log('tower-defense initialized')
        this.targets = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 25),
            new THREE.Vector3(25, 0, 0),
            new THREE.Vector3(25, 10, 0),
            new THREE.Vector3(0, 10, 25)
        ]
        this.update();
    },
    update: function(){
        const spawner = this.data.start.cloneNode(true);
        spawner.setAttribute("position", this.targets[0])
        this.data.container.append(spawner);

        const page = this.data.page.cloneNode(true);
        page.setAttribute("position", this.targets[this.targets.length-1])
        this.data.container.append(page);
    },
    nextTarget: function (targetIndex) {
        
        if (targetIndex >= 0 && targetIndex < this.targets.length) {
            return this.targets[targetIndex];
        }
        return null;
    }
});
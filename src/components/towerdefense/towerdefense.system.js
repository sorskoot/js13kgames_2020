AFRAME.registerSystem('td-tower-defense', {
    schema: {},
    init: function () {
        console.log('tower-defense initialized')
        this.targets = [
            new THREE.Vector3(0, 0, 25),
            new THREE.Vector3(25, 0, 0),
            new THREE.Vector3(25, 10, 0),
            new THREE.Vector3(0, 10, 25)
        ]
    },

    nextTarget: function (targetIndex) {
        
        if (targetIndex >= 0 && targetIndex < this.targets.length) {
            return this.targets[targetIndex];
        }
        return null;
    }
});
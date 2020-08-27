AFRAME.registerSystem('td-tower-defense', {
    schema: {
        page: {
            type: 'selector'
        },
        start: {
            type: 'selector'
        },
        container: {
            type: 'selector'        
        },
        placeholder: {
            type: 'selector'
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
        this.placeholders = [
            new THREE.Vector3(2, 0, 20),
            new THREE.Vector3(-2, 0, 20),
            new THREE.Vector3(2, 0, 15),
            new THREE.Vector3(-2, 0, 15),
            new THREE.Vector3(2, 0, 10),
            new THREE.Vector3(-2, 0, 10),
            new THREE.Vector3(2, 0, 5),
            new THREE.Vector3(-2, 0, 5),

            new THREE.Vector3(25, 10, -2),
            new THREE.Vector3(25, 10, 2),
            new THREE.Vector3(25, 8, 0),
            new THREE.Vector3(25, 12, 0),
        ];

        const spawner = this.data.start.cloneNode(true);
        spawner.setAttribute("position", this.targets[0])
        this.data.container.append(spawner);

        const page = this.data.page.cloneNode(true);
        page.setAttribute("position", this.targets[this.targets.length - 1])
        this.data.container.append(page);

        this.placeholders.forEach(pos => {
            const ph = this.data.placeholder.cloneNode(true);
            ph.setAttribute("click-handler", "7");
            ph.setAttribute("position", pos)
            ph.classList.add("clickable")
            this.data.container.append(ph);
        });
    },
    nextTarget: function (targetIndex) {

        if (targetIndex >= 0 && targetIndex < this.targets.length) {
            return this.targets[targetIndex];
        }
        return null;
    }
});
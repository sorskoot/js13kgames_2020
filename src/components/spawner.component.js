AFRAME.registerComponent('td-spawner', {
    schema: {
        speed: { default: 300 },
        container: { type: 'selector' },
        enemy: { type: 'selector' },
        id:{default:-1}
    },

    init: function () {
        this.spawning = false;
        this.game=this.el.sceneEl.components.game;
        this.countdown = this.data.speed;
        this.e =[
        // health, value                       
        /*0:ads*/[ 5, 1 ],
        /*1:unsecure */[10,2],
        /*2:virus*/[15,3],
        /*3:phishing*/[20,4],
        /*4:spyware */[30,5],
        ];
    },

    tick: function (time, timeDelta) {
        if (this.game.state === STATE_PLAY) {
            this.countdown -= timeDelta;
            if (this.countdown < 0) {
                this.countdown = this.data.speed;
                const NewEnemy = this.data.enemy.cloneNode(true);
                const en = ~~(Math.random() * 5);
                
                NewEnemy.setAttribute("td-enemy",
                    {
                        type: en,
                        speed: 1,
                        health: this.e[en][0]*3,
                        value: this.e[en][1],
                        spawner:this.data.id
                    })
                NewEnemy.setAttribute("position", this.el.object3D.position)
                this.data.container.append(NewEnemy);
                // spawn enemy

            }
        }
    }
});
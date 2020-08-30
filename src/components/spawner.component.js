AFRAME.registerComponent('td-spawner', {
    schema: {
        speed: { default: 300 },
        container: { type: 'selector' },
        enemy: { type: 'selector' }
    },

    init: function () {
        this.spawning = false;
        this.game=this.el.sceneEl.components.game;
        this.countdown = this.data.speed;
        // this.el.sceneEl.addEventListener('gameOver',
        //     function () {
        //         this.spawning = false
        //     }.bind(this)
        // );
        // this.el.sceneEl.addEventListener('startGame',          
        // function () {
        //     this.spawning = true
        // }.bind(this));
    },

    tick: function (time, timeDelta) {
        if (this.game.state === STATE_PLAY) {
            this.countdown -= timeDelta;
            if (this.countdown < 0) {
                this.countdown = this.data.speed;
                const NewEnemy = this.data.enemy.cloneNode(true);
                NewEnemy.setAttribute("td-enemy",
                    {
                        type: ~~(Math.random() * 5),
                        speed: 1,
                        health: 100,
                        value: 2
                    })
                NewEnemy.setAttribute("position", this.el.object3D.position)
                this.data.container.append(NewEnemy);
                // spawn enemy

            }
        }
    }
});
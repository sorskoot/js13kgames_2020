/*

- 3 Ads                   <--> 0 Shield - Ad blocker
- 1 Unsecure connection   <--> 1 Certificate
- 4 Virus                 <--> 2 First Aid (Virus Scanner)
- 2 Phishing              <--> 3 Magnifying glass
- 0 Spyware               <--> 4 Firewall

*/

const waves =
    [
        /*target 0*/
        [
            { s: 3000, n: 10, e: [3] },
            { s: 3000, n: 10, e: [1, 3] },
            { s: 3000, n: 1, e: [4] },
            { s: 3000, n: 10, e: [1, 3] },
            { s: 1500, n: 50, e: [3, 0, 2] },
            { s: 1500, n: 99999, e: [4] }],
        /*target 1*/
        [
            { s: 3000, n: 10, e: [3] },
            { s: 3000, n: 10, e: [1, 3] },
            { s: 3000, n: 1, e: [4] },
            { s: 3000, n: 10, e: [1, 3] },
            { s: 1500, n: 50, e: [3, 0, 2] },
            { s: 1500, n: 99999, e: [4] }],
        [ { s: 1500, n: 50, e: [3, 0, 2] },]
    ];

AFRAME.registerComponent('td-spawner', {
    schema: {
        speed: { default: 300 },
        container: { type: 'selector' },
        enemy: { type: 'selector' },
        id: { default: -1 }
    },

    init: function () {
        this.spawning = false;
        this.game = this.el.sceneEl.components.game;

        this.e = [
        // health, value                       
        /*0:ads*/[5, 1],
        /*1:unsecure */[10, 2],
        /*2:virus*/[15, 3],
        /*3:phishing*/[20, 4],
        /*4:spyware */[30, 5],
        ];

        this.wavestep = 0;
        this.waveindex = 0;
        this.wavecount = 0;
        if (~this.data.id)
            this.countdown = waves[this.data.id][this.wavestep].s;
    },

    tick: function (time, timeDelta) {
        if (this.game.state === STATE_PLAY) {
            this.countdown -= timeDelta;
            if (this.countdown < 0 -(Math.random() * 300)) {
                sound.play(sound.spawn);
                const wavedata = waves[this.data.id][this.wavestep];
                this.countdown = wavedata.s;
                const NewEnemy = document.createElement('a-entity');
                NewEnemy.setAttribute('mixin', 'enemy');//this.data.enemy.cloneNode(true);

                this.wavecount++;
                this.waveindex = (this.waveindex + 1) % wavedata.e.length;
                if (this.wavecount >= wavedata.n) {
                    this.wavestep = Math.min(this.wavestep + 1, waves[this.data.id].length - 1);
                    this.wavecount = 0;
                    this.waveindex = 0;
                    this.countdown = waves[this.data.id][this.wavestep].s;
                }
                const en = wavedata.e[this.waveindex];
                NewEnemy.setAttribute("td-enemy",
                    {
                        type: en,
                        speed: 1,
                        health: this.e[en][0] * 3,
                        value: this.e[en][1],
                        spawner: this.data.id
                    })
                NewEnemy.setAttribute("position", this.el.object3D.position)
                this.data.container.append(NewEnemy);
                // spawn enemy

            }
        }
    }
});
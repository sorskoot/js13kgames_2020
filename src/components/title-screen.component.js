AFRAME.registerComponent('title-screen', {
    schema: {
        text: { default: "KEEP'EM 404" },
        fontsize: { type: 'number',default: 150 },
        font: { type: 'string',default: '"Arial Black", Gadget, sans-serif' },
    },
    init: function () {
        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;

        let ctx = canvas.getContext("2d");
        let gradient = ctx.createLinearGradient(0, 8, 0, 120);
        gradient.addColorStop(.1,   '#fff901');
        gradient.addColorStop(.3, '#ff4400');
        gradient.addColorStop(.5,  '#c40001');
        gradient.addColorStop(.9, '#640000');
        gradient.addColorStop(1,   '#050000');
        
        ctx.shadowColor = '#131a9b';
        ctx.shadowBlur = 15;
        ctx.textAlign = 'center';
        ctx.fillStyle = gradient;
        ctx.font = `${this.data.fontsize}px ${this.data.font}` ;;
        while(ctx.measureText(this.data.text).width > canvas.width && this.data.fontsize>1){
            this.data.fontsize--;
            ctx.font = `${this.data.fontsize}px ${this.data.font}` ;
        }
        ctx.fillText(this.data.text, 512, 123);
        let gradient2 = ctx.createLinearGradient(0, 5, 0, 140);
        gradient2.addColorStop(0.0, '#ff2929');
        // gradient2.addColorStop(0.1, '#131a9b');
        // gradient2.addColorStop(0.2, '#e3f3f2');
        // gradient2.addColorStop(0.3, '#1f1f75');
        // gradient2.addColorStop(0.4, '#01000a');
        // gradient2.addColorStop(0.5, '#1f1f75');
        // gradient2.addColorStop(0.6, '#aa1885');
        // gradient2.addColorStop(0.7, '#1f1f75');
        // gradient2.addColorStop(0.8, '#aa1885');
        gradient2.addColorStop(0.9, '#be0000');

        ctx.shadowColor = '#7b257c';
        ctx.shadowBlur = 1;

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.strokeText(this.data.text, 512, 123);


        ctx.strokeStyle = gradient2;
        ctx.lineWidth = 4;
        ctx.strokeText(this.data.text, 512, 123);

        this.el.setAttribute('material', {
            transparent: true,
            src: canvas,
            depthTest: false
        });
    },
});
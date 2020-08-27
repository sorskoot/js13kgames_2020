AFRAME.registerComponent('click-handler', {
   schema: {type:'int'},   
   init:function(){
      this.el.addEventListener('click',()=>{
         this.el.sceneEl.components.game.clicked(this, this.data);
      })
   }
});
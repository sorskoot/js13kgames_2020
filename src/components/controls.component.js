import {flattenObject3DMaps} from '../lib/helpers'
export default {
    keyboard: AFRAME.registerComponent('keyboardcontrols', {
        init: function () {
            let reload = false;
            document.body.addEventListener('keydown', e => {
                if (e.keyCode === 32 && !reload) {
                    reload = true;
                    fire();
                }
            });

            document.body.addEventListener('keyup', e => {
                if (e.keyCode === 32) {
                    reload = false;
                }
            });
        }
    }),
    ar: AFRAME.registerComponent('ar-controls', {
        init: function () {
        
            this.updateControllers = this.updateControllers.bind(this);
            this.onSelect = this.onSelect.bind(this);
            this.raycaster = new THREE.Raycaster();
            this.el.sceneEl.addEventListener('controllersupdated', this.updateControllers);
        },

        updateControllers: function () {
            var controllers = this.el.systems['tracked-controls-webxr'].controllers;
            var i;
            var xrSession = this.el.xrSession;
            if (!xrSession) { return; }
        
            for (i = 0; i < controllers.length; ++i) {
                if (controllers[i].targetRayMode === 'screen') {
                    this.controller = controllers[i];
                    xrSession.addEventListener('select', this.onSelect);                  
                    break;
                }
            }
        },

        onSelect: function (evt, frame, referenceSpace) {
            if (this.controller !== evt.inputSource) { return; }
            const axes = evt.target.inputSources[0].gamepad.axes;
            console.log(axes);
            const entity = document.querySelector('a-entity[camera]');
            const camera = entity.getObject3D('camera');
         
            this.raycaster.setFromCamera({x:axes[0]/3.5,y:-axes[1]/3.5}, camera)
            //  this.raycaster.ray.origin.setFromMatrixPosition(camera.matrixWorld);
            //  this.raycaster.ray.direction.set(axes[1], axes[0], .5)
            //          .unproject(camera).sub(this.raycaster.ray.origin).normalize();

            // var vector = new THREE.Vector3(axes[0], axes[1], -1).unproject(camera).normalize();
            // console.log(vector)
            // this.raycaster.set(position, vector);
            const objs = flattenObject3DMaps(document.querySelectorAll('[td-placeholder]'));
            var intersects = this.raycaster.intersectObjects(objs, true);
            // this.el.object3D.remove ( this.arrow );
         //   let arrow = new THREE.ArrowHelper( this.raycaster.ray.direction, this.raycaster.ray.origin, 1, Math.random() * 0xffffff );
           
         //    this.el.object3D.add( arrow );
            if (intersects.length) {
                document.querySelector('[game]').emit('select',  intersects[0].object
                );
            }

        }
    }),
    touch: AFRAME.registerComponent('touchcontrols', {
        init: function () {
            let reload = false;
            document.body.addEventListener('touchstart', e => {
                if (!reload) {
                    reload = true;
                    fire();
                }
            });

            document.body.addEventListener('touchstart', e => {
                reload = false;

            });
        }
    }),
}


function fire() {
    let camera = document.querySelector('a-entity[camera]').object3D;
    let v = new THREE.Vector3(0, 0, 1);
    v.applyQuaternion(camera.quaternion);
    document.querySelector('[game]').emit('fire', {
        direction: {
            x: v.x,
            y: v.y,
            z: v.z
        },
        position: { x: 0, y: 0, z: 0 }
    });
}

import {createPixelMaterial} from '../lib/PixelMaterial';
AFRAME.registerComponent('block-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const sideMaterial = createPixelMaterial(3);
        this.pixelMaterial = createPixelMaterial(9, "#ffffff", 6);
        //const whiteMaterial = 
        var materials = [
           sideMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           sideMaterial,
           sideMaterial,           
           sideMaterial,
           this.pixelMaterial,
           sideMaterial, 
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
        this.q = 0.0;
        this.t = 0;
      },
      tick(time, deltaTime) {          
        this.t += deltaTime;
        if (this.t > 200) {
         
          this.q = (this.q + 1) % 5;
          this.pixelMaterial.uniforms.lookupShift.value = this.q;
          this.t = 0;
        }
      },
});
AFRAME.registerComponent('td-bullet', {
    schema: {
        speed: {
            default: .1
        },
        target: {
            type: 'selector'
        },
        damage: {
            default: 1
        }
    },
    init: function () {
        this.dir = new THREE.Vector3();
    },
    update: function (oldData) { },
    tick: function (time, timeDelta) {
        if (!this.data.target ||
            (this.data.target.object3D.position.y == 0 &&
                this.data.target.object3D.position.z == 0 &&
                this.data.target.object3D.position.x == 0)) {
            this.el.remove();
            return;
        }

        if (this.el.object3D.position.distanceTo(this.data.target.object3D.position) > 1) {
            this.dir.subVectors(this.data.target.object3D.position, this.el.object3D.position).normalize();
            this.dir.multiplyScalar(this.data.speed);
            this.el.object3D.position.add(this.dir);
        } else {
            this.data.target.components['td-enemy'].hit(this.data.damage);
            this.el.remove();
        }
    },
});
AFRAME.registerComponent('click-handler', {
   schema: {type:'int'},   
   init:function(){
      this.el.addEventListener('click',()=>{
         this.el.sceneEl.components.game.clicked(this, this.data);
      })
   }
});
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
AFRAME.registerComponent('td-defense', {
    schema: {},
    init: function () { },
    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    tock: function (time, timeDelta, camera){ },
    remove: function () { },
    pause: function () { },
    play: function () { },
    updateSchema: function(data) { }
});
import { sound } from '../lib/sound';
import { createPixelMaterial } from '../lib/PixelMaterial';

const colors = ['#601114','#11601c','#2b2b49','#2a3b4e','#eb8931']

AFRAME.registerComponent('td-enemy', {
    schema: {
        speed: { default: 5 },
        alive: { default: true },
        health: { default: 80 },
        value: { default: 1 },
        type: { default: 1 }
    },
    init: function () {
        this.game = this.el.sceneEl.components.game;

        this.targetIndex = 0;
        this.target = new THREE.Vector3(...this.game.nextTarget(this.targetIndex));

        this.direction =
            this.target.clone().sub(this.el.object3D.position).normalize();

        this.distance = this.el.object3D.position.distanceTo(this.target);
        this.auxVector = new THREE.Vector3();
        this.bob = 0;

        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const pixelMaterial = createPixelMaterial(this.data.type + 15);
        const whiteMaterial = new THREE.MeshStandardMaterial()
        var materials = [
            pixelMaterial,
            pixelMaterial,
            whiteMaterial,
            whiteMaterial,
            whiteMaterial,
            whiteMaterial,
        ];
        const mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh', mesh);
    },

    update: function (oldData) {

    },
    tick: function (time, timeDelta) {
        if (timeDelta > 100) { return };
        if (!this.data.alive) {
            return;
        }

        this.auxVector.copy(this.direction);
        this.bob += timeDelta / 100;
        this.el.object3D.position.add(this.auxVector.multiplyScalar(timeDelta / 1000 * this.data.speed));
        this.el.object3D.position.y += Math.sin(this.bob) / 100;
        const newDistance = this.el.object3D.position.distanceTo(this.target);
        if (newDistance > this.distance) {
            this.targetIndex++;
            this.target =  new THREE.Vector3(...this.game.nextTarget(this.targetIndex));
            if (this.target !== null) {
                this.direction =
                    this.target.clone().sub(this.el.object3D.position).normalize();
                this.distance = this.el.object3D.position.distanceTo(this.target);
            } else {
                this.data.alive = false;

                this.el.setAttribute('selfdestruct', 'timer:0');
            }
        } else {
            this.distance = newDistance;
        }
    },
    /**
     * Called when the enemy is hit.
     * @param {Number} damage Damage to deal to the enemy
     */
    hit: function (damage) {
        this.data.health -= damage;
        if (this.data.health <= 0) {
            if (this.el) {
                try {
                    sound.play(sound.explosion);
                    let ent = document.createElement("a-entity");
                    ent.setAttribute("explosion", `color:${colors[this.data.type]}`);
                    ent.setAttribute("position", this.el.object3D.position);
                    this.el.parentElement.append(ent);
                    this.el.remove();
                    this.game.kill(this.data.value);
                } catch{ }
            }
        }
    }
});
/**
 * Finds the closest enemy to a certain position
 * @param {THREE.Vector3} position The position to get the closest enemy to
 * @param {Number} maxDistance the max distance to check
 */
export function closestEnemy(position, maxDistance = 1000) {
    const enemies = document.querySelectorAll('[td-enemy]');
    let closest, distance = maxDistance;
    enemies.forEach(e => {
        const thisDistance = position.distanceTo(e.object3D.position);
        if (thisDistance < distance) {
            closest = e;
            distance = thisDistance;
        }
    })
    return {
        found: closest,
        distance
    }
}
const velocityStart =32;//64;
const speedShrink = 4000;//3000;
const outward = 2000;//1000;
const downward = 1500;//1000;
const lifetime = 8000;//1640;

export default AFRAME.registerComponent('explosion', {
    schema: {
        color: {
            type: 'color'
        }
    },
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.tick, 1/30, this)

        this.particleCount = 100;
        this.particles = new THREE.BufferGeometry();
        this.velocities = [];
        let vertices = [];

        this.material = new THREE.PointsMaterial(
            {
                size: .1,
                color: new THREE.Color(this.data.color)
            });

        for (var p = 0; p < this.particleCount; p++) {
            let velocity = new THREE.Vector3(
                (Math.random() - 0.5) * velocityStart,
                (Math.random() - 0.5) * velocityStart,
                (Math.random() - 0.5) * velocityStart);
            // add it to the geometry
            vertices.push(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
            this.velocities.push(velocity);
        }
        this.particles.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        // create the particle system
        this.particleSystem = new THREE.Points(
            this.particles,
            this.material);

        // add it to the scene
        this.el.setObject3D('particle-system', this.particleSystem);
        this.el.setAttribute('selfdestruct', { timer: lifetime });
    },
    tick: function (time, timeDelta) {
        this.material.size = Math.max(this.material.size - (timeDelta / speedShrink), 0);
        var positions = this.particleSystem.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            var px = positions.getX(i);
            var py = positions.getY(i);
            var pz = positions.getZ(i);
            positions.setXYZ(
                i,
                px + (this.velocities[i].x * timeDelta / outward),
                py + (this.velocities[i].y * timeDelta / outward),
                pz + (this.velocities[i].z * timeDelta / outward)
            );
            this.velocities[i].y -= (64 * timeDelta / downward);
        }
        positions.needsUpdate = true;

    }
});
import { findEntity } from "../lib/helpers";
import { sound } from "../lib/sound";
import level from "./levels/level01.json";

const TOWER_INDEX = 0,
    TOWER_COST = 1;

const GAMEMODE_NONE = 0,
    GAMEMODE_PLACE = 1,
    GAMEMODE_UPGRADE = 2;

const ARGUMENT_UPGRADE = 5,
    ARGUMENT_TOWER = 7;

const UPGRADE_PRICE_1 = 5,
    UPGRADE_PRICE_2 = 10;

const STATE_TITLE = 0,
    STATE_PLAY = 1,
    STATE_GAMEOVER = 2;

AFRAME.registerComponent('game', {
    schema: {},
    init: function () {
        this.s = level.start;
        this.el.addEventListener('select', this.select.bind(this))
        this.el.addEventListener('kill', this.kill.bind(this))
        this.el.addEventListener('fire', (data) => {
            if (this.state != STATE_PLAY) {
                this.state = STATE_PLAY;
                this.processState();
            }
        });
        this.currentlyPlacing = 0;
        this.placable =
            [
        // index, cost, target, damage                          
        /*0:shield*/[4, 1],
        /*1:Certificate */[14, 2],
        /*2:First Aid*/[13, 3],
        /*3:Magnifier*/[10, 4],
        /*4:Firewall */[20, 5],
            ]
        // Test for the HoloLens
        // this.el.addEventListener('fire', ()=>{
        //     let ent = document.createElement("a-entity");
        //     ent.setAttribute("explosion", `color:#FF0000`);
        //     ent.setAttribute("position", this.el.object3D.position);
        //     this.el.append(ent);
        // });

        this.el.sceneEl.addEventListener('enter-vr', this.enterVr.bind(this));
        this.el.sceneEl.addEventListener('exit-vr', this.exitVr.bind(this));

        this.score = 10;

        this.menu = document.getElementById('menu');
        this.titlescreen = document.getElementById('titlescreen');
        this.camera = document.getElementById('camera');
        this.leftHand = document.getElementById('left-hand-menu');
        this.cursor = document.getElementById('cursor');
        this.raycaster = this.cursor.components.raycaster;
        this.towerTemplate = document.getElementById('template-defense');
        this.towerTarget = document.getElementById('defense');
        
        this.container=document.getElementById('world');
        this.spawnerTemplate=document.getElementById('template-spawner');
        this.pageTemplate=document.getElementById('template-page');
        this.placeholderTemplate=document.getElementById('template-placeholder');

        this.el.emit("update-score", this.score);
        this.mode = GAMEMODE_NONE;
        this.isVR = false;

        this.state = STATE_TITLE;
        this.processState();
    },


    update: function (oldData) { },
    tick: function (time, timeDelta) { },
    select: function ({ detail }) {
        const found = findEntity(document.querySelectorAll('[td-placeholder]'), detail.uuid)
        found.emit('click', {});
    },
    kill: function (score) {
        this.score += score;
        this.el.emit("update-score", this.score);
    },
    enterVr: function () {
        this.isVR = true;
        this.menu.setAttribute('visible', 'false');
        this.leftHand.setAttribute('visible', 'true');
    },
    exitVr: function () {
        this.isVR = false;
        this.menu.setAttribute('visible', 'true');
        this.leftHand.setAttribute('visible', 'false');
    },
    clicked: function (sender, argument) {
        if(this.state!==STATE_PLAY) return;
        // check sender component type if it's menu, placeholder or tower
        switch (argument) {
            case ARGUMENT_UPGRADE: // upgrade
                this.mode = GAMEMODE_UPGRADE
                sound.play(sound.select);
                this.cursor.setAttribute('raycaster', { objects: '.clickable, .upgradable' });
                break
            case ARGUMENT_TOWER:
                if (this.mode === GAMEMODE_PLACE) {
                    if (this.score - this.placable[this.currentlyPlacing][TOWER_COST] < 0) {
                        return;
                    }
                    this.cursor.setAttribute('raycaster', { objects: '.clickable' });
                    // replace placeholder                
                    sound.play(sound.place);
                    this.score -= this.placable[this.currentlyPlacing][TOWER_COST]
                    this.el.emit("update-score", this.score);
                    sender.el.remove();
                    const newTower = this.towerTemplate.cloneNode(true);
                    newTower.classList.add('upgradable');
                    newTower.setAttribute("position", sender.el.object3D.position);
                    newTower.setAttribute("td-tower", {
                        type: this.placable[this.currentlyPlacing][TOWER_INDEX]
                    });
                    this.towerTarget.append(newTower);
                }

                if (this.mode === GAMEMODE_UPGRADE) {
                    var tower = sender.el.components["td-tower"];
                    if (tower.data.level == 2) break;
                    if (tower.data.level == 0) {
                        if (this.score - UPGRADE_PRICE_1 < 0) {
                            return;
                        }
                        this.score -= UPGRADE_PRICE_1;
                    } else {
                        if (this.score - UPGRADE_PRICE_2 < 0) {
                            return;
                        }
                        this.score -= UPGRADE_PRICE_2;
                    }
                    this.el.emit("update-score", this.score);
                    sender.el.setAttribute('td-tower', { level: tower.data.level + 1 });
                    this.cursor.setAttribute('raycaster', { objects: '.clickable' });
                }

                break;
            default:
                this.mode = GAMEMODE_PLACE;
                this.cursor.setAttribute('raycaster', { objects: '.clickable, .placable' });
                sound.play(sound.select);
                this.currentlyPlacing = argument;
        }

    },
    processState: function () {
        switch (this.state) {
            case STATE_TITLE:
                this.titlescreen.setAttribute('visible','true');
                this.menu.setAttribute('visible','false');
                this.leftHand.setAttribute('visible', 'false');
                break;
            case STATE_PLAY:
                this.createLevel();
                this.menu.setAttribute('visible', this.isVR?'false':'true');
                this.leftHand.setAttribute('visible', this.isVR?'true':'false');
                this.titlescreen.setAttribute('visible','false');
                break;
            case STATE_GAMEOVER:
                this.menu.setAttribute('visible','false');
                this.leftHand.setAttribute('visible', 'false');
                break;
        }
    },

    createLevel: function () {
        
        const spawner = this.spawnerTemplate.cloneNode(true);
        spawner.setAttribute("position", new THREE.Vector3(...level.targets[0]))
        this.container.append(spawner);

        const page = this.pageTemplate.cloneNode(true);
        page.setAttribute("position", 
            new THREE.Vector3(...level.targets[level.targets.length - 1]))
        this.container.append(page);

        level.placeholders.forEach(pos => {
            const ph = this.placeholderTemplate.cloneNode(true);
            ph.setAttribute("click-handler", "7");
            ph.setAttribute("position", new THREE.Vector3(...pos));
            ph.classList.add("clickable")
            this.container.append(ph);
        });
    },
    nextTarget: function (targetIndex) {

        if (targetIndex >= 0 && targetIndex < level.targets.length) {
            return level.targets[targetIndex];
        }
        return null;
    }

});

const setParent = (el, newParent) => newParent.appendChild(el);
/**
 * Flattens DOM elements to Object3Ds
 * @param  {Array<Element>} elements
 * @returns {Array<THREE.Object3D>}
 */
export function flattenObject3DMaps(elements) {
    let key, i;
    let objects = [];
    for (i = 0; i < elements.length; i++) {
        if (elements[i].isEntity && elements[i].object3D) {
            for (key in elements[i].object3DMap) {
                objects.push(elements[i].getObject3D(key));
            }
        }
    }
    return objects;
}

export function findEntity(elements, guid){
    let key, i;
    let object;;
    for (i = 0; i < elements.length; i++) {
        if (elements[i].isEntity && elements[i].object3D) {
         
              if(elements[i].object3DMap.mesh.uuid===guid){
                  return elements[i];
              }
            }
        
    }
}
/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
    //--------------------------------------------------------------------------
    //
    //  Settings String Methods
    //
    //--------------------------------------------------------------------------
  
    /**
     * Parses a settings array into the parameters
     * @param array Array of the settings values, where elements 0 - 23 are
     *                a: waveType
     *                b: attackTime
     *                c: sustainTime
     *                d: sustainPunch
     *                e: decayTime
     *                f: startFrequency
     *                g: minFrequency
     *                h: slide
     *                i: deltaSlide
     *                j: vibratoDepth
     *                k: vibratoSpeed
     *                l: changeAmount
     *                m: changeSpeed
     *                n: squareDuty
     *                o: dutySweep
     *                p: repeatSpeed
     *                q: phaserOffset
     *                r: phaserSweep
     *                s: lpFilterCutoff
     *                t: lpFilterCutoffSweep
     *                u: lpFilterResonance
     *                v: hpFilterCutoff
     *                w: hpFilterCutoffSweep
     *                x: masterVolume
     * @return If the string successfully parsed
     */
    this.setSettings = function(values)
    {
      for ( var i = 0; i < 24; i++ )
      {
        this[String.fromCharCode( 97 + i )] = values[i] || 0;
      }
  
      // I moved this here from the reset(true) function
      if (this['c'] < .01) {
        this['c'] = .01;
      }
  
      var totalTime = this['b'] + this['c'] + this['e'];
      if (totalTime < .18) {
        var multiplier = .18 / totalTime;
        this['b']  *= multiplier;
        this['c'] *= multiplier;
        this['e']   *= multiplier;
      }
    }
  }
  
  /**
   * SfxrSynth
   *
   * Copyright 2010 Thomas Vian
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * @author Thomas Vian
   */
  /** @constructor */
  function SfxrSynth() {
    // All variables are kept alive through function closures
  
    //--------------------------------------------------------------------------
    //
    //  Sound Parameters
    //
    //--------------------------------------------------------------------------
  
    this._params = new SfxrParams();  // Params instance
  
    //--------------------------------------------------------------------------
    //
    //  Synth Variables
    //
    //--------------------------------------------------------------------------
  
    var _envelopeLength0, // Length of the attack stage
        _envelopeLength1, // Length of the sustain stage
        _envelopeLength2, // Length of the decay stage
  
        _period,          // Period of the wave
        _maxPeriod,       // Maximum period before sound stops (from minFrequency)
  
        _slide,           // Note slide
        _deltaSlide,      // Change in slide
  
        _changeAmount,    // Amount to change the note by
        _changeTime,      // Counter for the note change
        _changeLimit,     // Once the time reaches this limit, the note changes
  
        _squareDuty,      // Offset of center switching point in the square wave
        _dutySweep;       // Amount to change the duty by
  
    //--------------------------------------------------------------------------
    //
    //  Synth Methods
    //
    //--------------------------------------------------------------------------
  
    /**
     * Resets the runing variables from the params
     * Used once at the start (total reset) and for the repeat effect (partial reset)
     */
    this.reset = function() {
      // Shorter reference
      var p = this._params;
  
      _period       = 100 / (p['f'] * p['f'] + .001);
      _maxPeriod    = 100 / (p['g']   * p['g']   + .001);
  
      _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
      _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;
  
      if (!p['a']) {
        _squareDuty = .5 - p['n'] / 2;
        _dutySweep  = -p['o'] * .00005;
      }
  
      _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
      _changeTime   = 0;
      _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
    }
  
    // I split the reset() function into two functions for better readability
    this.totalReset = function() {
      this.reset();
  
      // Shorter reference
      var p = this._params;
  
      // Calculating the length is all that remained here, everything else moved somewhere
      _envelopeLength0 = p['b']  * p['b']  * 100000;
      _envelopeLength1 = p['c'] * p['c'] * 100000;
      _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
      // Full length of the volume envelop (and therefore sound)
      // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
      return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
    }
  
    /**
     * Writes the wave to the supplied buffer ByteArray
     * @param buffer A ByteArray to write the wave to
     * @return If the wave is finished
     */
    this.synthWave = function(buffer, length) {
      // Shorter reference
      var p = this._params;
  
      // If the filters are active
      var _filters = p['s'] != 1 || p['v'],
          // Cutoff multiplier which adjusts the amount the wave position can move
          _hpFilterCutoff = p['v'] * p['v'] * .1,
          // Speed of the high-pass cutoff multiplier
          _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
          // Cutoff multiplier which adjusts the amount the wave position can move
          _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
          // Speed of the low-pass cutoff multiplier
          _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
          // If the low pass filter is active
          _lpFilterOn = p['s'] != 1,
          // masterVolume * masterVolume (for quick calculations)
          _masterVolume = p['x'] * p['x'],
          // Minimum frequency before stopping
          _minFreqency = p['g'],
          // If the phaser is active
          _phaser = p['q'] || p['r'],
          // Change in phase offset
          _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
          // Phase offset for phaser effect
          _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
          // Once the time reaches this limit, some of the    iables are reset
          _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
          // The punch factor (louder at begining of sustain)
          _sustainPunch = p['d'],
          // Amount to change the period of the wave by at the peak of the vibrato wave
          _vibratoAmplitude = p['j'] / 2,
          // Speed at which the vibrato phase moves
          _vibratoSpeed = p['k'] * p['k'] * .01,
          // The type of wave to generate
          _waveType = p['a'];
  
      var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
          _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
          _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
          _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)
  
      // Damping muliplier which restricts how fast the wave position can move
      var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
      if (_lpFilterDamping > .8) {
        _lpFilterDamping = .8;
      }
      _lpFilterDamping = 1 - _lpFilterDamping;
  
      var _finished = false,     // If the sound has finished
          _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
          _envelopeTime     = 0, // Current time through current enelope stage
          _envelopeVolume   = 0, // Current volume of the envelope
          _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
          _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
          _lpFilterOldPos,       // Previous low-pass wave position
          _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
          _periodTemp,           // Period modified by vibrato
          _phase            = 0, // Phase through the wave
          _phaserInt,            // Integer phaser offset, for bit maths
          _phaserPos        = 0, // Position through the phaser buffer
          _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
          _repeatTime       = 0, // Counter for the repeats
          _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
          _superSample,          // Actual sample writen to the wave
          _vibratoPhase     = 0; // Phase through the vibrato sine wave
  
      // Buffer of wave values used to create the out of phase second wave
      var _phaserBuffer = new Array(1024),
          // Buffer of random values used to generate noise
          _noiseBuffer  = new Array(32);
      for (var i = _phaserBuffer.length; i--; ) {
        _phaserBuffer[i] = 0;
      }
      for (var i = _noiseBuffer.length; i--; ) {
        _noiseBuffer[i] = Math.random() * 2 - 1;
      }
  
      for (var i = 0; i < length; i++) {
        if (_finished) {
          return i;
        }
  
        // Repeats every _repeatLimit times, partially resetting the sound parameters
        if (_repeatLimit) {
          if (++_repeatTime >= _repeatLimit) {
            _repeatTime = 0;
            this.reset();
          }
        }
  
        // If _changeLimit is reached, shifts the pitch
        if (_changeLimit) {
          if (++_changeTime >= _changeLimit) {
            _changeLimit = 0;
            _period *= _changeAmount;
          }
        }
  
        // Acccelerate and apply slide
        _slide += _deltaSlide;
        _period *= _slide;
  
        // Checks for frequency getting too low, and stops the sound if a minFrequency was set
        if (_period > _maxPeriod) {
          _period = _maxPeriod;
          if (_minFreqency > 0) {
            _finished = true;
          }
        }
  
        _periodTemp = _period;
  
        // Applies the vibrato effect
        if (_vibratoAmplitude > 0) {
          _vibratoPhase += _vibratoSpeed;
          _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
        }
  
        _periodTemp |= 0;
        if (_periodTemp < 8) {
          _periodTemp = 8;
        }
  
        // Sweeps the square duty
        if (!_waveType) {
          _squareDuty += _dutySweep;
          if (_squareDuty < 0) {
            _squareDuty = 0;
          } else if (_squareDuty > .5) {
            _squareDuty = .5;
          }
        }
  
        // Moves through the different stages of the volume envelope
        if (++_envelopeTime > _envelopeLength) {
          _envelopeTime = 0;
  
          switch (++_envelopeStage)  {
            case 1:
              _envelopeLength = _envelopeLength1;
              break;
            case 2:
              _envelopeLength = _envelopeLength2;
          }
        }
  
        // Sets the volume based on the position in the envelope
        switch (_envelopeStage) {
          case 0:
            _envelopeVolume = _envelopeTime * _envelopeOverLength0;
            break;
          case 1:
            _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
            break;
          case 2:
            _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
            break;
          case 3:
            _envelopeVolume = 0;
            _finished = true;
        }
  
        // Moves the phaser offset
        if (_phaser) {
          _phaserOffset += _phaserDeltaOffset;
          _phaserInt = _phaserOffset | 0;
          if (_phaserInt < 0) {
            _phaserInt = -_phaserInt;
          } else if (_phaserInt > 1023) {
            _phaserInt = 1023;
          }
        }
  
        // Moves the high-pass filter cutoff
        if (_filters && _hpFilterDeltaCutoff) {
          _hpFilterCutoff *= _hpFilterDeltaCutoff;
          if (_hpFilterCutoff < .00001) {
            _hpFilterCutoff = .00001;
          } else if (_hpFilterCutoff > .1) {
            _hpFilterCutoff = .1;
          }
        }
  
        _superSample = 0;
        for (var j = 8; j--; ) {
          // Cycles through the period
          _phase++;
          if (_phase >= _periodTemp) {
            _phase %= _periodTemp;
  
            // Generates new random noise for this period
            if (_waveType == 3) {
              for (var n = _noiseBuffer.length; n--; ) {
                _noiseBuffer[n] = Math.random() * 2 - 1;
              }
            }
          }
  
          // Gets the sample from the oscillator
          switch (_waveType) {
            case 0: // Square wave
              _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
              break;
            case 1: // Saw wave
              _sample = 1 - _phase / _periodTemp * 2;
              break;
            case 2: // Sine wave (fast and accurate approx)
              _pos = _phase / _periodTemp;
              _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
              _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
              _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
              break;
            case 3: // Noise
              _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
          }
  
          // Applies the low and high pass filters
          if (_filters) {
            _lpFilterOldPos = _lpFilterPos;
            _lpFilterCutoff *= _lpFilterDeltaCutoff;
            if (_lpFilterCutoff < 0) {
              _lpFilterCutoff = 0;
            } else if (_lpFilterCutoff > .1) {
              _lpFilterCutoff = .1;
            }
  
            if (_lpFilterOn) {
              _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
              _lpFilterDeltaPos *= _lpFilterDamping;
            } else {
              _lpFilterPos = _sample;
              _lpFilterDeltaPos = 0;
            }
  
            _lpFilterPos += _lpFilterDeltaPos;
  
            _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
            _hpFilterPos *= 1 - _hpFilterCutoff;
            _sample = _hpFilterPos;
          }
  
          // Applies the phaser effect
          if (_phaser) {
            _phaserBuffer[_phaserPos % 1024] = _sample;
            _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
            _phaserPos++;
          }
  
          _superSample += _sample;
        }
  
        // Averages out the super samples and applies volumes
        _superSample *= .125 * _envelopeVolume * _masterVolume;
  
        // Clipping if too loud
        buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
      }
  
      return length;
    }
  }
  
  // Adapted from http://codebase.es/riffwave/
  var synth = new SfxrSynth();
  // added export to use as module 

export const jsfxr = function(settings) {
    // Initialize SfxrParams
    synth._params.setSettings(settings);
    // Synthesize Wave
    var envelopeFullLength = synth.totalReset();
    var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
    var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
    var dv = new Uint32Array(data.buffer, 0, 44);
    // Initialize header
    dv[0] = 0x46464952; // "RIFF"
    dv[1] = used + 36;  // put total size here
    dv[2] = 0x45564157; // "WAVE"
    dv[3] = 0x20746D66; // "fmt "
    dv[4] = 0x00000010; // size of the following
    dv[5] = 0x00010001; // Mono: 1 channel, PCM format
    dv[6] = 0x0000AC44; // 44,100 samples per second
    dv[7] = 0x00015888; // byte rate: two bytes per sample
    dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
    dv[9] = 0x61746164; // "data"
    dv[10] = used;      // put number of samples here
  
    // Base64 encoding written by me, @maettig
    used += 44;
    var i = 0,
        base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        output = 'data:audio/wav;base64,';
    for (; i < used; i += 3)
    {
      var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
      output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
    }
    return output;
  }
export default AFRAME.registerComponent('neon-text', {
    schema: {
        text: { type: 'string', default: 'Neon text' },
        fontsize: { type: 'number',default: 150 },
        font: { type: 'string',default: 'Serif' },
        color: { type: 'color', default: '#2963ff' }
    },
    init: function () {
        this.update();
    },
    update: function () {
        
        let canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1024;
        let ctx = canvas.getContext("2d");

        ctx.fillStyle = 'white';
        ctx.font = `${this.data.fontsize}px ${this.data.font}` ;
        ctx.textAlign = 'center';

        while(ctx.measureText(this.data.text).width > canvas.width && this.data.fontsize>1){
            this.data.fontsize--;
            ctx.font = `${this.data.fontsize}px ${this.data.font}` ;
        }

        ctx.fillText(this.data.text, 512, 123);

        ctx.strokeStyle = this.data.color;
        ctx.lineWidth = (this.data.fontsize/75);
        ctx.strokeText(this.data.text, 512, 123);


        ctx.fillStyle = this.data.color;
        ctx.shadowColor = this.data.color;
        ctx.shadowBlur = 15;
        ctx.fillText(this.data.text, 512+(this.data.fontsize/50), 123+(this.data.fontsize/50));

        this.el.setAttribute('material', {
            transparent: true,
            src: canvas,
            depthTest: false
        });
    },
});
import vertShader from '../shaders/shader.vert';
import fragShader from '../shaders/shader.frag';
const texture = new THREE.ImageUtils.loadTexture('js13k2020.png');
const textureLookup = new THREE.ImageUtils.loadTexture('js13k2020-colors.png');
/**
 * Creates a pixel shader material
 * @param {number} tileIndex index of the sprite to use as a map
 * @param {string} color Hex color - defaults to #ffffff
 */
export function createPixelMaterial(
    tileIndex,
    color = '#ffffff',
    lookupIndex = -1,
    repeatX=1,
    repeatY=1,
    transparent=false) {

    texture.minFilter = texture.magFilter = 1003;
    textureLookup.minFilter = textureLookup.magFilter = 1003;
    var material = new THREE.ShaderMaterial({
        extensions: {
            derivatives: true
        },
        uniforms: { // some parameters for the shader
            time: { value: 0.0 },
            index: { value: tileIndex },
            DiffuseTexture: { value: texture },
            Lookup: { value: textureLookup },
            lookupIndex: { value: lookupIndex },
            lookupShift: { value: 0.0 },
            color: { value: new THREE.Color(color) },
            spriteDimensions: { value: { x: 32.0, y: 1.0 } },
            repeat: { value: { x: repeatX, y: repeatY } },
            tint: { value: new THREE.Color(255, 255, 255) },
            tintAmount: { value: 0 }
        },
        vertexShader: vertShader,
        fragmentShader: fragShader,
    });
    material.transparent = transparent;
    material.needsUpdate = true;
    return material;
}
import { createPixelMaterial } from "../lib/PixelMaterial";

AFRAME.registerComponent("pixelshader-material", {
  schema: {
    index: { type: "int", default: 0 },
    color: { default: "#ffffff" },
    lookup: { type: "int", default: -1 },
    animationSpeed: { default: 0 },
    repeat:{type:"vec2", default:{x:1, y:1}},
    transparent:{default:false}
  },

  init: function () {  },

  update: function () {
    this.material = createPixelMaterial(
        this.data.index, 
        this.data.color, 
        this.data.lookup,
        this.data.repeat.x,
        this.data.repeat.y,
        this.data.transparent);
    this.el.getObject3D("mesh").depthWrite = false;
    this.el.getObject3D("mesh").material = this.material;
  },
});
import { createPixelMaterial } from '../../lib/PixelMaterial';

AFRAME.registerComponent("placeholder-entity", {
  schema: {},
  init: function () {
    var geometry = new THREE.PlaneGeometry();
    this.pixelMaterial =  createPixelMaterial(11, "#ffffff", 5);
    this.pixelMaterial.transparent=true;
    this.pixelMaterial.side = THREE.DoubleSide;
    var mesh = new THREE.Mesh(geometry, this.pixelMaterial);
    this.el.setObject3D("mesh", mesh);
    this.q = 0.0;
    this.t = 0;
  },
  tick(time, deltaTime) {
   // this.el.object3D.rotateX(0.06);      
   // this.el.object3D.rotateY(0.02);
    this.el.object3D.rotateZ(0.01);

    this.t += deltaTime;
    if (this.t > 100) {
     
      this.q = (this.q + 1) % 5;
      this.pixelMaterial.uniforms.lookupShift.value = this.q;
      this.t = 0;
    }
  },
});
AFRAME.registerComponent('score', {
    init: function () {
        document.querySelector('[game]')
            .addEventListener('update-score', this.scoreUpdate.bind(this));        
    },
    scoreUpdate: function ({ detail }) {
        
        let score = 0;
        if(detail > 0 && detail < 100){
            score = `${detail * 10}K`;
        }else if(detail >= 100){
            score = `${(detail * 10)/1000.0}M`
        }

        this.el.setAttribute('text',`value:$${score}`);
    }
});
const { sound } = require("../lib/sound");

AFRAME.registerComponent('select-to-place', {
    schema: {default:0},
    init: function () {
        this.el.addEventListener('click', () => {
            sound.play(sound.select);
            this.el.sceneEl.components.game.currentlyPlacing = this.data;
        })
    }
});
export default AFRAME.registerComponent('selfdestruct', {
    schema: {
        timer: { default: 5000 }
    },
    tick: function (time, timeDelta) { 
        this.data.timer -= timeDelta;
        if(this.data.timer < 0){
            this.el.remove();
        }
    }
});
/* global AFRAME */
export default AFRAME.registerComponent('shoot-controls', {
    // dependencies: ['tracked-controls'],
    schema: {
        hand: { default: 'left' }
    },

    init: function () {
        var self = this;
        this.onButtonChanged = this.onButtonChanged.bind(this);
        this.onButtonDown = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
        this.onButtonUp = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    },

    play: function () {
        var el = this.el;
        
        el.addEventListener('buttonchanged', this.onButtonChanged);
        el.addEventListener('buttondown', this.onButtonDown);
        el.addEventListener('buttonup', this.onButtonUp);
    },

    pause: function () {
        var el = this.el;
        el.removeEventListener('buttonchanged', this.onButtonChanged);
        el.removeEventListener('buttondown', this.onButtonDown);
        el.removeEventListener('buttonup', this.onButtonUp);
    },

    // buttonId
    // 0 - trackpad
    // 1 - trigger ( intensity value from 0.5 to 1 )
    // 2 - grip
    // 3 - menu ( dispatch but better for menu options )
    // 4 - system ( never dispatched on this layer )
    mapping: {
        axis0: 'trackpad',
        axis1: 'trackpad',
        button0: 'trackpad',
        button1: 'trigger',
        button2: 'grip',
        button3: 'menu',
        button4: 'system'
    },

    onButtonChanged: function (evt) {
        var buttonName = this.mapping['button' + evt.detail.id];
        if (buttonName !== 'trigger') { return; }
        
        
    },

    onButtonEvent: function (id, evtName) {
        var buttonName = this.mapping['button' + id];
        //this.el.emit(buttonName + evtName);

        if (evtName === 'down') {
            let camrot = new THREE.Euler(
                this.el.object3D.rotation.x,
                this.el.object3D.rotation.y,
                this.el.object3D.rotation.z, 'XYZ');
            let v = new THREE.Vector3(0, 0, 1);
            v.applyEuler(camrot);

            document.querySelector('[game]').emit('fire', {
                direction: {
                    x: v.x,
                    y: v.y,
                    z: v.z
                }, position: {
                    x: this.el.object3D.position.x,
                    y: this.el.object3D.position.y,
                    z: this.el.object3D.position.z
                }
            });
        }
    },
    tick:function(){
        // TODO: Expand this to have it work for the HoloLens
        if(navigator.getGamepads){
            const newLocal = navigator.getGamepads();
            if(newLocal && newLocal[4]){
            const b = newLocal[4].buttons[0].value;
            if(this.gamepadButton != b ){
                if(b==1){
                    document.querySelector('[game]').emit('fire', {});
                }
                this.gamepadButton = b;
            }
        }
        }
    },
    update: function () {
        var data = this.data;
        var el = this.el;
        el.setAttribute('keyboardcontrols', {});
        el.setAttribute('touchcontrols', {});
        el.setAttribute('vive-controls', { hand: data.hand, model: false });
        el.setAttribute('oculus-touch-controls', { hand: data.hand, model: false });
        el.setAttribute('windows-motion-controls', { hand: data.hand, model: false });
        if (data.hand === 'right') {
            el.setAttribute('daydream-controls', { hand: data.hand, model: false });
            el.setAttribute('gearvr-controls', { hand: data.hand, model: false });
        }
    }
});
import { jsfxr } from './jsfxr';

let audiopool = [];
for (let i = 0; i < 50; i++) {
    audiopool.push(new Audio());
}
let currentIndex = 0;
const fire = [0,0.0466,0.103,0.024,0.2249,0.6702,0.1782,-0.2617,0.0137,0.0222,0.0414,-0.0043,0.05,0.0513,0.0927,0.012,0.1749,-0.0778,1,-0.0314,0.0046,0.179,0.0127,0.5],
    explosion = [3, , 0.58, 0.35, 0.0547, 0.16, , -0.18, , , , -0.3774, 0.6619, , , , 0.598, -0.1327, 1, , , , , 0.28],
    gameover = [3, 0.09, 0.67, 0.35, 0.93, 0.2, , -0.12, , , , -0.3774, 0.62, , , , 0.1399, -0.3, 1, , , , , 0.28],
    select = [1,,0.1628,,0.1462,0.473,,,,,,,,,,,,,1,,,0.1,,0.5],
    place = [0,,0.0343,,0.2762,0.533,,-0.4588,,,,,,0.2202,,,,,1,,,,,0.5];

let sounds = [  jsfxr(fire),
    jsfxr(explosion),
    jsfxr(gameover),
    jsfxr(select),
    jsfxr(place)];


export const sound = {
    play: function (params) {
        audiopool[currentIndex].src = sounds[params];      
        audiopool[currentIndex].play();
        currentIndex = (currentIndex + 1) % 50;
    },
    fire:0,
    explosion:1,
    gameover:2,
    select:3,
    place:4
}
AFRAME.registerComponent('td-spawner', {
    schema: {
        speed:{default:300},
        spawning:{default:false},
        container:{type:'selector'},
        enemy:{type:'selector'}
    },

    init: function () { 
        this.countdown = this.data.speed;
        
    },
    
    update: function (oldData) { 
        this.countdown = this.data.speed;
    },

    tick: function (time, timeDelta) {
        if(this.data.spawning ){
            this.countdown -= timeDelta;
            if(this.countdown < 0){
                this.countdown = this.data.speed;
                    const NewEnemy = this.data.enemy.cloneNode(true);
                    NewEnemy.setAttribute("td-enemy",
                        {type:~~(Math.random()*5),
                        speed:1,
                        health:100,
                        value:2})
                    NewEnemy.setAttribute("position", this.el.object3D.position)
                    this.data.container.append(NewEnemy);
                // spawn enemy

            }
        }
     }  
});
import {createPixelMaterial} from '../../lib/PixelMaterial';
AFRAME.registerComponent('target-entity', {
    schema: {},
    init: function () {
        var geometry = new THREE.BoxBufferGeometry(.1, 1, 1);
        const pixelMaterial = createPixelMaterial(~~(Math.random()*3)+5);
        const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
        var materials = [
           pixelMaterial,
           // new THREE.MeshStandardMaterial({ color: 0x00ffff }),
           pixelMaterial,
           whiteMaterial,
           whiteMaterial,
           whiteMaterial,
           whiteMaterial,
        ];
        var mesh = new THREE.Mesh(geometry, materials);
        this.el.setObject3D('mesh',mesh);
    },
});
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
import { createPixelMaterial } from '../lib/PixelMaterial';
import { closestEnemy } from './enemyhelper';
import {sound} from '../lib/sound';

AFRAME.registerComponent('td-tower', {
    schema: {
        speed: {
            default: 500
        },
        reach:{
            default:5
        },
        bullet:{
            type:'selector'
        },
        level: {
            default: 0
       },
       type:{
           default:0
       },
       animated:{
           default:false
       }
    },
    init: function () { 
        var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        this.pixelMaterial2 = createPixelMaterial(this.data.type);
        var mesh = new THREE.Mesh(geometry, this.pixelMaterial2);
        this.el.setObject3D('mesh', mesh);
        this.q = 0.0;
        this.t = 0;
     },
    update: function (oldData) {
        this.countdown = this.data.speed;  
        this.pixelMaterial2.uniforms.lookupIndex.value = this.data.level + 9;      
    },
    tick: function (time, timeDelta) {
        this.countdown -= timeDelta;
        if (this.countdown < 0) {
            this.countdown = this.data.speed;
            let { found, distance } = closestEnemy(this.el.object3D.position);
            if (found && distance < this.data.reach) {              
                if(!this.data.bullet){
                    console.log();
                }
                sound.play(sound.fire);
                const entity = this.data.bullet.cloneNode(true);
                entity.setAttribute('td-bullet', { 
                    target: found ,
                    damage:this.data.level*5+10
                });
                entity.setAttribute('position',this.el.object3D.position);
                document.getElementById('bullets').append(entity);
            }
        }
        if(this.data.animated){
        this.t += timeDelta;
        if (this.t > 100) {
            this.q= (this.q+1)%5;
            this.pixelMaterial2.uniforms.lookupShift.value = this.q;
            this.t = 0;
        }
        }
        
    },

});

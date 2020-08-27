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
/**
 * Finds the closest enemy to a certain position
 * @param {THREE.Vector3} position The position to get the closest enemy to
 * @param {Number} maxDistance the max distance to check
 */
function closestEnemy(position, maxDistance = 5) {
    const enemies = document.querySelectorAll('[td-enemy]');
    let closest, distance = maxDistance;
    enemies.forEach(e => {
   
        // ignore any enemy that's too far away on any axis.
        if(Math.abs(e.object3D.position.x - position.x) > maxDistance ||
        Math.abs(e.object3D.position.y - position.y) > maxDistance ||
        Math.abs(e.object3D.position.z - position.z) > maxDistance ) return;
   
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

function createExplosion(el, position, color, size = .1, velocity = 32, outward = 2000, burst=5) {
    let ent = document.createElement("a-entity");
    ent.setAttribute("explosion", {
        color: color, size: size,
        velocityStart: velocity, outward: outward,
        burst:burst
    });
    ent.setAttribute("position", position);
    el.parentElement?.append(ent);
}
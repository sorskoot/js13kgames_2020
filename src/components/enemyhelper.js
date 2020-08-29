/**
 * Finds the closest enemy to a certain position
 * @param {THREE.Vector3} position The position to get the closest enemy to
 * @param {Number} maxDistance the max distance to check
 */
function closestEnemy(position, maxDistance = 1000) {
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
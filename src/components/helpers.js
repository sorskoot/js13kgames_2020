/**
 * Flattens DOM elements to Object3Ds
 * @param  {Array<Element>} elements
 * @returns {Array<THREE.Object3D>}
 */
function flattenObject3DMaps(elements) {
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

function findEntity(elements, guid){
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

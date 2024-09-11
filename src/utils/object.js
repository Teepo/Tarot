/**
 * @param {Object} obj1
 * @param {Object} obj2
 *
 * @return {Object}
 */
export function mergeObjectsWithPrototypes(obj1, obj2) {
    
    const merged  = Object.create(Object.getPrototypeOf(obj1));

    Object.assign(merged, obj1);
    Object.assign(merged, obj2);

    return merged ;
};
/**
 * Deeply clones an object, ie clones it
 * and all of its child objects.
 * @param toClone The object to clone.
 */
export function deepClone(toClone: object): object {
    const cloneTo = {};
    recDeepClone(toClone, cloneTo);
    return cloneTo;
}

function recDeepClone(toClone: object, cloneTo: object) {
    Object.keys(toClone).forEach(key => {
        const val = toClone[key];
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                // Clone array
                cloneTo[key] = [];
                for (let i = 0; i < val.length; i++) {
                    if (typeof val[i] === 'object') {
                        cloneTo[key][i] = {};
                        recDeepClone(val[i], cloneTo[key][i]);
                    } else {
                        cloneTo[key][i] = val[i];
                    }
                }
            } else {
                // Clone object
                cloneTo[key] = {};
                recDeepClone(val, cloneTo[key]);
            }
        } else {
            cloneTo[key] = val;
        }
    });
}
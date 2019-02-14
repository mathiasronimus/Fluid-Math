import C from '@shared/main/consts';

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

/**
 * Add styles based on the contents of consts
 */
export function addStyleSheet() {
    const styleEl = document.createElement('style');
    let styleText = '';
    Object.keys(C.colors).forEach(colorName => {
        const colorVal = C.colors[colorName];
        styleText += '.' + colorName + ' { color: ' + 'rgb(' + colorVal[0] + ',' + colorVal[1] + ',' + colorVal[2] + ')}';
    });
    styleEl.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleEl);
}

/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 */
export const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * Decapitalize the first letter of a string.
 * @param str String to de-capitalize.
 */
export const deCap = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);

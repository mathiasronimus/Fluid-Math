import C from './consts';

/**
 * Add styles based on the contents of consts
 */
export function addStyleSheet() {
    let styleEl = document.createElement('style');
    let styleText = "";
    Object.keys(C.colors).forEach(colorName => {
        let colorVal = C.colors[colorName];
        styleText += '.' + colorName + " { color: " + 'rgb(' + colorVal[0] + ',' + colorVal[1] + "," + colorVal[2] + ")}"; 
    });
    styleEl.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleEl);
}

/**
 * Deeply clones an object, ie clones it
 * and all of its child objects.
 * 
 * @param toClone The object to clone.
 */
export function deepClone(toClone: Object): Object {
    let cloneTo = {};
    recDeepClone(toClone, cloneTo);
    return cloneTo;
}

function recDeepClone(toClone: Object, cloneTo: Object) {
    Object.keys(toClone).forEach(key => {
        let val = toClone[key];
        if (typeof val === 'object') {
            if (Array.isArray(val)) {
                //Clone array
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
                //Clone object
                cloneTo[key] = {};
                recDeepClone(val, cloneTo[key]);
            }
        } else {
            cloneTo[key] = val;
        }
    });
}

/**
 * Draws a line from one point to another.
 * 
 * @param x1 Starting x.
 * @param y1 Starting y.
 * @param x2 End x.
 * @param y2 End y.
 * @param ctx The context to draw a line on.
 */
export function line(x1, y1, x2, y2, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
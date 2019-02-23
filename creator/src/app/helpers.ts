import C from '@shared/main/consts';
import { getFontSizeForTier } from '@shared/main/helpers';

/**
 * Recursively checks if a reference
 * exists inside a step layout.
 * @param toCheck The step layout to check.
 * @param ref The ref to look for.
 */
export function inLayout(toCheck: object, ref: string): boolean {
    let found = false;
    Object.keys(toCheck).forEach(key => {
        const value = toCheck[key];
        if (typeof value === 'object') {
            if (inLayout(value, ref)) {
                found = true;
            }
        } else if (typeof value === 'string') {
            if (value === ref) {
                found = true;
            }
        }
    });
    return found;
}

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
 * Get the font metrics object for a state.
 * @param state The state to get the metrics for.
 */
export function getMetrics(state): object[] {
    const metricsArr = [];
    // Calculate a metrics object for each width tier
    for (let i = 0; i < C.widthTiers.length; i++) {
        const metrics: any = {};
        metricsArr.push(metrics);

        metrics.widths = [];

        /* Look for the max ascent and
           descent, which all terms will use. */
        let maxAscent = 0;
        let maxDescent = 0;
        state.terms.forEach(term => {
            const termMetrics: any = measureTerm(term, i);
            if (termMetrics.ascent > maxAscent) {
                maxAscent = termMetrics.ascent;
            }
            if (termMetrics.descent > maxDescent) {
                maxDescent = termMetrics.descent;
            }
            // All terms have their own width
            metrics.widths.push(termMetrics.width);
        });
        metrics.ascent = maxAscent;
        metrics.height = maxAscent + maxDescent;
    }
    return metricsArr;
}

/**
 * Measure the metrics for a term.
 * @param term The term to measure.
 * @param tier The width tier to measure this term for.
 */
export function measureTerm(term: string, tier: number): object {
    const toReturn: any = {};

    const fontSize = getFontSizeForTier(tier);

    // Create a canvas to measure with
    const testCanvas = document.createElement('canvas');
    testCanvas.width = C.testCanvasWidth;
    testCanvas.height = fontSize * C.testCanvasFontSizeMultiple;
    const testCtx = testCanvas.getContext('2d');
    testCtx.font = fontSize + 'px ' + C.fontFamily;

    // Get the width
    toReturn.width = testCtx.measureText(term).width;

    // Draw the text on the canvas to measure ascent and descent
    testCtx.fillStyle = 'white';
    testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
    testCtx.fillStyle = 'black';
    testCtx.fillText(term, 0, testCanvas.height / 2);

    const image = testCtx.getImageData(0, 0, toReturn.width, testCanvas.height);
    const imageData = image.data;

    // Go down until we find text
    let i = 0;
    while (++i < imageData.length && imageData[i] === 255) { }
    const ascent = i / (image.width * 4);

    // Go up until we find text
    i = imageData.length - 1;
    while (--i > 0 && imageData[i] === 255) { }
    const descent = i / (image.width * 4);

    toReturn.ascent = testCanvas.height / 2 - ascent;
    toReturn.descent = descent - testCanvas.height / 2;

    return toReturn;
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

import C from './consts';

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
 * Return the font family, style, and weight (in that order) to
 * use for a given instructions object.
 * @param instructions The instructions.
 */
export function getFont(instructions: any): [string, string, string] {
    if (instructions.font) {
        // There's a font set
        if (instructions.font.type === "c") {
            // There's a custom font
            return [
                instructions.font.name, 
                instructions.font.style, 
                instructions.font.weight
            ];
        } else if (instructions.font.type === "g") {
            // There's a google font
            let descriptor: string = instructions.font.name;
            let split: string[] = descriptor.split(":");
            const fontFamily = split[0];
            if (split[1]) {
                // It has a special weight/italic
                if (split[1].charAt(split[1].length - 1) === "i") {
                    // Is italic
                    return [
                        fontFamily,
                        'italic',
                        split[1].substring(0, split[1].length - 1)
                    ];
                } else {
                    // Not italic
                    return [
                        fontFamily,
                        C.fontStyle,
                        split[1]
                    ]
                }
            } else {
                // No defined weight/italic
                return [
                    fontFamily,
                    C.fontStyle,
                    C.fontWeight
                ];
            }
        } else {
            throw "Unrecognized custom font type";
        }
    } else {
        // Use default
        return [
            C.fontFamily,
            C.fontStyle,
            C.fontWeight
        ];
    }
}

/**
 * Get the font metrics object for an instructions object.
 * @param instructions The instructions to get the metrics for.
 */
export function getMetrics(instructions): object[] {
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
        instructions.terms.forEach(term => {
            const termMetrics: any = measureTerm(term, i, instructions);
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
 * @param instructions The instructions object containing this term.
 */
function measureTerm(term: string, tier: number, instructions: any): object {
    const toReturn: any = {};

    const fontSize = getFontSizeForTier(tier);

    const [fontFamily, style, weight] = getFont(instructions);

    // Create a canvas to measure with
    const testCanvas = document.createElement('canvas');
    testCanvas.width = C.testCanvasWidth;
    testCanvas.height = fontSize * C.testCanvasFontSizeMultiple;
    const testCtx = testCanvas.getContext('2d');
    testCtx.font = weight + " " + style + " " + fontSize + "px " + fontFamily;

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

//Detects if the browser is ie
let userAgent = window.navigator.userAgent;
export const isIE = userAgent.indexOf('MSIE ') > -1 || 
                    userAgent.indexOf('Trident/') > -1 ||
                    userAgent.indexOf('Edge/') > -1;

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

/**
 * Draws an equilateral stroked triangle based
 * on its center and width.
 * @param centX The X-ordinate of the center of the triangle.
 * @param centY The Y-ordinate of the center of the triangle.
 * @param width The width of the triangle.
 * @param height The height of the triangle.
 * @param ctx The context to render to.
 */
export function tri(centX: number, centY: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    let tlx = centX - width / 2;
    let tly = centY - height / 2;
    ctx.beginPath();
    ctx.moveTo(tlx, tly);
    ctx.lineTo(tlx + width, tly);
    ctx.lineTo(centX, tly + height);
    ctx.lineTo(tlx, tly);
    ctx.fill();
}

window['currentWidthTier'] = getWidthTier();
window.addEventListener('resize', function () {
    window['currentWidthTier'] = getWidthTier();
});

/**
 * Return the current width tier, as
 * defined by consts.widthTiers. The
 * returned number is the index of the
 * consts.widthTiers array. If the window
 * width is less than the minimum defined
 * there, returns the index of the minimum
 * width tier.
 */
export function getWidthTier(): number {
    let currWidth = window.innerWidth;
    for (let i = 0; i < C.widthTiers.length; i++) {
        if (currWidth > C.widthTiers[i]) {
            return i;
        }
    }
    return C.widthTiers.length - 1;
}

/**
 * Calculates and returns the appropriate
 * font size for a width tier.
 */
export function getFontSizeForTier(tier: number): number {
    return C.fontSizes[tier];
}

let mapSupported = typeof window['Map'] === 'function';

/**
 * Get a new Map, or Map-like-object
 * if Map is not supported. Available
 * operations are described by the interface
 * below.
 */
export function newMap(): Map<any, any> {
    return mapSupported ? new window['Map'] : new Similar();
}

export interface Map<K, V> {
    set(key: K, val: V);
    get(key: K);
    has(key: K);
    delete(key: K);
    forEach(callback: (val: V, key: K, object) => void);
    size: number;
}

/**
 * The following is from 
 * https://github.com/thinkloop/map-or-similar.
 * 
 * The MIT License (MIT)

Copyright (c) 2016 Baz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

function Similar(): void {
    this.list = [];
    this.lastItem = undefined;
    this.size = 0;

    return this;
}

Similar.prototype.get = function (key) {
    var index;

    if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
        return this.lastItem.val;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        return this.list[index].val;
    }

    return undefined;
};

Similar.prototype.set = function (key, val) {
    var index;

    if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
        this.lastItem.val = val;
        return this;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        this.list[index].val = val;
        return this;
    }

    this.lastItem = { key: key, val: val };
    this.list.push(this.lastItem);
    this.size++;

    return this;
};

Similar.prototype.delete = function (key) {
    var index;

    if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
        this.lastItem = undefined;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.size--;
        return this.list.splice(index, 1)[0];
    }

    return undefined;
};


// important that has() doesn't use get() in case an existing key has a falsy value, in which case has() would return false
Similar.prototype.has = function (key) {
    var index;

    if (this.lastItem && this.isEqual(this.lastItem.key, key)) {
        return true;
    }

    index = this.indexOf(key);
    if (index >= 0) {
        this.lastItem = this.list[index];
        return true;
    }

    return false;
};

Similar.prototype.forEach = function (callback, thisArg) {
    var i;
    for (i = 0; i < this.size; i++) {
        callback.call(thisArg || this, this.list[i].val, this.list[i].key, this);
    }
};

Similar.prototype.indexOf = function (key) {
    var i;
    for (i = 0; i < this.size; i++) {
        if (this.isEqual(this.list[i].key, key)) {
            return i;
        }
    }
    return -1;
};

// check if the numbers are equal, or whether they are both precisely NaN (isNaN returns true for all non-numbers)
Similar.prototype.isEqual = function (val1, val2) {
    return val1 === val2 || (val1 !== val1 && val2 !== val2);
};
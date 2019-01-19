define(["require", "exports", "./consts"], function (require, exports, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Add styles based on the contents of consts
     */
    function addStyleSheet() {
        let styleEl = document.createElement('style');
        let styleText = "";
        Object.keys(consts_1.default.colors).forEach(colorName => {
            let colorVal = consts_1.default.colors[colorName];
            styleText += '.' + colorName + " { color: " + 'rgb(' + colorVal[0] + ',' + colorVal[1] + "," + colorVal[2] + ")}";
        });
        styleEl.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleEl);
    }
    exports.addStyleSheet = addStyleSheet;
    /**
     * Deeply clones an object, ie clones it
     * and all of its child objects.
     *
     * @param toClone The object to clone.
     */
    function deepClone(toClone) {
        let cloneTo = {};
        recDeepClone(toClone, cloneTo);
        return cloneTo;
    }
    exports.deepClone = deepClone;
    function recDeepClone(toClone, cloneTo) {
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
                        }
                        else {
                            cloneTo[key][i] = val[i];
                        }
                    }
                }
                else {
                    //Clone object
                    cloneTo[key] = {};
                    recDeepClone(val, cloneTo[key]);
                }
            }
            else {
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
    function line(x1, y1, x2, y2, ctx) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    exports.line = line;
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
    function getWidthTier() {
        let currWidth = window.innerWidth;
        for (let i = 0; i < consts_1.default.widthTiers.length; i++) {
            if (currWidth > consts_1.default.widthTiers[i]) {
                return i;
            }
        }
        return consts_1.default.widthTiers.length - 1;
    }
    /**
     * Calculates and returns the appropriate
     * font size for a width tier.
     */
    function getFontSizeForTier(tier) {
        return consts_1.default.fontSizes[tier];
    }
    exports.getFontSizeForTier = getFontSizeForTier;
});

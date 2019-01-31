define(["require", "exports", "./consts"], function (require, exports, consts_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Add styles based on the contents of consts
     */
    function addStyleSheet() {
        var styleEl = document.createElement('style');
        var styleText = "";
        Object.keys(consts_1["default"].colors).forEach(function (colorName) {
            var colorVal = consts_1["default"].colors[colorName];
            styleText += '.' + colorName + " { color: " + 'rgb(' + colorVal[0] + ',' + colorVal[1] + "," + colorVal[2] + ")}";
        });
        styleEl.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleEl);
    }
    exports.addStyleSheet = addStyleSheet;
    //Detects if the browser is ie
    var userAgent = window.navigator.userAgent;
    exports.isIE = userAgent.indexOf('MSIE ') > -1 ||
        userAgent.indexOf('Trident/') > -1 ||
        userAgent.indexOf('Edge/') > -1;
    /**
     * Deeply clones an object, ie clones it
     * and all of its child objects.
     *
     * @param toClone The object to clone.
     */
    function deepClone(toClone) {
        var cloneTo = {};
        recDeepClone(toClone, cloneTo);
        return cloneTo;
    }
    exports.deepClone = deepClone;
    function recDeepClone(toClone, cloneTo) {
        Object.keys(toClone).forEach(function (key) {
            var val = toClone[key];
            if (typeof val === 'object') {
                if (Array.isArray(val)) {
                    //Clone array
                    cloneTo[key] = [];
                    for (var i = 0; i < val.length; i++) {
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
        var currWidth = window.innerWidth;
        for (var i = 0; i < consts_1["default"].widthTiers.length; i++) {
            if (currWidth > consts_1["default"].widthTiers[i]) {
                return i;
            }
        }
        return consts_1["default"].widthTiers.length - 1;
    }
    /**
     * Calculates and returns the appropriate
     * font size for a width tier.
     */
    function getFontSizeForTier(tier) {
        return consts_1["default"].fontSizes[tier];
    }
    exports.getFontSizeForTier = getFontSizeForTier;
    var mapSupported = typeof window['Map'] === 'function';
    /**
     * Get a new Map, or Map-like-object
     * if Map is not supported. Available
     * operations are described by the interface
     * below.
     */
    function newMap() {
        return mapSupported ? new window['Map'] : new Similar();
    }
    exports.newMap = newMap;
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
    function Similar() {
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
    Similar.prototype["delete"] = function (key) {
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
});

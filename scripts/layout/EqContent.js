define(["require", "exports", "./EqComponent", "../main/consts"], function (require, exports, EqComponent_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EqContent extends EqComponent_1.default {
        constructor(padding) {
            super(padding);
            this.color = consts_1.default.colors['default'];
            this.opacity = consts_1.default.normalOpacity;
        }
        setFill(ctx) {
            ctx.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
        }
        /**
         * Checks if this content has a different
         * color to the argument.
         *
         * @param newColor The color to check.
         */
        hasDifferentColor(newColor) {
            return newColor[0] !== this.color[0] ||
                newColor[1] !== this.color[1] ||
                newColor[2] !== this.color[2];
        }
        setColor(newColor) {
            this.color = newColor;
        }
        getColor() {
            return this.color;
        }
        setOpacity(newOpacity) {
            this.opacity = newOpacity;
        }
        getOpacity() {
            return this.opacity;
        }
    }
    exports.default = EqContent;
});

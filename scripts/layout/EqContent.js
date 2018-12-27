define(["require", "exports", "./EqComponent", "../main/consts"], function (require, exports, EqComponent_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EqContent extends EqComponent_1.default {
        constructor(padding) {
            super(padding);
            this.color = consts_1.default.defaultColor;
            this.opacity = consts_1.default.normalOpacity;
        }
        setFill(ctx) {
            ctx.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
        }
        setColor(newColor) {
            this.color = newColor;
        }
        setOpacity(newOpacity) {
            this.opacity = newOpacity;
        }
    }
    exports.default = EqContent;
});

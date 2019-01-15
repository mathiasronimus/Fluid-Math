define(["require", "exports", "./EqComponent", "../main/consts"], function (require, exports, EqComponent_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EqContent extends EqComponent_1.default {
        constructor(padding) {
            super(padding);
            this.color = consts_1.default.colors['default'];
            this.opacity = consts_1.default.normalOpacity;
        }
        /**
         * Sets up the Canvas by performing
         * transformations and style changes.
         * Subclasses should call the method as
         * defined here, then draw themselves
         * centered on (0, 0). Returns width
         * and height to allow them to do this.
         * There is no need to call save() or
         * restore(), animations handle this.
         *
         * @param before The State before.
         * @param after The State after.
         * @param progress How close we are to after, from before,
         *                 from 0-1.
         * @param ctx The rendering context.
         */
        setupCtx(before, after, progress, ctx) {
            let invProg = 1 - progress;
            let x = before.tlx * invProg + after.tlx * progress;
            let y = before.tly * invProg + after.tly * progress;
            let width = before.width * invProg + after.width * progress;
            let height = before.height * invProg + after.height * progress;
            let scale = before.scale * invProg + after.scale * progress;
            ctx.translate(x + width / 2, y + height / 2);
            ctx.scale(scale, scale);
            this.setCtxStyle(ctx);
            return [width, height];
        }
        /**
         * Sets a graphics context to have
         * the color and opacity of this content.
         *
         * @param ctx The graphics context.
         */
        setCtxStyle(ctx) {
            let style = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
            ctx.fillStyle = style;
            ctx.strokeStyle = style;
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

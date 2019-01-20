var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./EqComponent", "../main/consts"], function (require, exports, EqComponent_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    var EqContent = (function (_super) {
        __extends(EqContent, _super);
        function EqContent(padding) {
            var _this = _super.call(this, padding) || this;
            _this.color = consts_1["default"].colors['default'];
            _this.opacity = consts_1["default"].normalOpacity;
            return _this;
        }
        /**
         * Sets up the Canvas by performing
         * transformations and style changes.
         * Subclasses should call the method as
         * defined here, then draw themselves
         * centered on (0, 0). Returns width
         * and height and scale to allow them
         * to do this.
         * There is no need to call save() or
         * restore(), animations handle this.
         *
         * @param before The State before.
         * @param after The State after.
         * @param progress How close we are to after, from before,
         *                 from 0-1.
         * @param ctx The rendering context.
         */
        EqContent.prototype.setupCtx = function (before, after, progress, ctx) {
            var invProg = 1 - progress;
            var x = before.tlx * invProg + after.tlx * progress;
            var y = before.tly * invProg + after.tly * progress;
            var width = before.width * invProg + after.width * progress;
            var height = before.height * invProg + after.height * progress;
            var scale = before.scale * invProg + after.scale * progress;
            ctx.translate(x + width / 2, y + height / 2);
            ctx.scale(scale, scale);
            this.setCtxStyle(ctx);
            return [width, height];
        };
        /**
         * Sets a graphics context to have
         * the color and opacity of this content.
         *
         * @param ctx The graphics context.
         */
        EqContent.prototype.setCtxStyle = function (ctx) {
            var style = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
            ctx.fillStyle = style;
            ctx.strokeStyle = style;
        };
        /**
         * Checks if this content has a different
         * color to the argument.
         *
         * @param newColor The color to check.
         */
        EqContent.prototype.hasDifferentColor = function (newColor) {
            return newColor[0] !== this.color[0] ||
                newColor[1] !== this.color[1] ||
                newColor[2] !== this.color[2];
        };
        EqContent.prototype.setColor = function (newColor) {
            this.color = [Math.round(newColor[0]), Math.round(newColor[1]), Math.round(newColor[2])];
        };
        EqContent.prototype.getColor = function () {
            return this.color;
        };
        EqContent.prototype.setOpacity = function (newOpacity) {
            this.opacity = newOpacity;
        };
        EqContent.prototype.getOpacity = function () {
            return this.opacity;
        };
        return EqContent;
    }(EqComponent_1["default"]));
    exports["default"] = EqContent;
});

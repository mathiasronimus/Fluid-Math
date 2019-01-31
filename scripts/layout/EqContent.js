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
        function EqContent(padding, ref) {
            var _this = _super.call(this, padding) || this;
            //Whether to interpolate color and opacity
            //during the current animation.
            _this.interpColor = true;
            _this.ref = ref;
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
            if (progress === 0) {
                //Check whether to interpolate color at start of animation
                var colB = before.color;
                var colA = after.color;
                this.interpColor = colB[0] !== colA[0] ||
                    colB[1] !== colA[1] ||
                    colB[2] !== colA[2] ||
                    before.opacity !== after.opacity;
            }
            var color = before.color;
            var opacity = before.opacity;
            if (this.interpColor) {
                var r = before.color[0] * invProg + after.color[0] * progress;
                var g = before.color[1] * invProg + after.color[1] * progress;
                var b = before.color[2] * invProg + after.color[2] * progress;
                var a = before.opacity * invProg + after.opacity * progress;
                color = [Math.round(r), Math.round(g), Math.round(b)];
                opacity = a;
            }
            this.setCtxStyle(ctx, color, opacity);
            return [width, height];
        };
        /**
         * Sets a graphics context to have
         * a certain color and opacity.
         *
         * @param ctx The graphics context.
         * @param color The color.
         * @param opacity The opacity.
         */
        EqContent.prototype.setCtxStyle = function (ctx, color, opacity) {
            var style = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + opacity + ")";
            ctx.fillStyle = style;
            ctx.strokeStyle = style;
        };
        /**
         * Given a colors object, determine what
         * color this content should be.
         *
         * @param colorObj The colors object for a step.
         */
        EqContent.prototype.getColorForContent = function (colorObj) {
            if (colorObj !== undefined && colorObj[this.ref] !== undefined) {
                //A color is specified
                return consts_1["default"].colors[colorObj[this.ref]];
            }
            else {
                //A color isn't specified, use default
                return consts_1["default"].colors['default'];
            }
        };
        /**
         * Gets the opacity for this content
         * at a step.
         *
         * @param opacityObj The opacities object for a step.
         */
        EqContent.prototype.getOpacityForContent = function (opacityObj) {
            if (opacityObj !== undefined && opacityObj[this.ref] !== undefined) {
                //Opacity specified
                return opacityObj[this.ref];
            }
            else {
                //No opacity specified
                return consts_1["default"].normalOpacity;
            }
        };
        /**
         * Set the content to not interpolate color
         * until setupCtx is called with progress = 0.
         */
        EqContent.prototype.interpColorOff = function () {
            this.interpColor = false;
        };
        return EqContent;
    }(EqComponent_1["default"]));
    exports["default"] = EqContent;
});

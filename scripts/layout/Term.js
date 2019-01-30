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
define(["require", "exports", "../main/consts", "./EqContent", "../animation/TermLayoutState"], function (require, exports, consts_1, EqContent_1, TermLayoutState_1) {
    "use strict";
    exports.__esModule = true;
    var Term = (function (_super) {
        __extends(Term, _super);
        function Term(text, widths, heights, ascents, ref) {
            var _this = 
            //At the time of term initialization, layout is unknown.
            _super.call(this, consts_1["default"].termPadding, ref) || this;
            _this.widths = widths;
            _this.heights = heights;
            _this.halfInnerWidths = _this.widths.map(function (width) { return width / 2; });
            _this.halfInnerHeights = _this.heights.map(function (height) { return height / 2; });
            _this.ascents = ascents;
            _this.recalcDimensions();
            window.addEventListener('resize', _this.recalcDimensions.bind(_this));
            _this.text = text;
            return _this;
        }
        Term.prototype.recalcDimensions = function () {
            this.height = this.calcHeight();
            this.width = this.calcWidth();
            var tier = window['currentWidthTier'];
            this.halfInnerWidth = this.halfInnerWidths[tier];
            this.halfInnerHeight = this.halfInnerHeights[tier];
            this.ascent = this.ascents[tier];
        };
        Term.prototype.calcHeight = function () {
            var tier = window['currentWidthTier'];
            return this.heights[tier] + this.padding.height();
        };
        Term.prototype.calcWidth = function () {
            var tier = window['currentWidthTier'];
            return this.widths[tier] + this.padding.width();
        };
        Term.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
            var state = new TermLayoutState_1["default"](parentLayout, this, tlx, tly, this.width * currScale, this.height * currScale, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj));
            layouts.set(this, state);
            return state;
        };
        Term.prototype.draw = function (before, after, progress, ctx) {
            this.setupCtx(before, after, progress, ctx);
            ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
        };
        return Term;
    }(EqContent_1["default"]));
    exports["default"] = Term;
});

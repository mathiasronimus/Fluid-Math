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
define(["require", "exports", "./EqContent", "../animation/ContentLayoutState", "../main/helpers"], function (require, exports, EqContent_1, ContentLayoutState_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    var HDivider = (function (_super) {
        __extends(HDivider, _super);
        function HDivider(padding, ref) {
            var _this = _super.call(this, padding, ref) || this;
            _this.height = 1 + _this.padding.height();
            //For layout purposes, the divider
            //has no width. It stretches to fill
            //its container.
            _this.width = 0;
            return _this;
        }
        HDivider.prototype.calcWidth = function () { return 0; };
        HDivider.prototype.calcHeight = function () { return 0; };
        HDivider.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
            //Set x to align left with parent
            var x = parentLayout.tlx;
            var width = parentLayout.width;
            var height = this.getHeight();
            var state = new ContentLayoutState_1["default"](parentLayout, this, x, tly, width, height, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj));
            layouts.set(this, state);
            return state;
        };
        HDivider.prototype.draw = function (before, after, progress, ctx) {
            var width = this.setupCtx(before, after, progress, ctx)[0];
            helpers_1.line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
        };
        return HDivider;
    }(EqContent_1["default"]));
    exports["default"] = HDivider;
});

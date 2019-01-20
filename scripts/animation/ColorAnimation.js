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
define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Animates between two colors.
     */
    var ColorAnimation = (function (_super) {
        __extends(ColorAnimation, _super);
        function ColorAnimation(before, after, set, content) {
            var _this = _super.call(this, consts_1["default"].colorDuration, consts_1["default"].colorEasing, set) || this;
            _this.before = before;
            _this.after = after;
            _this.content = content;
            return _this;
        }
        ColorAnimation.prototype.step = function (completion) {
            var invComp = 1 - completion;
            var newColor = [
                this.before[0] * invComp + this.after[0] * completion,
                this.before[1] * invComp + this.after[1] * completion,
                this.before[2] * invComp + this.after[2] * completion
            ];
            this.content.setColor(newColor);
        };
        return ColorAnimation;
    }(BezierCallback_1["default"]));
    exports["default"] = ColorAnimation;
});

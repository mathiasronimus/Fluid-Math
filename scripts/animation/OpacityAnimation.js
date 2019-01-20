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
    var OpacityAnimation = (function (_super) {
        __extends(OpacityAnimation, _super);
        function OpacityAnimation(startOpacity, endOpacity, content, set) {
            var _this = _super.call(this, consts_1["default"].opacityDuration, consts_1["default"].opacityEasing, set) || this;
            _this.startOpacity = startOpacity;
            _this.endOpacity = endOpacity;
            _this.content = content;
            return _this;
        }
        OpacityAnimation.prototype.step = function (completion) {
            this.content.setOpacity(this.startOpacity * (1 - completion) + this.endOpacity * completion);
        };
        return OpacityAnimation;
    }(BezierCallback_1["default"]));
    exports["default"] = OpacityAnimation;
});

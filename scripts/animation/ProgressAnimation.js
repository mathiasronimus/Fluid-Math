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
     * Draws a progress bar at the top of the
     * canvas.
     */
    var ProgressAnimation = (function (_super) {
        __extends(ProgressAnimation, _super);
        function ProgressAnimation(startStep, endStep, numSteps, canvasWidth, line, set) {
            var _this = _super.call(this, consts_1["default"].progressDuration, consts_1["default"].progressEasing, set) || this;
            var widthPerSegment = (canvasWidth - consts_1["default"].borderRadius * 2) / (numSteps - 1);
            _this.startWidth = startStep * widthPerSegment;
            _this.endWidth = endStep * widthPerSegment;
            _this.line = line;
            return _this;
        }
        ProgressAnimation.prototype.step = function (completion) {
            var width = this.startWidth * (1 - completion) + this.endWidth * completion;
            this.line.style.width = width + "px";
        };
        return ProgressAnimation;
    }(BezierCallback_1["default"]));
    exports["default"] = ProgressAnimation;
});

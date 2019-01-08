define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasSizeAnimation extends BezierCallback_1.default {
        constructor(startHeight, endHeight, fitFunc, set) {
            super(consts_1.default.canvasSizeDuration, consts_1.default.canvasSizeEasing, set);
            this.startHeight = startHeight;
            this.endHeight = endHeight;
            this.fitFunc = fitFunc;
        }
        step(completion) {
            this.fitFunc(this.startHeight * (1 - completion) + this.endHeight * completion);
        }
    }
    exports.default = CanvasSizeAnimation;
});

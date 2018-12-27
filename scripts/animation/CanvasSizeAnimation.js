define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CanvasSizeAnimation extends BezierCallback_1.default {
        constructor(startHeight, endHeight, fitFunc, set) {
            let step = function (completion) {
                fitFunc(startHeight * (1 - completion) + endHeight * completion);
            };
            super(consts_1.default.canvasSizeDuration, consts_1.default.canvasSizeEasing, undefined, step, set);
        }
    }
    exports.default = CanvasSizeAnimation;
});

define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ColorAnimation extends BezierCallback_1.default {
        constructor(before, after, set, content) {
            let step = function (completion) {
                let invComp = 1 - completion;
                let newColor = [
                    before[0] * invComp + after[0] * completion,
                    before[1] * invComp + after[1] * completion,
                    before[2] * invComp + after[2] * completion
                ];
                content.setColor(newColor);
            };
            super(consts_1.default.colorDuration, consts_1.default.colorEasing, undefined, step, set);
        }
    }
    exports.default = ColorAnimation;
});

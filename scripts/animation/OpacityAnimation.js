define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OpacityAnimation extends BezierCallback_1.default {
        constructor(startOpacity, endOpacity, content, set) {
            let step = function (completion) {
                content.setOpacity(startOpacity * (1 - completion) + endOpacity * completion);
            };
            super(consts_1.default.opacityDuration, consts_1.default.opacityEasing, undefined, step, set);
        }
    }
    exports.default = OpacityAnimation;
});

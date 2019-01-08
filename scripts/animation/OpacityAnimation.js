define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class OpacityAnimation extends BezierCallback_1.default {
        constructor(startOpacity, endOpacity, content, set) {
            super(consts_1.default.opacityDuration, consts_1.default.opacityEasing, set);
            this.startOpacity = startOpacity;
            this.endOpacity = endOpacity;
            this.content = content;
        }
        step(completion) {
            this.content.setOpacity(this.startOpacity * (1 - completion) + this.endOpacity * completion);
        }
    }
    exports.default = OpacityAnimation;
});

define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Animates between two colors.
     */
    class ColorAnimation extends BezierCallback_1.default {
        constructor(before, after, set, content) {
            super(consts_1.default.colorDuration, consts_1.default.colorEasing, set);
            this.before = before;
            this.after = after;
            this.content = content;
        }
        step(completion) {
            let invComp = 1 - completion;
            let newColor = [
                this.before[0] * invComp + this.after[0] * completion,
                this.before[1] * invComp + this.after[1] * completion,
                this.before[2] * invComp + this.after[2] * completion
            ];
            this.content.setColor(newColor);
        }
    }
    exports.default = ColorAnimation;
});

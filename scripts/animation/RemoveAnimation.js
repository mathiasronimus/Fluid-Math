define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RemoveAnimation extends BezierCallback_1.default {
        constructor(start, set, ctx) {
            let step = function (completion) {
                ctx.save();
                ctx.fillStyle = "rgba(0, 0, 0, " + (1 - completion) + ")";
                start.component.draw(start.changeScale(1 - completion), ctx);
                ctx.restore();
            };
            super(consts_1.default.removeDuration, consts_1.default.removeEasing, undefined, step, set);
        }
    }
    exports.default = RemoveAnimation;
});

define(["require", "exports", "./BezierCallback", "./LayoutState", "../main/consts"], function (require, exports, BezierCallback_1, LayoutState_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveAnimation extends BezierCallback_1.default {
        constructor(start, end, set, ctx) {
            let step = function (completion) {
                ctx.save();
                start.component.draw(LayoutState_1.default.interpolate(start, end, completion), ctx);
                ctx.restore();
            };
            super(consts_1.default.moveDuration, consts_1.default.moveEasing, undefined, step, set);
        }
    }
    exports.default = MoveAnimation;
});

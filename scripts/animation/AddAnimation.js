define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Animates a component in by scaling it from
     * 0 to its normal size.
     */
    class AddAnimation extends BezierCallback_1.default {
        constructor(start, set, ctx) {
            let step = function (completion) {
                ctx.save();
                start.component.draw(start.changeScale(completion), ctx);
                ctx.restore();
            };
            super(consts_1.default.addDuration, consts_1.default.addEasing, undefined, step, set);
        }
    }
    exports.default = AddAnimation;
});

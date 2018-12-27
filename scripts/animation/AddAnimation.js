define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Animates a component in by scaling it from
     * 0 to its normal size.
     */
    class AddAnimation extends BezierCallback_1.default {
        constructor(end, set, ctx) {
            let step = function (completion) {
                ctx.save();
                //Translate to the right spot
                ctx.translate(end.tlx + end.width / 2, end.tly + end.height / 2);
                //Scale according to the animation
                ctx.scale(completion, completion);
                end.component.draw(end.width, end.height, ctx);
                ctx.restore();
            };
            super(consts_1.default.addDuration, consts_1.default.addEasing, undefined, step, set);
        }
    }
    exports.default = AddAnimation;
});

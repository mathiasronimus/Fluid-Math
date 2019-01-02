define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveAnimation extends BezierCallback_1.default {
        constructor(start, end, set, ctx) {
            let content = start.component;
            let step = function (completion) {
                ctx.save();
                //Calculate the interpolations
                let invComp = 1 - completion;
                let x = start.tlx * invComp + end.tlx * completion;
                let y = start.tly * invComp + end.tly * completion;
                let width = start.width * invComp + end.width * completion;
                let height = start.height * invComp + end.height * completion;
                let scale = start.scale * invComp + end.scale * completion;
                //Translate to right spot
                ctx.translate(x + width / 2, y + height / 2);
                //Scale according to animation
                ctx.scale(scale, scale);
                content.draw(width, height, ctx);
                ctx.restore();
            };
            super(consts_1.default.moveDuration, consts_1.default.moveEasing, undefined, step, set);
        }
    }
    exports.default = MoveAnimation;
});

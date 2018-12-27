define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RemoveAnimation extends BezierCallback_1.default {
        constructor(start, set, ctx) {
            let step = function (completion) {
                ctx.save();
                let invComp = 1 - completion;
                //Translate to right spot
                ctx.translate(start.tlx + start.width / 2, start.tly + start.height / 2);
                //Scale
                ctx.scale(invComp, invComp);
                start.component.draw(start.width, start.height, ctx);
                ctx.restore();
            };
            super(consts_1.default.removeDuration, consts_1.default.removeEasing, undefined, step, set);
        }
    }
    exports.default = RemoveAnimation;
});

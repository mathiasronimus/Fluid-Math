define(["require", "exports", "./BezierCallback"], function (require, exports, BezierCallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A bezier callback whose step function
     * calls the draw function of content.
     */
    class Animation extends BezierCallback_1.default {
        constructor(duration, easing, set, before, after, component, ctx) {
            super(duration, easing, set);
            this.before = before;
            this.after = after;
            this.component = component;
            this.ctx = ctx;
        }
        step(completion) {
            this.ctx.save();
            this.component.draw(this.before, this.after, completion, this.ctx);
            this.ctx.restore();
        }
    }
    exports.default = Animation;
});

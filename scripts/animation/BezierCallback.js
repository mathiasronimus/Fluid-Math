define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Animates by repeatedly calling a step
     * function whose completion over time is
     * determined by a bezier curve.
     */
    class BezierCallback {
        constructor(duration, easing, begin, step, set) {
            this.started = false;
            this.done = false;
            this.duration = duration;
            this.easing = easing;
            this.begin = begin;
            this.step = step;
            this.set = set;
        }
        run(timestamp) {
            if (this.done)
                return;
            if (!this.started) {
                //Special Case: First Frame
                this.tOffset = timestamp;
                this.started = true;
                if (this.begin)
                    this.begin();
                this.step(0);
                return;
            }
            let elapsed = timestamp - this.tOffset;
            if (elapsed >= this.duration) {
                //Done
                this.step(1);
                this.set.finished();
                this.done = true;
            }
            else {
                this.step(this.easing(elapsed / this.duration));
            }
        }
    }
    exports.default = BezierCallback;
});

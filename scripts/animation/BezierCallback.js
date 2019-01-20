define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Animates by repeatedly calling a step
     * function whose completion over time is
     * determined by a bezier curve.
     */
    var BezierCallback = (function () {
        function BezierCallback(duration, easing, set) {
            this.started = false;
            this.done = false;
            this.duration = duration;
            this.easing = easing;
            this.set = set;
        }
        BezierCallback.prototype.run = function (timestamp) {
            if (this.done)
                return;
            if (!this.started) {
                //Special Case: First Frame
                this.tOffset = timestamp;
                this.started = true;
                this.step(0);
                return;
            }
            var elapsed = timestamp - this.tOffset;
            if (elapsed >= this.duration) {
                //Done
                this.step(1);
                this.set.finished();
                this.done = true;
            }
            else {
                this.step(this.easing(elapsed / this.duration));
            }
        };
        return BezierCallback;
    }());
    exports["default"] = BezierCallback;
});

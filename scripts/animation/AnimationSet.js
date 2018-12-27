define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Plays a set of animations and provides
     * options for controlling them as a group.
     */
    class AnimationSet {
        constructor(done) {
            this.animations = [];
            this.done = done;
        }
        addAnimation(anim) {
            this.animations.push(anim);
        }
        /**
         * Starts running the animations.
         */
        start() {
            this.numRunning = this.animations.length;
            let this_ = this;
            let doAll = function (timestamp) {
                this_.animations.forEach(a => {
                    a.run(timestamp);
                });
                if (this_.numRunning > 0) {
                    requestAnimationFrame(doAll);
                }
            };
            requestAnimationFrame(doAll);
        }
        /**
         * Called by a BezierCallback when it is done.
         */
        finished() {
            this.numRunning--;
            if (this.numRunning === 0) {
                this.done();
            }
        }
    }
    exports.default = AnimationSet;
});

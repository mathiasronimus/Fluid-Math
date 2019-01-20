define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Plays a set of animations and provides
     * options for controlling them as a group.
     * Also erases the canvas before each frame.
     */
    var AnimationSet = (function () {
        function AnimationSet(done, ctx, clearWidth, clearHeight) {
            this.animations = [];
            this.done = done;
            this.ctx = ctx;
            this.clearWidth = clearWidth;
            this.clearHeight = clearHeight;
        }
        AnimationSet.prototype.addAnimation = function (anim) {
            this.animations.push(anim);
        };
        /**
         * Starts running the animations.
         */
        AnimationSet.prototype.start = function () {
            this.numRunning = this.animations.length;
            var this_ = this;
            var doAll = function (timestamp) {
                this_.ctx.clearRect(0, 0, this_.clearWidth, this_.clearHeight);
                this_.animations.forEach(function (a) {
                    a.run(timestamp);
                });
                if (this_.numRunning > 0) {
                    requestAnimationFrame(doAll);
                }
            };
            requestAnimationFrame(doAll);
        };
        /**
         * Called by a BezierCallback when it is done.
         */
        AnimationSet.prototype.finished = function () {
            this.numRunning--;
            if (this.numRunning === 0) {
                this.done();
            }
        };
        return AnimationSet;
    }());
    exports["default"] = AnimationSet;
});

define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Draws a progress bar at the top of the
     * canvas.
     */
    class ProgressAnimation extends BezierCallback_1.default {
        constructor(startStep, endStep, numSteps, canvasWidth, line, set) {
            super(consts_1.default.progressDuration, consts_1.default.progressEasing, set);
            let widthPerSegment = canvasWidth / (numSteps - 1);
            this.startWidth = startStep * widthPerSegment;
            this.endWidth = endStep * widthPerSegment;
            this.line = line;
        }
        step(completion) {
            let width = this.startWidth * (1 - completion) + this.endWidth * completion;
            this.line.style.width = width + "px";
        }
    }
    exports.default = ProgressAnimation;
});

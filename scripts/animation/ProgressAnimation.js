define(["require", "exports", "./BezierCallback", "../main/consts"], function (require, exports, BezierCallback_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Draws a progress bar at the top of the
     * canvas.
     */
    class ProgressAnimation extends BezierCallback_1.default {
        constructor(startStep, endStep, numSteps, canvasWidth, line, set) {
            let widthPerSegment = canvasWidth / (numSteps - 1);
            let startWidth = startStep * widthPerSegment;
            let endWidth = endStep * widthPerSegment;
            let step = function (completion) {
                let width = startWidth * (1 - completion) + endWidth * completion;
                line.style.width = width + "px";
            };
            super(consts_1.default.progressDuration, consts_1.default.progressEasing, undefined, step, set);
        }
    }
    exports.default = ProgressAnimation;
});

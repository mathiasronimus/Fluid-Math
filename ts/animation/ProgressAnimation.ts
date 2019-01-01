import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';

/**
 * Draws a progress bar at the top of the
 * canvas.
 */
export default class ProgressAnimation extends BezierCallback {

    constructor(startStep: number, endStep: number, numSteps: number, canvasWidth: number, line: HTMLDivElement, set: AnimationSet) {

        let widthPerSegment = canvasWidth / (numSteps - 1);
        let startWidth = startStep * widthPerSegment;
        let endWidth = endStep * widthPerSegment;

        let step = function(completion: number) {
            let width = startWidth * (1 - completion) + endWidth * completion;
            line.style.width = width + "px";
        }

        super(C.progressDuration, C.progressEasing, undefined, step, set);
    }
}
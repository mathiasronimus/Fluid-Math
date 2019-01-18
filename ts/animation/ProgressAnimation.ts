import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';

/**
 * Draws a progress bar at the top of the
 * canvas.
 */
export default class ProgressAnimation extends BezierCallback {

    private startWidth: number;
    private endWidth: number;
    private line: HTMLDivElement;

    constructor(startStep: number, endStep: number, numSteps: number, canvasWidth: number, line: HTMLDivElement, set: AnimationSet) {
        super(C.progressDuration, C.progressEasing, set);
        let widthPerSegment = (canvasWidth - C.borderRadius * 2) / (numSteps - 1);
        this.startWidth = startStep * widthPerSegment;
        this.endWidth = endStep * widthPerSegment;
        this.line = line;
    }

    protected step (completion: number) {
        let width = this.startWidth * (1 - completion) + this.endWidth * completion;
        this.line.style.width = width + "px";
    }
}
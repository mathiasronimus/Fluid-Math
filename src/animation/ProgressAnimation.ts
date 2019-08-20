import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import ProgressIndicator from "../main/ProgressIndicator";

/**
 * Animate the progress indicator.
 */
export default class ProgressAnimation extends BezierCallback {

    private startCompletion: number;
    private endCompletion: number;
    private pi: ProgressIndicator;

    private canvasWidth: number;
    private canvasHeight: number;

    constructor(startStep: number, endStep: number, numSteps: number, pi: ProgressIndicator, set: AnimationSet, duration: number,
                easing, canvasWidth: number, canvasHeight: number) {
        super(duration, easing, set);
        this.startCompletion = startStep / (numSteps - 1);
        this.endCompletion = endStep / (numSteps - 1);
        this.pi = pi;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    protected step(animCompletion: number) {
        const currCompletion = this.startCompletion * (1 - animCompletion) + this.endCompletion * animCompletion;
        this.pi.draw(currCompletion, this.canvasWidth, this.canvasHeight);
    }
}
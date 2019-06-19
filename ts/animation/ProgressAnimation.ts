import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';
import ProgressIndicator from "../main/ProgressIndicator";

/**
 * Animate the progress indicator.
 */
export default class ProgressAnimation extends BezierCallback {

    private startCompletion: number;
    private endCompletion: number;
    private pi: ProgressIndicator;

    constructor(startStep: number, endStep: number, numSteps: number, pi: ProgressIndicator, set: AnimationSet, duration: number) {
        super(duration, C.progressEasing, set);
        this.startCompletion = startStep / (numSteps - 1);
        this.endCompletion = endStep / (numSteps - 1);
        this.pi = pi;
    }

    protected step(animCompletion: number) {
        const currCompletion = this.startCompletion * (1 - animCompletion) + this.endCompletion * animCompletion;
        this.pi.draw(currCompletion);
    }
}
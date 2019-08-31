import BezierCallback from "./BezierCallback";
import ProgressIndicator from "../main/ProgressIndicator";
import AnimationSet from "./AnimationSet";
import { autoplayProgressEasing } from "../main/consts";

export default class AutoplayProgressAnimation extends BezierCallback {
    
    private pi: ProgressIndicator;

    private canvasWidth: number;
    private canvasHeight: number;

    constructor(pi: ProgressIndicator, set: AnimationSet, duration: number, canvasWidth: number, canvasHeight: number) {
        super(duration, autoplayProgressEasing, set);
        this.pi = pi;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    protected step(completion: number) {
        this.pi.draw(completion, this.canvasWidth, this.canvasHeight);
    }
}
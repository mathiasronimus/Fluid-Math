import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import RadioButtonLayoutState from "./RadioButtonLayoutState";

export default class RadioButtonSelectAnimation extends BezierCallback {

    private layout: RadioButtonLayoutState;
    private startFill: number;
    private endFill: number;
    
    constructor(duration: number, easing, set: AnimationSet, layout: RadioButtonLayoutState, startFill: number, endFill: number) {
        super(duration, easing, set);
        this.layout = layout;
        this.startFill = startFill;
        this.endFill = endFill;
        set.addAnimation(this);
    }

    protected step(completion: number): void {
        const currFill = this.startFill * (1 - completion) + this.endFill * completion;
        this.layout.percentFill = currFill;
    }
}
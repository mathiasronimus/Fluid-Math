import BezierCallback from "./BezierCallback";
import ContentLayoutState from "./ContentLayoutState";
import AnimationSet from "./AnimationSet";
import { outlineFadeInDuration, outlineFadeInEasing } from "../main/consts";

export default class OutlineFadeAnimation extends BezierCallback {

    private layout: ContentLayoutState;
    private startO: number;
    private endO: number;

    constructor(outlineLayout: ContentLayoutState, newOpacity: number, set: AnimationSet) {
        super(outlineFadeInDuration, outlineFadeInEasing, set);
        this.layout = outlineLayout;
        this.startO = this.layout.opacity;
        this.endO = newOpacity;
        set.addAnimation(this);
    }

    protected step(completion: number): void {
        const currOpacity = this.startO * (1 - completion) + this.endO * completion;
        this.layout.opacity = currOpacity;
    }
    
}
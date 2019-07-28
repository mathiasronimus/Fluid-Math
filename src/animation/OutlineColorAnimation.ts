import BezierCallback from "./BezierCallback";
import ContentLayoutState from "./ContentLayoutState";
import C from '../main/consts';
import AnimationSet from "./AnimationSet";

export default class OutlineColorAnimation extends BezierCallback {

    private layout: ContentLayoutState;
    private startColor: number[];
    private endColor: number[];

    constructor(outlineLayout: ContentLayoutState, newColor: number[], set: AnimationSet) {
        super(C.outlineFadeInDuration, C.outlineFadeInEasing, set);
        this.layout = outlineLayout;
        this.startColor = this.layout.color;
        this.endColor = newColor;
        set.addAnimation(this);
    }

    protected step(completion: number): void {
        const currR = this.startColor[0] * (1 - completion) + this.endColor[0] * completion;
        const currG = this.startColor[1] * (1 - completion) + this.endColor[1] * completion;
        const currB = this.startColor[2] * (1 - completion) + this.endColor[2] * completion;
        this.layout.color = [Math.round(currR), Math.round(currG), Math.round(currB)];
    }
    
}
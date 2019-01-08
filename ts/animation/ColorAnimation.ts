import BezierCallback from "./BezierCallback";
import C from '../main/consts';
import AnimationSet from "./AnimationSet";
import EqContent from "../layout/EqContent";

/**
 * Animates between two colors.
 */
export default class ColorAnimation extends BezierCallback {

    private before: number[];
    private after: number[];
    private content: EqContent<any>;

    constructor(before: number[], after: number[], set: AnimationSet, content: EqContent<any>) {
        super(C.colorDuration, C.colorEasing, set);
        this.before = before;
        this.after = after;
        this.content = content;
    }

    protected step(completion: number) {
        let invComp = 1 - completion;
        let newColor = [
            this.before[0] * invComp + this.after[0] * completion,
            this.before[1] * invComp + this.after[1] * completion,
            this.before[2] * invComp + this.after[2] * completion
        ];
        this.content.setColor(newColor);
    }
}
import BezierCallback from "./BezierCallback";
import C from '../main/consts';
import EqContent from "../layout/EqContent";
import AnimationSet from "./AnimationSet";

export default class OpacityAnimation extends BezierCallback {

    private startOpacity: number;
    private endOpacity: number;
    private content: EqContent<any>;

    constructor(startOpacity: number, endOpacity: number, content: EqContent<any>, set: AnimationSet) {
        super(C.opacityDuration, C.opacityEasing, set);
        this.startOpacity = startOpacity;
        this.endOpacity = endOpacity;
        this.content = content;
    }

    protected step(completion) {
        this.content.setOpacity(this.startOpacity * (1 - completion) + this.endOpacity * completion);
    }

}
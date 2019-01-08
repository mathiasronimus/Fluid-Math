import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';

export default class CanvasSizeAnimation extends BezierCallback {

    private startHeight: number;
    private endHeight: number;
    private fitFunc: (h: number) => void;

    constructor(startHeight: number, endHeight: number, fitFunc: (h: number) => void, set: AnimationSet) {
        super(C.canvasSizeDuration, C.canvasSizeEasing, set);
        this.startHeight = startHeight;
        this.endHeight = endHeight;
        this.fitFunc = fitFunc;
    }

    step(completion: number) {
        this.fitFunc(this.startHeight * (1 - completion) + this.endHeight * completion);
    }
}
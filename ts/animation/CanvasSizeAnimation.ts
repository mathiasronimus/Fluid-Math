import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';

export default class CanvasSizeAnimation extends BezierCallback {

    constructor(startHeight: number, endHeight: number, fitFunc: (h: number) => void, set: AnimationSet) {

        let step = function(completion: number) {
            fitFunc(startHeight * (1 - completion) + endHeight * completion);
        }

        super(C.canvasSizeDuration, C.canvasSizeEasing, undefined, step, set);
    }
}
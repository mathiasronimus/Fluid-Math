import BezierCallback from "./BezierCallback";
import C from '../main/consts';
import AnimationSet from "./AnimationSet";
import EqContent from "../layout/EqContent";

export default class ColorAnimation extends BezierCallback {

    constructor(before: number[], after: number[], set: AnimationSet, content: EqContent) {

        let step = function(completion: number) {
            let invComp = 1 - completion;
            let newColor = [
                before[0] * invComp + after[0] * completion,
                before[1] * invComp + after[1] * completion,
                before[2] * invComp + after[2] * completion
            ];
            content.setColor(newColor);
        }

        super(C.colorDuration, C.colorEasing, undefined, step, set);
    }
}
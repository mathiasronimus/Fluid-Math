import BezierCallback from "./BezierCallback";
import C from '../main/consts';
import EqContent from "../layout/EqContent";
import AnimationSet from "./AnimationSet";

export default class OpacityAnimation extends BezierCallback {

    constructor(startOpacity: number, endOpacity: number, content: EqContent, set: AnimationSet) {

        let step = function(completion) {
            content.setOpacity(startOpacity * (1 - completion) + endOpacity * completion);
        }

        super(C.opacityDuration, C.opacityEasing, undefined, step, set);
    }

}
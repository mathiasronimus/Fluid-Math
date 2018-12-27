import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import C from '../main/consts';

export default class RemoveAnimation extends BezierCallback {

    constructor(start: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let step = function(completion) {
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, " + (1 - completion) + ")";
            start.component.draw(start.changeScale(1 - completion), ctx);
            ctx.restore();
        }

        super(C.removeDuration, C.removeEasing, undefined, step, set);
    }
}
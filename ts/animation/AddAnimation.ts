import BezierCallback from "./BezierCallback";
import LayoutState from "./Frame";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';

/**
 * Animates a component in by scaling it from
 * 0 to its normal size.
 */
export default class AddAnimation extends BezierCallback {

    constructor(start: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let step = function(completion: number) {
            ctx.save();
            start.component.draw(start.changeScale(completion), ctx);
            ctx.restore();
        };

        super(C.addDuration, C.addEasing, undefined, step, set);
    }
}
import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import C from '../main/consts';

export default class MoveAnimation extends BezierCallback {

    constructor(start: LayoutState, end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let step = function(completion: number) {
            ctx.save();
            start.component.draw(LayoutState.interpolate(start, end, completion), ctx);
            ctx.restore();
        };

        super(C.moveDuration, C.moveEasing, undefined, step, set);
    }

}
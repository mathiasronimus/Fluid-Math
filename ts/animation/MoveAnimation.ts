import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import bezier from './BezierEasing';
import Frame from './Frame';
import C from '../main/consts';

export default class MoveAnimation extends BezierCallback {

    constructor(start: Frame, end: Frame, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let step = function(completion: number) {
            ctx.save();
            start.component.draw(Frame.interpolate(start, end, completion), ctx);
            ctx.restore();
        };

        super(C.moveDuration, C.moveEasing, undefined, step, set);
    }

}
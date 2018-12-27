import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import C from '../main/consts';

export default class RemoveAnimation extends BezierCallback {

    constructor(start: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let step = function(completion) {
            ctx.save();

            let invComp = 1 - completion;

            //Translate to right spot
            ctx.translate(start.tlx + start.width / 2, start.tly + start.height / 2);

            //Scale
            ctx.scale(invComp, invComp);

            start.component.draw(start.width, start.height, ctx);
            ctx.restore();
        }

        super(C.removeDuration, C.removeEasing, undefined, step, set);
    }
}
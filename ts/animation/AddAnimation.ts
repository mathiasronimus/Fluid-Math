import BezierCallback from "./BezierCallback";
import LayoutState from "./LayoutState";
import AnimationSet from "./AnimationSet";
import C from '../main/consts';
import EqContent from "../layout/EqContent";

/**
 * Animates a component in by scaling it from
 * 0 to its normal size.
 */
export default class AddAnimation extends BezierCallback {

    constructor(end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let content = end.component as EqContent;

        let step = function(completion: number) {
            ctx.save();
            //Translate to the right spot
            ctx.translate(end.tlx + end.width / 2, end.tly + end.height / 2);

            //Scale according to the animation
            ctx.scale(completion, completion);

            content.draw(end.width, end.height, ctx);
            ctx.restore();
        };

        super(C.addDuration, C.addEasing, undefined, step, set);
    }
}
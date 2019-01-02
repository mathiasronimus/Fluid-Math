import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import C from '../main/consts';
import EqContent from "../layout/EqContent";

export default class MoveAnimation extends BezierCallback {

    constructor(start: LayoutState, end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {

        let content = start.component as EqContent;

        let step = function(completion: number) {
            ctx.save();

            //Calculate the interpolations
            let invComp = 1 - completion;
            let x = start.tlx * invComp + end.tlx * completion;
            let y = start.tly * invComp + end.tly * completion;
            let width = start.width * invComp + end.width * completion;
            let height = start.height * invComp + end.height * completion;
            let scale = start.scale * invComp + end.scale * completion;

            //Translate to right spot
            ctx.translate(x + width / 2, y + height / 2);

            //Scale according to animation
            ctx.scale(scale, scale);

            content.draw(width, height, ctx);

            ctx.restore();
        };

        super(C.moveDuration, C.moveEasing, undefined, step, set);
    }

}
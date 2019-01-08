import BezierCallback from "./BezierCallback";
import LayoutState from "./LayoutState";
import EqContent from "../layout/EqContent";

/**
 * A bezier callback whose step function
 * calls the draw function of content.
 */
export default class Animation extends BezierCallback {

    private before: LayoutState;
    private after: LayoutState;
    private component: EqContent<any>;
    private ctx: CanvasRenderingContext2D;

    constructor(duration, easing, set, 
                before: LayoutState, after: LayoutState, 
                component: EqContent<any>, ctx: CanvasRenderingContext2D) {
        super(duration, easing, set);
        this.before = before;
        this.after = after;
        this.component = component;
        this.ctx = ctx;
    }

    protected step(completion: number) {
        this.ctx.save();
        this.component.draw(this.before, this.after, completion, this.ctx);
        this.ctx.restore();
    }
}
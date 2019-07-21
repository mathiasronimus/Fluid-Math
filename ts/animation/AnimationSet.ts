import BezierCallback from "./BezierCallback";
import LayoutState from "./LayoutState";
import EqContent from "../layout/EqContent";

/**
 * Plays a set of animations and provides
 * options for controlling them as a group.
 * Also erases the canvas before each frame.
 */
export default class AnimationSet {

    private numRunning: number;
    private animations: BezierCallback[];
    private done: () => void;
    private ctx: CanvasRenderingContext2D;
    private clearWidth: number;
    private clearHeight: number;
    private states: LayoutState[];
    private stopped = false;

    /**
     * Create a new Animation Set.
     * @param done Function to call when all animations are done.
     * @param ctx Context of the canvas to clear/draw to.
     * @param clearWidth The width of the canvas to clear.
     * @param clearHeight The height of the canvas to clear.
     * @param drawStates (optional) the states to draw after each frame.
     */
    constructor(done: () => void, ctx: CanvasRenderingContext2D, clearWidth: number, clearHeight: number, drawStates?: LayoutState[]) {
        this.animations = [];
        this.done = done;
        this.ctx = ctx;
        this.clearWidth = clearWidth;
        this.clearHeight = clearHeight;
        this.states = drawStates;
    }

    public addAnimation(anim: BezierCallback) {
        this.animations.push(anim);
    }

    /**
     * Starts running the animations.
     */
    public start() {
        this.numRunning = this.animations.length;
        let this_ = this;

        let doAll = function(timestamp: number) {
            this_.ctx.clearRect(0, 0, this_.clearWidth, this_.clearHeight);
            this_.animations.forEach(a => {
                a.run(timestamp);
            });
            // Draw all content states if necessary
            if (this_.states) {
                this_.states.forEach(state => {
                    if (state.component instanceof EqContent) {
                        this_.ctx.save();
                        state.component.draw(state, state, 1, this_.ctx);
                        this_.ctx.restore();
                    }
                });
            }
            if (this_.numRunning > 0 && !this_.stopped) {
                requestAnimationFrame(doAll);
            }
        }

        requestAnimationFrame(doAll);
    }

    /**
     * Called by a BezierCallback when it is done.
     */
    public finished() {
        this.numRunning--;
        if (this.numRunning === 0 && this.done) {
            this.done();
        }
    }

    /**
     * Stop all running animations and call the done event,
     * if it was provided.
     */
    public stop() {
        this.stopped = true;
        if (this.done) {
            this.done();
        }
    }

}
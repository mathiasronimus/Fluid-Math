import BezierCallback from "./BezierCallback";

/**
 * Plays a set of animations and provides
 * options for controlling them as a group.
 * Also erases the canvas before each frame.
 */
export default class AnimationSet {

    private numRunning;
    private animations: BezierCallback[];
    private done: () => void;
    private ctx: CanvasRenderingContext2D;
    private clearWidth: number;
    private clearHeight: number;

    constructor(done: () => void, ctx: CanvasRenderingContext2D, clearWidth: number, clearHeight: number) {
        this.animations = [];
        this.done = done;
        this.ctx = ctx;
        this.clearWidth = clearWidth;
        this.clearHeight = clearHeight;
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
            if (this_.numRunning > 0) {
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
        if (this.numRunning === 0) {
            this.done();
        }
    }

}
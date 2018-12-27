import BezierCallback from "./BezierCallback";

/**
 * Plays a set of animations and provides
 * options for controlling them as a group.
 */
export default class AnimationSet {

    private numRunning;
    private animations: BezierCallback[];
    private done: () => void;

    constructor(done: () => void) {
        this.animations = [];
        this.done = done;
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
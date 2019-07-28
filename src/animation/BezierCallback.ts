import AnimationSet from "./AnimationSet";

/**
 * Animates by repeatedly calling a step
 * function whose completion over time is
 * determined by a bezier curve.
 */
export default abstract class BezierCallback {

    duration: number; //In MS
    easing: Function; //The easing function, eg. bezier(0, 0, 1, 1)
    set: AnimationSet; //The animation set this belongs to

    private done = false;
    private startTime: number = -1;

    constructor(duration, easing, set) {
        this.duration = duration;
        this.easing = easing;
        this.set = set;
    }

    /**
     * Called for each frame to run an 
     * animation.
     * 
     * @param completion Completion of animation from 0-1.
     */
    protected abstract step(completion: number): void;

    run(timestamp: number): void {
        if (this.done) {
            // Continue drawing the final state
            this.step(1);
            return;
        }
        if (this.startTime === -1) {
            //Special Case: First Frame
            this.startTime = timestamp;
            this.step(0);
            return;
        }

        let elapsed = timestamp - this.startTime;

        if (elapsed >= this.duration) {
            //Done
            this.step(1);
            this.set.finished();
            this.done = true;
        } else {
            this.step(this.easing(elapsed / this.duration));
        }
    }
}
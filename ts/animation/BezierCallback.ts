import AnimationSet from "./AnimationSet";

/**
 * Animates by repeatedly calling a step
 * function whose completion over time is
 * determined by a bezier curve.
 */
export default class BezierCallback {

    duration: number; //In MS
    easing: Function; //The easing function, eg. bezier(0, 0, 1, 1)
    begin: () => void; //Called just before animation begins
    step: (completion: number) => void; //Called for each frame, completion is decimal from 0-1
    set: AnimationSet; //The animation set this belongs to

    private started = false;
    private done = false;
    private tOffset: number; //Starting time

    constructor(duration, easing, begin, step, set) {
        this.duration = duration;
        this.easing = easing;
        this.begin = begin;
        this.step = step;
        this.set = set;
    }

    run(timestamp: number): void {
        if (this.done) return;
        if (!this.started) {
            //Special Case: First Frame
            this.tOffset = timestamp;
            this.started = true;
            if (this.begin) this.begin();
            this.step(0);
            return;
        }

        let elapsed = timestamp - this.tOffset;

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
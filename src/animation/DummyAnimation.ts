import BezierCallback from "./BezierCallback";
import { moveEasing } from "../main/consts";
import AnimationSet from "./AnimationSet";

/**
 * An animation that doesn't do anything - useful for ensuring
 * an animation set runs for a particular minimum duration.
 */
export default class DummyAnimation extends BezierCallback {
    
    constructor(duration: number, set: AnimationSet) {
        super(duration, moveEasing, set);
    }
    
    // Do nothing
    protected step(completion: number): void {}
    
}
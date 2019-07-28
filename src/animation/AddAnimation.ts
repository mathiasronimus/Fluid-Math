import LayoutState from "./LayoutState";
import AnimationSet from "./AnimationSet";
import Animation from './Animation';
import C from '../main/consts';
import EqContent from "../layout/EqContent";

/**
 * Animates a component in by scaling it from
 * 0 to its normal size.
 */
export default class AddAnimation extends Animation {

    constructor(end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(duration, C.addEasing, set, end.withZeroScale(), end, end.component as EqContent<any>, ctx);
    }
}
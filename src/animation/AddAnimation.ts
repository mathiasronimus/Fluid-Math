import LayoutState from "./LayoutState";
import AnimationSet from "./AnimationSet";
import Animation from './Animation';
import EqContent from "../layout/EqContent";
import { addEasing } from "../main/consts";

/**
 * Animates a component in by scaling it from
 * 0 to its normal size.
 */
export default class AddAnimation extends Animation {

    constructor(end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(duration, addEasing, set, end.withZeroScale(), end, end.component as EqContent<any>, ctx);
    }
}
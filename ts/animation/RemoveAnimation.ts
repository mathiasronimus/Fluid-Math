import BezierCallback from "./BezierCallback";
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import C from '../main/consts';
import EqContent from "../layout/EqContent";
import Animation from './Animation';

export default class RemoveAnimation extends Animation {

    constructor(start: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D) {
        super(C.removeDuration, C.removeEasing, set, start, start.withZeroScale(), start.component as EqContent<any>, ctx);
    }
}
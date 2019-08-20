import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import EqContent from "../layout/EqContent";
import Animation from './Animation';
import { removeEasing } from "../main/consts";

export default class RemoveAnimation extends Animation {

    constructor(start: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(duration, removeEasing, set, start, start.withZeroScale(), start.component as EqContent<any>, ctx);
    }
}
import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import Animation from './Animation';
import EqContent from "../layout/EqContent";
import { moveEasing } from "../main/consts";

export default class MoveAnimation extends Animation {

    constructor(start: LayoutState, end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(duration, moveEasing, set, start, end, end.component as EqContent<any>, ctx);
    }

}
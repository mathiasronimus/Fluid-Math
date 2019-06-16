import AnimationSet from "./AnimationSet";
import LayoutState from './LayoutState';
import Animation from './Animation';
import C from '../main/consts';
import EqContent from "../layout/EqContent";

export default class MoveAnimation extends Animation {

    constructor(start: LayoutState, end: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(duration, C.moveEasing, set, start, end, end.component as EqContent<any>, ctx);
    }

}
import Animation from './Animation';
import LayoutState from './LayoutState';
import AnimationSet from './AnimationSet';
import EqContent from '../layout/EqContent';
import { moveEasing } from '../main/consts';

export default class EvalAnimation extends Animation {

    constructor(evalFrom: LayoutState, evalTo: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {
        super(  duration, moveEasing, set, 
                evalFrom, evalTo.withZeroScale(), 
                evalFrom.component as EqContent<any>, ctx);
    }
}
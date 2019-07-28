import Animation from './Animation';
import C from '../main/consts';
import LayoutState from './LayoutState';
import AnimationSet from './AnimationSet';
import EqContent from '../layout/EqContent';

export default class ReverseEvalAnimation extends Animation {

    constructor(from: LayoutState, to: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {

        super(  duration, C.moveEasing, set, 
                from.withZeroScale(), to, 
                to.component as EqContent<any>, ctx);
    }
}
import Animation from './Animation';
import C from '../main/consts';
import LayoutState from './LayoutState';
import AnimationSet from './AnimationSet';
import EqContent from '../layout/EqContent';

export default class EvalAnimation extends Animation {

    constructor(evalFrom: LayoutState, evalTo: LayoutState, set: AnimationSet, ctx) {
        super(  C.moveDuration, C.moveEasing, set, 
                evalFrom, evalTo.withZeroScale(), 
                evalFrom.component as EqContent<any>, ctx);
    }
}
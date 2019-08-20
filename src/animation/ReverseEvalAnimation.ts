import Animation from './Animation';
import LayoutState from './LayoutState';
import AnimationSet from './AnimationSet';
import EqContent from '../layout/EqContent';
import { moveEasing } from '../main/consts';

export default class ReverseEvalAnimation extends Animation {

    constructor(from: LayoutState, to: LayoutState, set: AnimationSet, ctx: CanvasRenderingContext2D, duration: number) {

        super(  duration, moveEasing, set, 
                from.withZeroScale(), to, 
                to.component as EqContent<any>, ctx);
    }
}
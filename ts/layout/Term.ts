import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import EqContent from './EqContent';
import TermLayoutState from '../animation/TermLayoutState';

export default class Term extends EqContent<TermLayoutState> {

    private text: string;
    private halfInnerWidth: number;
    private halfInnerHeight: number;
    private ascent: number;

    constructor(text: string, width: number, height: number, ascent: number) {
        //At the time of term initialization, layout is unknown.
        super(C.termPadding);
        this.halfInnerWidth = width / 2;
        this.halfInnerHeight = height / 2;
        this.width = width + this.padding.width();
        this.height = height + this.padding.height();
        this.ascent = ascent;
        this.text = text;
    }
    
    protected calcHeight(): number {
        return this.height;
    }
    
    protected calcWidth(): number {
        return this.width;
    }
    
    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): TermLayoutState {
        let state = 
            new TermLayoutState(parentLayout, this, tlx, tly, this.width * currScale, this.height * currScale, currScale);
        layouts.push(state);
        return state;
    }
    
    draw(before: TermLayoutState, after: TermLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);
        ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
    }
}
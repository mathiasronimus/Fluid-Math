import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import EqContent from './EqContent';
import TermLayoutState from '../animation/TermLayoutState';

const padding: Padding = Padding.even(C.termPadding);

export default class Term extends EqContent<TermLayoutState> {

    private text: string;
    private ascent: number;

    constructor(text: string, width: number, height: number, ascent: number) {
        //At the time of term initialization, layout is unknown.
        super(padding);
        this.fixedWidth = width + this.padding.width();
        this.fixedHeight = height + this.padding.height();
        this.ascent = ascent;
        this.text = text;
    }
    
    protected calcHeight(): number {
        return this.fixedHeight;
    }
    
    protected calcWidth(): number {
        return this.fixedWidth;
    }
    
    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): TermLayoutState {
        let state = 
            new TermLayoutState(parentLayout, this, tlx, tly, this.fixedWidth, this.fixedHeight, currScale);
        layouts.push(state);
        return state;
    }
    
    draw(before: TermLayoutState, after: TermLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        super.draw(before, after, progress, ctx);
        ctx.fillText(this.text, -before.width / 2 + this.padding.left, -before.height / 2 + this.padding.top + this.ascent);
    }
}
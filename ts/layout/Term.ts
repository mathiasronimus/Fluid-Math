import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import C from '../main/consts';
import EqContent from './EqContent';

const padding: Padding = Padding.even(C.termPadding);

export default class Term extends EqContent {

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
    
    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = 
            new LayoutState(parentLayout, this, tlx, tly, this.fixedWidth, this.fixedHeight, currScale);
        layouts.push(state);
        return state;
    }
    
    draw(width: number, height: number, ctx: CanvasRenderingContext2D) {
        this.setCtxStyle(ctx);
        ctx.fillText(this.text, -width / 2 + this.padding.left, -height / 2 + this.padding.top + this.ascent);
    }

    shouldAnimate() {
        return true;
    }

    interpolate(otherComp: EqComponent, amount: number): EqComponent {
        return this;
    }

}
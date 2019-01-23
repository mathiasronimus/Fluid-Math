import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import EqContent from './EqContent';
import TermLayoutState from '../animation/TermLayoutState';
import { Map } from '../main/helpers';
import EqComponent from './EqComponent';

export default class Term extends EqContent<TermLayoutState> {

    private text: string;
    private widths: number[];
    private heights: number[];
    private halfInnerWidths: number[];
    private halfInnerHeights: number[];
    private ascents: number[];

    private halfInnerWidth: number;
    private halfInnerHeight: number;
    private ascent: number;

    constructor(text: string, widths: number[], heights: number[], ascents: number[]) {
        //At the time of term initialization, layout is unknown.
        super(C.termPadding);
        this.widths = widths;
        this.heights = heights;
        this.halfInnerWidths = this.widths.map(width => width / 2);
        this.halfInnerHeights = this.heights.map(height => height / 2);
        this.ascents = ascents; 
        this.recalcDimensions();
        window.addEventListener('resize', this.recalcDimensions.bind(this));
        this.text = text;
    }

    private recalcDimensions() {
        this.height = this.calcHeight();
        this.width = this.calcWidth();
        let tier: number = window['currentWidthTier'];
        this.halfInnerWidth = this.halfInnerWidths[tier];
        this.halfInnerHeight = this.halfInnerHeights[tier];
        this.ascent = this.ascents[tier];
    }
    
    protected calcHeight(): number {
        let tier: number = window['currentWidthTier'];
        return this.heights[tier] + this.padding.height();
    }
    
    protected calcWidth(): number {
        let tier: number = window['currentWidthTier'];
        return this.widths[tier] + this.padding.width();
    }
    
    addLayout(parentLayout: LayoutState, layouts: Map<EqComponent, LayoutState>, tlx: number, tly: number, currScale: number): TermLayoutState {
        let state = 
            new TermLayoutState(parentLayout, this, tlx, tly, this.width * currScale, this.height * currScale, currScale);
        layouts.set(this, state);
        return state;
    }
    
    draw(before: TermLayoutState, after: TermLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);
        ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
    }
}
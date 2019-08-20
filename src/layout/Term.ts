import LayoutState from '../animation/LayoutState';
import { widthTiers, termPadding } from '../main/consts';
import EqContent from './EqContent';
import TermLayoutState from '../animation/TermLayoutState';
import { Map } from '../main/helpers';
import EqComponent from './EqComponent';
import { Content } from '../main/ComponentModel';

@Content({
    character: 't',
    initialize: (file, info) => {
        const terms: Term[] = [];
        let ascents = [];

        if (file.terms.length > 0) {
            //Get the ascents from each tier
            for (let w = 0; w < widthTiers.length; w++) {
                ascents.push(file.metrics[w].ascent);
            }
        }

        //Initialize all terms
        for (let t = 0; t < file.terms.length; t++) {
            let widths = [];

            //Get the widths for each tier
            for (let w = 0; w < widthTiers.length; w++) {
                widths.push(file.metrics[w].widths[t]);
            }

            let text = file.terms[t];
            let term = new Term(text, widths, info['termHeights'], ascents, 't' + t);
            terms.push(term);
        }
        return terms;
    },
    calcInfo: (file, info) => {
        const termHeights: number[] = [];
        if (file.terms.length > 0) {
            //Get the term heights from each tier
            for (let w = 0; w < widthTiers.length; w++) {
                termHeights.push(file.metrics[w].height);
            }
        }
        info['termHeights'] = termHeights;
    }
})
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

    constructor(text: string, widths: number[], heights: number[], ascents: number[], ref: string) {
        super(termPadding, ref);
        this.widths = widths;
        this.heights = heights;
        this.halfInnerWidths = this.widths.map(width => width / 2);
        this.halfInnerHeights = this.heights.map(height => height / 2);
        this.ascents = ascents; 
        this.recalcDimensions();
        this.text = text;
    }

    recalcDimensions() {
        super.recalcDimensions();
        let tier: number = window['currentWidthTier'];
        this.halfInnerWidth = this.halfInnerWidths[tier];
        this.halfInnerHeight = this.halfInnerHeights[tier];
        this.ascent = this.ascents[tier];
    }

    getMainTextLine(): [number, number] {
        return [this.padding.top, this.height - this.padding.bottom];
    }
    
    protected calcHeight(): number {
        let tier: number = window['currentWidthTier'];
        return this.heights[tier] + this.padding.height();
    }
    
    protected calcWidth(): number {
        let tier: number = window['currentWidthTier'];
        return this.widths[tier] + this.padding.width();
    }
    
    addLayout(parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
              tlx: number, tly: number, currScale: number,
              opacityObj: Object, colorsObj: Object): TermLayoutState {
        let state = new TermLayoutState(
                parentLayout, this, 
                tlx, tly, this.width * currScale, this.height * currScale, currScale,
                this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj)
        );
        layouts.set(this, state);
        return state;
    }
    
    draw(before: TermLayoutState, after: TermLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);
        ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
    }
}
import EqContent from "./EqContent";
import ContentLayoutState from '../animation/ContentLayoutState';
import { line } from '../main/helpers';
import Padding from "./Padding";
import { Map } from '../main/helpers';
import EqComponent from "./EqComponent";

export default class HDivider extends EqContent<ContentLayoutState> {

    constructor(padding: Padding, ref: string) {
        super(padding, ref);
        this.height = 1 + this.padding.height();
        //For layout purposes, the divider
        //has no width. It stretches to fill
        //its container.
        this.width = 0;
    }

    protected calcWidth(): number {return 0;}
    protected calcHeight(): number {return 0;}

    addLayout(  parentLayout: ContentLayoutState, layouts: Map<EqComponent, ContentLayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): ContentLayoutState {
        //Set x to align left with parent
        let x = parentLayout.tlx;
        let width = parentLayout.width;
        let height = this.getHeight();
        let state = new ContentLayoutState(
                parentLayout, this, 
                x, tly, width, height, currScale,
                this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj)
        );
        layouts.set(this, state);
        return state;
    }

    draw(before: ContentLayoutState, after: ContentLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        let width = this.setupCtx(before, after, progress, ctx)[0];
        line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
    }
}
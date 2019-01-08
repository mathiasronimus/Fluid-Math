import EqContent from "./EqContent";
import LayoutState from '../animation/LayoutState';
import { line } from '../main/helpers';
import Padding from "./Padding";

export default class HDivider extends EqContent<LayoutState> {

    constructor(padding: Padding) {
        super(padding);
        this.fixedHeight = 1 + this.padding.height();
        //For layout purposes, the divider
        //has no width. It stretches to fill
        //its container.
        this.fixedWidth = 0;
    }

    //These won't be called due to fixed dimensions
    protected calcWidth(): number {return 0;}
    protected calcHeight(): number {return 0;}

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        //Set x to align left with parent
        let x = parentLayout.tlx;
        let width = parentLayout.width;
        let height = this.getHeight();
        let state = new LayoutState(parentLayout, this, x, tly, width, height, currScale);
        layouts.push(state);
        return state;
    }

    draw(before: LayoutState, after: LayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        super.draw(before, after, progress, ctx);
        let width = before.width * (1 - progress) + after.width * progress;
        line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
    }
}
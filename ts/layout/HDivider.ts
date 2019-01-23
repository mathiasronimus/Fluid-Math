import EqContent from "./EqContent";
import LayoutState from '../animation/LayoutState';
import { line } from '../main/helpers';
import Padding from "./Padding";
import { Map } from '../main/helpers';
import EqComponent from "./EqComponent";

export default class HDivider extends EqContent<LayoutState> {

    constructor(padding: Padding) {
        super(padding);
        this.height = 1 + this.padding.height();
        //For layout purposes, the divider
        //has no width. It stretches to fill
        //its container.
        this.width = 0;
    }

    protected calcWidth(): number {return 0;}
    protected calcHeight(): number {return 0;}

    addLayout(parentLayout: LayoutState, layouts: Map<EqComponent, LayoutState>, tlx: number, tly: number, currScale: number): LayoutState {
        //Set x to align left with parent
        let x = parentLayout.tlx;
        let width = parentLayout.width;
        let height = this.getHeight();
        let state = new LayoutState(parentLayout, this, x, tly, width, height, currScale);
        layouts.set(this, state);
        return state;
    }

    draw(before: LayoutState, after: LayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        let width = this.setupCtx(before, after, progress, ctx)[0];
        line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
    }
}
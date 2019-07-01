import EqContent from "./EqContent";
import { line } from '../main/helpers';
import Padding from "./Padding";
import { Map } from '../main/helpers';
import EqComponent from "./EqComponent";
import { OriginalDimenLayoutState } from "../animation/OriginalDimenLayoutState";
import LayoutState from "../animation/LayoutState";

export default class HDivider extends EqContent<OriginalDimenLayoutState> {

    constructor(padding: Padding, ref: string) {
        super(padding, ref);
        this.height = 1 + this.padding.height();
        //For layout purposes, the divider
        //has no width. It stretches to fill
        //its container.
        this.width = 0;
    }

    setPadding(newPadding: Padding) {
        this.padding = newPadding;
    }

    protected calcWidth(): number {return 0;}
    protected calcHeight(): number {return 0;}

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): OriginalDimenLayoutState {
        //Set x to align left with parent
        let x = parentLayout.tlx;
        let width = parentLayout.width;
        let height = this.getHeight();
        let state = new OriginalDimenLayoutState(
            parentLayout, this, 
            x, tly, width, height, currScale,
            this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj),
            width / currScale, height
        );
        layouts.set(this, state);
        return state;
    }

    draw(before: OriginalDimenLayoutState, after: OriginalDimenLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);
        const width = before.origInnerWidth * (1 - progress) + after.origInnerWidth * progress;
        line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
    }
}
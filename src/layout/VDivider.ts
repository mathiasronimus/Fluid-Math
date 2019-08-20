import EqContent from "./EqContent";
import { line } from '../main/helpers';
import Padding from "./Padding";
import { Map } from '../main/helpers';
import EqComponent from "./EqComponent";
import { OriginalDimenLayoutState } from "../animation/OriginalDimenLayoutState";
import LayoutState from "../animation/LayoutState";
import { Content } from "../main/ComponentModel";
import { vDividerPadding } from '../main/consts';

@Content({
    character: 'v',
    initialize: file => {
        const vDividers: VDivider[] = [];
        for (let i = 0; i < file.vDividers; i++) {
            vDividers.push(new VDivider(vDividerPadding, 'v' + i));
        }
        return vDividers;
    }
})
export default class VDivider extends EqContent<OriginalDimenLayoutState> {

    constructor(padding: Padding, ref: string) {
        super(padding, ref);
        this.width = this.calcWidth();
        //For layout purposes, the divider
        //has no height. It stretches to fill
        //its container.
        this.height = this.calcHeight();
    }

    setPadding(newPadding: Padding) {
        this.padding = newPadding;
    }

    protected calcWidth(): number {return 1 + this.padding.width()}
    protected calcHeight(): number {return 0;}

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): OriginalDimenLayoutState {
        //Set y to align top with parent
        let y = parentLayout.tly;
        let height = parentLayout.height;
        let width = this.getWidth();
        let state = new OriginalDimenLayoutState(
            parentLayout, this, 
            tlx, y, width, height, currScale,
            this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj),
            width, height / currScale
        );
        layouts.set(this, state);
        return state;
    }

    draw(before: OriginalDimenLayoutState, after: OriginalDimenLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);
        const height = before.origInnerHeight * (1 - progress) + after.origInnerHeight * progress;
        line(0, -height / 2 + this.padding.top, 0, height / 2 - this.padding.bottom, ctx);
    }
}
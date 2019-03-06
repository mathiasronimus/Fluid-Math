import EqContent from "./EqContent";
import ContentLayoutState from "../animation/ContentLayoutState";
import Padding from './Padding';
import { Map, line } from '../main/helpers';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import RootContainerLayoutState from "../animation/RootContainerLayoutState";
import { OriginalDimenLayoutState } from "../animation/OriginalDimenLayoutState";

export default class Radical extends EqContent<OriginalDimenLayoutState> {

    constructor(ref: string) {
        super(Padding.even(0), ref);
    }

    // Radical mimics dimensions of the root container, so for layout
    // purposes doesn't have dimensions to enforce.
    protected calcWidth(): number { return 0; }
    protected calcHeight(): number { return 0; }

    /**
     * Draws the content on the canvas.
     * 
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    draw(before: OriginalDimenLayoutState, after: OriginalDimenLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        const contBefore = before.layoutParent as RootContainerLayoutState;
        const contAfter = after.layoutParent as RootContainerLayoutState;
        const invProg = 1 - progress;
        const kinkTipX =    contBefore.kinkTipX * invProg       + contAfter.kinkTipX * progress;
        const kinkTipY =    contBefore.kinkTipY * invProg       + contAfter.kinkTipY * progress;
        const kinkTopX =    contBefore.kinkTopX * invProg       + contAfter.kinkTopX * progress;
        const kinkTopY =    contBefore.kinkTopY * invProg       + contAfter.kinkTopY * progress;
        const tickBotX =    contBefore.tickBotX * invProg       + contAfter.tickBotX * progress;
        const tickBotY =    contBefore.tickBotY * invProg       + contAfter.tickBotY * progress;
        const tickTopX =    contBefore.tickTopX * invProg       + contAfter.tickTopX * progress;
        const tickTopY =    contBefore.tickTopY * invProg       + contAfter.tickTopY * progress;
        const endX =        contBefore.endX * invProg           + contAfter.endX * progress;
        const endY =        contBefore.endY * invProg           + contAfter.endY * progress;
        const width =       before.origInnerWidth * invProg     + after.origInnerWidth * progress;
        const height =      before.origInnerHeight * invProg    + after.origInnerHeight * progress;
        this.setupCtx(before, after, progress, ctx);

        const startX = -width / 2;
        const startY = -height / 2;

        // Kink tip
        line(startX + kinkTipX, startY + kinkTipY, startX + kinkTopX, startY + kinkTopY, ctx);
        // Rest of kink
        line(startX + kinkTopX, startY + kinkTopY, startX + tickBotX, startY + tickBotY, ctx);
        // Tick
        line(startX + tickBotX, startY + tickBotY, startX + tickTopX, startY + tickTopY, ctx);
        // Top
        line(startX + tickTopX, startY + tickTopY, startX + endX, startY + endY, ctx);
    }

    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     * 
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    addLayout(  parentLayout: RootContainerLayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): OriginalDimenLayoutState {
        const parentPad = parentLayout.component.getPadding().scale(currScale);
        const padWidth = parentPad.width();
        const padHeight = parentPad.height();
        const thisLayout = new OriginalDimenLayoutState(
            parentLayout, this, tlx + padWidth / 2, tly + padHeight / 2,
            parentLayout.width - padWidth, parentLayout.height - padHeight,
            currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj),
            (parentLayout.width - padWidth) / currScale, (parentLayout.height - padHeight) / currScale
        );
        layouts.set(this, thisLayout);
        return thisLayout;
    }
}
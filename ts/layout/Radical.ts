import EqContent from "./EqContent";
import ContentLayoutState from "../animation/ContentLayoutState";
import Padding from './Padding';
import { Map, line } from '../main/helpers';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import RootContainerLayoutState from "../animation/RootContainerLayoutState";

export default class Radical extends EqContent<ContentLayoutState> {

    constructor(ref: string) {
        super(Padding.even(0), ref);
    }

    // Radical mimics dimensions of the root container, so for layout
    // purposes doesn't have dimensions to enforce.
    protected calcWidth(): number { return 0; }
    protected calcHeight(): number { return 0; }

    /**
     * Sets up the Canvas by performing
     * transformations and style changes.
     * Subclasses should call the method as
     * defined here, then draw themselves
     * centered on (0, 0). Returns width
     * and height to allow them 
     * to do this.
     * There is no need to call save() or
     * restore(), animations handle this.
     * 
     * Override to not scale.
     * 
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    protected setupCtx(before: ContentLayoutState, after: ContentLayoutState, progress: number, ctx: CanvasRenderingContext2D): [number, number] {
        let invProg = 1 - progress;
        let x = before.tlx * invProg + after.tlx * progress;
        let y = before.tly * invProg + after.tly * progress;
        let width = before.width * invProg + after.width * progress;
        let height = before.height * invProg + after.height * progress;
        ctx.translate(x + width / 2, y + height / 2);
        this.setupCtxStyle(before, after, progress, ctx);
        return [width, height];
    }

    /**
     * Draws the content on the canvas.
     * 
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    draw(before: ContentLayoutState, after: ContentLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        const contBefore = before.layoutParent as RootContainerLayoutState;
        const contAfter = after.layoutParent as RootContainerLayoutState;
        const invProg = 1 - progress;
        const kinkTipX = contBefore.kinkTipX * invProg + contAfter.kinkTipX * progress;
        const kinkTipY = contBefore.kinkTipY * invProg + contAfter.kinkTipY * progress;
        const kinkTopX = contBefore.kinkTopX * invProg + contAfter.kinkTopX * progress;
        const kinkTopY = contBefore.kinkTopY * invProg + contAfter.kinkTopY * progress;
        const tickBotX = contBefore.tickBotX * invProg + contAfter.tickBotX * progress;
        const tickBotY = contBefore.tickBotY * invProg + contAfter.tickBotY * progress;
        const tickTopX = contBefore.tickTopX * invProg + contAfter.tickTopX * progress;
        const tickTopY = contBefore.tickTopY * invProg + contAfter.tickTopY * progress;
        const endX = contBefore.endX * invProg + contAfter.endX * progress;
        const endY = contBefore.endY * invProg + contAfter.endY * progress;
        const [width, height] = this.setupCtx(before, after, progress, ctx);

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
                opacityObj: Object, colorsObj: Object): ContentLayoutState {
        const parentPad = parentLayout.component.getPadding();
        const realPad = new Padding(
            parentPad.top * currScale,
            parentPad.left * currScale,
            parentPad.bottom * currScale,
            parentPad.right * currScale
        );
        const padWidth = realPad.width();
        const padHeight = realPad.height();
        const thisLayout = new ContentLayoutState(
            parentLayout, this, tlx + padWidth / 2, tly + padHeight / 2,
            parentLayout.width - padWidth, parentLayout.height - padHeight,
            currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj)
        );
        layouts.set(this, thisLayout);
        return thisLayout;
    }
}
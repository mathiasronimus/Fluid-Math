import EqContent from "./EqContent";
import ContentLayoutState from "../animation/ContentLayoutState";
import LayoutState from "../animation/LayoutState";
import EqComponent from "./EqComponent";
import { Map } from '../main/helpers';
import C from '../main/consts';
import Padding from "./Padding";

/**
 * Temporary content that draws a curved outline.
 */
export default class CurvedOutline extends EqContent<ContentLayoutState> {

    private layout: ContentLayoutState;

    /**
     * Initialize a curved outline with the same dimensions
     * as a layout state.
     * @param mimic The layout state to mimic.
     * @param addTo The collection to add this outline to.
     */
    constructor(padding: Padding, mimic: LayoutState, addTo: Map<EqComponent<any>, LayoutState>) {
        super(padding, undefined);
        const padWidth = padding.width();
        const padHeight = padding.height();
        this.layout = new ContentLayoutState(undefined, this,
            mimic.tlx - padWidth / 2, mimic.tly - padHeight / 2, mimic.width + padWidth, mimic.height + padHeight, mimic.scale,
            C.curvedOutlineColor, C.curvedOutlineDefaultOpacity);
        addTo.set(this, this.layout);
        this.width = this.layout.width;
        this.height = this.layout.height;
    }

    getLayout(): ContentLayoutState {
        return this.layout;
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
        this.setupCtx(before, after, progress, ctx);
        // Draw rectangle with rounded corners
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const r = C.curvedOutlineBorderRadius;
        ctx.beginPath();
        // Top line
        ctx.moveTo(-halfWidth + r, -halfHeight);
        ctx.lineTo(halfWidth - r, -halfHeight);
        // Top right corner
        ctx.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + r);
        // Right line
        ctx.lineTo(halfWidth, halfHeight - r);
        // Bottom right corner
        ctx.quadraticCurveTo(halfWidth, halfHeight, halfWidth - r, halfHeight);
        // Bottom line
        ctx.lineTo(-halfWidth + r, halfHeight);
        // Bottom left corner
        ctx.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - r);
        // Left line
        ctx.lineTo(-halfWidth, -halfHeight + r);
        // Top left corner
        ctx.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + r, -halfHeight);

        // Finish up
        ctx.closePath();
        ctx.stroke();
    }

    protected calcWidth(): number { return this.width }
    protected calcHeight(): number { return this.height }

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
    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): ContentLayoutState {
        return undefined;
    }

}
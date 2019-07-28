import ContentLayoutState from "../animation/ContentLayoutState";
import EqContent from "./EqContent";
import Padding from "./Padding";
import EqComponent from "./EqComponent";
import LayoutState from "../animation/LayoutState";
import C from '../main/consts';
import { Map } from '../main/helpers';
import RadioButtonLayoutState from "../animation/RadioButtonLayoutState";

export default class RadioButton extends EqContent<RadioButtonLayoutState> {

    private layout: RadioButtonLayoutState;

    /**
     * Create a new Radio Button at the specified coordinates.
     * @param padding The padding to use. The drawn circle goes to the edge of the padding.
     * @param tlx The x-ordinate of the top left of the button, including padding.
     * @param tly The y-ordinate of the top left of the button, including padding.
     * @param dimen The width and height of the button.
     * @param addTo The collection to add the layout state of this radio button to.
     * @param opacity The opacity to render as.
     */
    constructor(padding: Padding, tlx: number, tly: number, dimen: number, addTo: Map<EqComponent<any>, LayoutState>,
                opacity: number, color: [number, number, number]) {
        super(padding, undefined);

        this.layout = new RadioButtonLayoutState(
            this, tlx, tly, dimen, dimen, 1, color, opacity, 0
        );
        this.width = dimen;
        this.height = dimen;

        addTo.set(this, this.layout);
    }

    getLayout(): RadioButtonLayoutState {
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
    draw(before: RadioButtonLayoutState, after: RadioButtonLayoutState, progress: number, ctx: CanvasRenderingContext2D) {
        this.setupCtx(before, after, progress, ctx);

        // Draw the outer circle
        ctx.beginPath();
        const rad = (this.width - this.padding.width()) / 2;
        ctx.arc(0, 0, rad, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        // Draw the filled inner circle
        ctx.beginPath();
        const percentFill = before.percentFill * (1 - progress) + after.percentFill * progress;
        const innerRad = rad * percentFill;
        ctx.arc(0, 0, innerRad, 0, 2 * Math.PI);
        ctx.fill();
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
                opacityObj: Object, colorsObj: Object): RadioButtonLayoutState {
        return undefined;
    }

}
import LayoutState from "./LayoutState";
import EqComponent from "../layout/EqComponent";

export default class RootContainerLayoutState extends LayoutState {
    
    // Points relative to the top left of the container where corners
    // or tips of the radical reside.
    kinkTipX: number;
    kinkTipY: number;

    kinkTopX: number;
    kinkTopY: number;

    tickBotX: number;
    tickBotY: number;

    tickTopX: number;
    tickTopY: number;

    endX: number;
    endY: number;

    constructor(layoutParent: LayoutState, component: EqComponent<any>,
                tlx: number, tly: number, width: number, height: number, scale: number,
                kinkTipX: number, kinkTipY: number,
                kinkTopX: number, kinkTopY: number,
                tickBotX: number, tickBotY: number,
                tickTopX: number, tickTopY: number,
                endX: number, endY: number) {
        super(layoutParent, component, tlx, tly, width, height, scale);
        this.kinkTipX = kinkTipX;
        this.kinkTipY = kinkTipY;
        this.kinkTopX = kinkTopX;
        this.kinkTopY = kinkTopY;
        this.tickBotX = tickBotX;
        this.tickBotY = tickBotY;
        this.tickTopX = tickTopX;
        this.tickTopY = tickTopY;
        this.endX = endX;
        this.endY = endY;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): RootContainerLayoutState {
        return new RootContainerLayoutState(
            this.layoutParent, this.component,
            this.tlx, this.tly, this.width, this.height, 0,
            this.kinkTipX, this.kinkTipY, this.kinkTopX, this.kinkTopY,
            this.tickBotX, this.tickBotY, this.tickTopX, this.tickTopY,
            this.endX, this.endY);
    }
}
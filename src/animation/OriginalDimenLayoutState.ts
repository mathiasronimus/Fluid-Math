import ContentLayoutState from "./ContentLayoutState";
import LayoutState from "./LayoutState";
import EqComponent from "../layout/EqComponent";

/**
 * A layout state that also stores the original (non-scaled)
 * inner dimensions.
 */
export class OriginalDimenLayoutState extends ContentLayoutState {

    origInnerWidth: number;
    origInnerHeight: number;

    constructor(layoutParent: LayoutState, component: EqComponent<any>, 
                tlx: number, tly: number, width: number, height: number, 
                scale: number, color: number[], opacity: number,
                origInnerWidth: number, origInnerHeight: number) {
        super(layoutParent, component, tlx, tly, width, height, scale, color, opacity);
        this.origInnerWidth = origInnerWidth;
        this.origInnerHeight = origInnerHeight;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): OriginalDimenLayoutState {
        return new OriginalDimenLayoutState(
            this.layoutParent, 
            this.component,
            this.tlx,
            this.tly,
            this.width, 
            this.height,
            0,
            this.color,
            0,
            this.origInnerWidth,
            this.origInnerHeight
        );
    }
}
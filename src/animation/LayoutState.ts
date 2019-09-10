import EqComponent from "../layout/EqComponent";

/**
 * Stores how a component should be
 * drawn at a particular step.
 */
export default class LayoutState {
    tlx: number;
    tly: number;
    width: number;
    height: number;
    // The scaling of the component (width and height reflect this scaling,
    // but needs to be taken into account for drawing.)
    scale: number;
    component: EqComponent<LayoutState>;
    layoutParent: LayoutState;

    constructor(layoutParent, component, tlx, tly, width, height, scale) {
        this.tlx = tlx;
        this.tly = tly;
        this.width = width;
        this.height = height;
        this.component = component;
        this.layoutParent = layoutParent;
        this.scale = scale;
    }

    /**
     * Checks if this layout contains the 
     * specified point.
     * 
     * @param x X-ordinate of the point.
     * @param y Y-ordinate of the point.
     */
    contains(x: number, y: number): boolean {
        return  x >= this.tlx &&
                x <= this.tlx + this.width &&
                y >= this.tly &&
                y <= this.tly + this.height;
    }

    /**
     * Checks if the x-ordinate is on
     * the left half of this layout.
     * 
     * @param x The x-ordinate
     */
    onLeft(x: number): boolean {
        return x <= this.tlx + this.width / 2;
    }

    /**
     * Checks if the y-ordinate is on
     * the top half of this layout.
     * 
     * @param y The y-ordinate
     */
    onTop(y: number): boolean {
        return y <= this.tly + this.height / 2;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): LayoutState {
        return new LayoutState( this.layoutParent, 
                                this.component,
                                this.tlx,
                                this.tly,
                                this.width, 
                                this.height,
                                0);
    }

    /**
     * Given two layout states, return the smallest layout
     * state that totally encompasses both of them. The scale,
     * component, and parent of the returned layout are undefined.
     * @param l1 The first layout state.
     * @param l2 The second layout state.
     */
    static encompassing(l1: LayoutState, l2: LayoutState): LayoutState {
        const minLeft = Math.min(l1.tlx, l2.tlx);
        const maxRight = Math.max(l1.tlx + l1.width, l2.tlx + l2.width);
        const minTop = Math.min(l1.tly, l2.tly);
        const maxBot = Math.max(l1.tly + l1.height, l2.tly + l2.height);
        const width = maxRight - minLeft;
        const height = maxBot - minTop;
        return new LayoutState(
            undefined, undefined,
            minLeft, minTop, width, height, undefined
        )
    }
}
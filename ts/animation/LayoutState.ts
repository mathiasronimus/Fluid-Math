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
    //The scaling of the component (width and height reflect this scaling,
    //but needs to be taken into account for drawing.)
    scale: number;
    component: EqComponent;
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
}
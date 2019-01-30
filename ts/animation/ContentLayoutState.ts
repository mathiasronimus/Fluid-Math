import LayoutState from "./LayoutState";

/**
 * Layout state containing info relevant to
 * content, ie color and opacity.
 */
export default class ContentLayoutState extends LayoutState {

    color: number[];
    opacity: number;

    constructor(layoutParent, component, tlx, tly, width, height, scale, color, opacity) {
        super(layoutParent, component, tlx, tly, width, height, scale);
        this.color = color;
        this.opacity = opacity;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): ContentLayoutState {
        return new ContentLayoutState( this.layoutParent, 
                                this.component,
                                this.tlx,
                                this.tly,
                                this.width, 
                                this.height,
                                0,
                                this.color,
                                0);
    }
}
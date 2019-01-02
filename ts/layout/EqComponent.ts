import LayoutState from '../animation/LayoutState';
import Padding from './Padding';

/**
 * Represents any component (container, content)
 * that takes up space and forms a part of the
 * layout of a step.
 */
export default abstract class EqComponent {

    protected fixedWidth: number = -1;
    protected fixedHeight: number = -1;
    padding: Padding;

    constructor(padding) {
        this.padding = padding;
    }

    setFixedWidth(newWidth: number) {
        this.fixedWidth = newWidth;
    }

    setFixedHeight(newHeight: number) {
        this.fixedHeight = newHeight;
    }

    getWidth(): number {
        if (this.fixedWidth < 0) {
            return this.calcWidth();
        } else {
            return this.fixedWidth;
        }
    }

    getHeight(): number {
        if (this.fixedHeight < 0) {
            return this.calcHeight();
        } else {
            return this.fixedHeight;
        }
    }

    protected abstract calcWidth(): number;
    protected abstract calcHeight(): number;

    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     * 
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The array of drawables to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     */
    abstract addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState;
}
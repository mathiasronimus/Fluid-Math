import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import { Map } from '../main/helpers';
import { MouseEventCallback } from '../main/CanvasController';
import EqContent from './EqContent';

/**
 * Represents any component (container, content)
 * that takes up space and forms a part of the
 * layout of a step.
 * The type L represents the Layout State that this
 * component produces.
 */
export default abstract class EqComponent<L extends LayoutState> {

    protected width: number;
    protected height: number;
    protected padding: Padding;

    constructor(padding) {
        this.padding = padding;
    }

    setWidth(newWidth: number) {
        this.width = newWidth;
    }

    setHeight(newHeight: number) {
        this.height = newHeight;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getPadding(): Padding {
        return this.padding;
    }

    /**
     * Recalc dimensions for this component, and all children if
     * this is a container. Default implementation does just for
     * this component.
     */
    recalcDimensions() {
        this.width = this.calcWidth();
        this.height = this.calcHeight();
    }

    /**
     * Return the vertical dimensions that form the 'main text line'
     * of this component. This is only relevant to HBoxes, which will
     * ensure that their children's main text lines line up. These
     * dimensions are given with respect to the top of this component,
     * including padding. The default implementation given here returns
     * undefined, indicating that the component does not have a main
     * text line. Components that do this are simply vertically centered
     * in the HBox.
     */
    getMainTextLine(): [number, number] {
        return undefined;
    }

    protected abstract calcWidth(): number;
    protected abstract calcHeight(): number;

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
     * @param mouseEnter Mouse enter events for this step.
     * @param mouseExit Mouse exit events for this step.
     * @param mouseClick Mouse click events for this step.
     * @param tempContent Temporary content added only for this step.
     */
    abstract addLayout( parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                        tlx: number, tly: number, currScale: number,
                        opacityObj: Object, colorsObj: Object,
                        mouseEnter: Map<LayoutState, MouseEventCallback>, 
                        mouseExit: Map<LayoutState, MouseEventCallback>, 
                        mouseClick: Map<LayoutState, MouseEventCallback>,
                        tempContent: EqContent<any>[]): L;
}
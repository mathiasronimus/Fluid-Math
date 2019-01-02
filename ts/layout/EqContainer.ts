import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';

export default abstract class EqContainer extends EqComponent {

    protected children: EqComponent[];

    constructor(children: EqComponent[], padding: Padding) {
        super(padding);
        this.children = children;
    }

    /**
     * Draws the container on the canvas,
     * only used in the creator.
     * 
     * @param l The layout of this container.
     * @param ctx The graphics context to draw to.
     */
    abstract creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D): void;

    getChildren(): EqComponent[] {
        return this.children;
    }

}
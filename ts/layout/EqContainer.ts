import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';

export default abstract class EqContainer extends EqComponent {

    protected children: EqComponent[];

    constructor(children: EqComponent[], padding: Padding) {
        super(padding);
        this.children = children;
    }

    getChildren(): EqComponent[] {
        return this.children;
    }

    //Should never be called
    interpolate(o: EqComponent, a: number): EqComponent {
        return undefined;
    }

    /**
     * Containers are not drawn.
     * 
     * @param s The layout state.
     * @param ctx The graphics context.
     */
    draw(s: LayoutState, ctx: CanvasRenderingContext2D) {}

    /**
     * Containers don't animate.
     */
    shouldAnimate() {
        return false;
    }
}
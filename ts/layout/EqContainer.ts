import EqComponent from './EqComponent';
import Frame from '../animation/Frame';
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

    draw(f: Frame, ctx: CanvasRenderingContext2D) {
        //do nothing
    }

    //Containers don't draw anything, their
    //drawables are purely for layout.
    shouldAnimate() {
        return false;
    }
}
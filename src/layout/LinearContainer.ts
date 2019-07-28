import EqContainer from "./EqContainer";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import CanvasController from "../main/CanvasController";
import EqContent from './EqContent';
import LayoutState from "../animation/LayoutState";

/**
 * Represents a simple linear container
 * whose contents can be represented as
 * a single children array.
 */
export default abstract class LinearContainer<L extends LayoutState> extends EqContainer<L> {

    protected children: EqComponent<any>[];

    constructor(children: EqComponent<any>[], padding: Padding) {
        super(padding);
        this.children = children;
    }

    getChildren(): EqComponent<any>[] {
        return this.children;
    }

    recalcDimensions() {
        this.children.forEach(child => child.recalcDimensions());
        super.recalcDimensions();
    }
}
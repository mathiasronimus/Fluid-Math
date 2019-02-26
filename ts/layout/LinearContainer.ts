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

    /**
     * Throws if toAdd is not valid.
     */
    protected abstract addValid(toAdd: EqComponent<any>);

    /**
     * Add a child before another.
     * 
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    addBefore(toAdd: EqComponent<any>, before: EqComponent<any>) {
        this.addValid(toAdd);
        let index = this.children.indexOf(before);
        this.children.splice(index, 0, toAdd);
    }

    /**
     * Add a child after another.
     * 
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    addAfter(toAdd: EqComponent<any>, after: EqComponent<any>) {
        this.addValid(toAdd);
        let index = this.children.indexOf(after);
        this.children.splice(index + 1, 0, toAdd);
    }

    forEachUnder(forEach: (content: EqContent<any>) => void) {
        this.children.forEach(child => {
            if (child instanceof EqContent) {
                //Run the function
                forEach(child);
            } else if (child instanceof EqContainer) {
                child.forEachUnder(forEach);
            } else {
                throw "unrecognized component type";
            }
        });
    }

    delete(toDelete: EqComponent<any>) {
        this.children.splice(this.children.indexOf(toDelete), 1);
    }

    getChildren(): EqComponent<any>[] {
        return this.children;
    }
}
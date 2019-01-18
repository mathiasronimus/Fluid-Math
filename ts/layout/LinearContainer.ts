import EqContainer from "./EqContainer";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import CanvasController from "../main/CanvasController";
import EqContent from './EqContent';

/**
 * Represents a simple linear container
 * whose contents can be represented as
 * a single children array.
 */
export default abstract class LinearContainer extends EqContainer {

    protected children: EqComponent[];

    constructor(children: EqComponent[], padding: Padding) {
        super(padding);
        this.children = children;
    }

    /**
     * Add a child before another.
     * 
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    protected addBefore(toAdd: EqComponent, before: EqComponent) {
        let index = this.children.indexOf(before);
        this.children.splice(index, 0, toAdd);
    }

    /**
     * Add a child after another.
     * 
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    protected addAfter(toAdd: EqComponent, after: EqComponent) {
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

    delete(toDelete: EqComponent) {
        this.children.splice(this.children.indexOf(toDelete), 1);
    }

    getChildren(): EqComponent[] {
        return this.children;
    }
}
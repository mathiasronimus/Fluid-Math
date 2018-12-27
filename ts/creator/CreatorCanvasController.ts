import CanvasController from "../main/CanvasController";
import VBox from "../layout/VBox";
import HBox from "../layout/HBox";
import EqContainer from '../layout/EqContainer';
import EqContent from '../layout/EqContent';
import Padding from '../layout/Padding';
import C from '../main/consts';
import Frame from '../animation/Frame';
import EqComponent from "../layout/EqComponent";
import Controller from "./main";

enum State {
    Adding,
    Selecting,
    Idle,
}

export default class CreatorCanvasController extends CanvasController {

    private state: State;

    //The thing to add when clicked.
    //If container, is object.
    //If content, is number.
    //If undefined, remove things instead.
    private adding: number | Object;

    //Called when the canvas is clicked and something done
    //Is passed the layout for the single step the controller posseses
    private onLayoutModified: (Object) => void;

    private textField: HTMLTextAreaElement;
    private newText: string;

    private controller: Controller;

    constructor(container: Element, instructions, fontFamily: string, fontWeight: string, onLayoutModified: (Object) => void, controller: Controller) {
        super(container, instructions, fontFamily, fontWeight);
        this.state = State.Idle;
        this.controller = controller;
        this.recalc();
        this.onLayoutModified = onLayoutModified;
        this.canvas.removeEventListener('click', this.nextStep);
        this.canvas.addEventListener('click', this.editClick.bind(this));

        //Add text area
        this.textField = document.createElement('textarea');
        this.textField.rows = 1;
        this.textField.cols = 70;
        this.textField.value = this.steps[0].text;
        this.container.appendChild(this.textField);
        this.container.appendChild(this.controller.getOkButton(function() {
            this.newText = this.textField.value;
            this.refresh();
        }.bind(this)));
    }

    protected redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frames.forEach(f => {

            //Draw borders
            if (f.component instanceof VBox) {
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

                //Outer border
                this.ctx.rect(f.tlx, f.tly, f.width, f.height);
                this.ctx.stroke();

                let pad = C.creatorVBoxPadding;

                //Middle border, top and bottom
                this.ctx.setLineDash([5]);
                line(f.tlx, f.tly + pad / 2, f.tlx + f.width, f.tly + pad / 2, this.ctx);
                line(f.tlx, f.tly + f.height - pad / 2, f.tlx + f.width, f.tly + f.height - pad / 2, this.ctx);

                //Inner border, top and bottom
                this.ctx.setLineDash([]);
                line(f.tlx, f.tly + pad, f.tlx + f.width, f.tly + pad, this.ctx);
                line(f.tlx, f.tly + f.height - pad, f.tlx + f.width, f.tly + f.height - pad, this.ctx);

                this.ctx.strokeStyle = "#000";
            } else if (f.component instanceof HBox) {
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

                //Outer border
                this.ctx.rect(f.tlx, f.tly, f.width, f.height);
                this.ctx.stroke();

                let pad = C.creatorHBoxPadding;

                //Middle border, top and bottom
                this.ctx.setLineDash([5]);
                line(f.tlx + pad / 2, f.tly, f.tlx + pad / 2, f.tly + f.height, this.ctx);
                line(f.tlx + f.width - pad / 2, f.tly, f.tlx + f.width - pad / 2, f.tly + f.height, this.ctx);

                //Inner border, top and bottom
                this.ctx.setLineDash([]);
                line(f.tlx + pad, f.tly, f.tlx + pad, f.tly + f.height, this.ctx);
                line(f.tlx + f.width - pad, f.tly, f.tlx + f.width - pad, f.tly + f.height, this.ctx);

                this.ctx.strokeStyle = "#000";
            }
            this.ctx.save();
            f.component.draw(f, this.ctx);
            this.ctx.restore();
        });

        function line(x1, y1, x2, y2, ctx: CanvasRenderingContext2D) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    protected nextStep() {
        //Override to not animate
        this.frames = this.calcLayout(++this.currStep);
    }

    //Override to change padding
    protected parseContainer(containerObj): EqContainer {
        let type: string = containerObj.type;
        if (type === "vbox") {
            return new VBox(
                this.parseContainerChildren(containerObj.children),
                Padding.even(C.creatorVBoxPadding));
        } else if (type === "hbox") {
            return new HBox(
                this.parseContainerChildren(containerObj.children),
                Padding.even(C.creatorHBoxPadding));
        } else if (type === undefined) {
            throw "Invalid JSON File: Missing type attribute on container descriptor.";
        } else {
            throw "Invalid JSON File: Unrecognized type: " + type;
        }
    }

    /**
     * Returns the thing to add as a component.
     */
    private getAddComponent(): EqComponent {
        if (typeof this.adding === 'object') {
            //Adding a container
            return this.parseContainer(this.adding);
        } else if (typeof this.adding === 'number') {
            return this.content[this.adding];
        } else {
            throw 'bad add type';
        }
    }

    /**
     * Given a click on the canvas,
     * performs the appropriate action.
     * 
     * @param e Event detailing the mouse click. 
     */
    private editClick(e: MouseEvent) {
        let canvasX = e.pageX - this.canvas.offsetLeft;
        let canvasY = e.pageY - this.canvas.offsetTop + this.container.scrollTop;
        switch (this.state) {
            case State.Adding:
                this.addClick(canvasX, canvasY);
                this.refresh();
                break;
            case State.Selecting:
                this.selectClick(canvasX, canvasY);
                break;
            case State.Idle:
                break;
        }
    }

    /**
     * Selects the content at the 
     * specified position.
     * 
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     */
    private selectClick(x: number, y: number): void {
        let clickedFrame: Frame = this.getClickedFrame(x, y);
        if (clickedFrame === undefined) {
            throw "click wasn't on any frame";
        } else {
            this.controller.select(clickedFrame);
        }
    }

    /**
     * Whether the component to be added
     * is already on the canvas.
     */
    private onCanvas(): boolean {
        //Duplicate containers allowed
        if (typeof this.adding === 'object') {
            return false;
        }

        return this.recursiveOnCanvas(this.steps[0].root);
    }

    /**
     * Recursively checks if the
     * component to add already
     * exists on the canvas.
     * 
     * @param toCheck The object to check.
     */
    private recursiveOnCanvas(toCheck: Object): boolean {
        Object.keys(toCheck).forEach(key => {
            let value = toCheck[key];
            if (typeof value === 'object') {
                if (this.recursiveOnCanvas(value)) {
                    return true;
                }
            } else if (typeof value === 'number') {
                if (value === this.adding) {
                    return true;
                }
            }
        });
        return false;
    }

    /**
     * Adds a container/content at the
     * clicked position.
     * 
     * @param x X-ordinate on the canvas.
     * @param y Y-orindate on the canvas.
     */
    private addClick(x: number, y: number) {
        //Check if the content is already on the canvas
        if (this.onCanvas()) {
            throw "duplicate content not allowed";
        }
        let clickedFrame: Frame = this.getClickedFrame(x, y);
        if (clickedFrame === undefined) {
            //Didn't click on anything
            throw "click wasn't on any frame";
        }
        else if (clickedFrame.component instanceof EqContent) {
            this.addClickOnComponent(clickedFrame, x, y);
        }
        else if (clickedFrame.component instanceof EqContainer) {
            //Add inside if in inside inner border, adjacent otherwise
            if (clickedFrame.component instanceof VBox) {
                this.addClickOnVbox(clickedFrame, y);
            }
            else if (clickedFrame.component instanceof HBox) {
                this.addClickOnHbox(clickedFrame, x);
            }
            else {
                throw 'unrecognized container type';
            }
        }
        else {
            throw "unrecognized frame type";
        }
    }

    /**
     * Adds content when an Hbox was clicked.
     * Adds adjacent to or inside the HBox,
     * depending on click.
     * 
     * @param clickedFrame The Frame of the clicked HBox.
     * @param x The x-ordinate of the click.
     */
    private addClickOnHbox(clickedFrame: Frame, x: number) {
        if (clickedFrame.onLeft(x)) {
            if (x - clickedFrame.tlx <= C.creatorHBoxPadding / 2) {
                //Outer border, add adjacent
                let containerFrame = clickedFrame.layoutParent;
                if (containerFrame === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerFrame.component as EqContainer;
                    this.addBefore(container.getChildren(), this.getAddComponent(), clickedFrame.component);
                }
            }
            else {
                //Inner border, add inside
                (clickedFrame.component as EqContainer).getChildren().unshift(this.getAddComponent());
            }
        } else {
            //On right
            if (clickedFrame.tlx + clickedFrame.width - x <= C.creatorHBoxPadding / 2) {
                //Outer border, add adjacent
                let containerFrame = clickedFrame.layoutParent;
                if (containerFrame === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerFrame.component as EqContainer;
                    this.addAfter(container.getChildren(), this.getAddComponent(), clickedFrame.component)
                }
            }
            else {
                //Inner border, add inside
                (clickedFrame.component as EqContainer).getChildren().push(this.getAddComponent());
            }
        }
    }

    /**
     * Adds content when a VBox was clicked.
     * This adds adjacent to or inside the Vbox
     * depending on which part was clicked.
     * 
     * @param clickedFrame The Frame of the clicked Vbox.
     * @param y The y-ordinate of the click.
     */
    private addClickOnVbox(clickedFrame: Frame, y: number): void {
        if (clickedFrame.onTop(y)) {
            if (y - clickedFrame.tly <= C.creatorVBoxPadding / 2) {
                //Outer border, add adjacent
                let containerFrame = clickedFrame.layoutParent;
                if (containerFrame === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerFrame.component as EqContainer;
                    this.addBefore(container.getChildren(), this.getAddComponent(), clickedFrame.component);
                }
            } else {
                //Inside border, add inside
                (clickedFrame.component as EqContainer).getChildren().unshift(this.getAddComponent());
            }
        }
        else {
            //On bottom
            if (clickedFrame.tly + clickedFrame.height - y <= C.creatorVBoxPadding / 2) {
                //Outer border, add adjacent
                let containerFrame = clickedFrame.layoutParent;
                if (containerFrame === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerFrame.component as EqContainer;
                    this.addAfter(container.getChildren(), this.getAddComponent(), clickedFrame.component);
                }
            }
            else {
                //Inner border, add inside
                (clickedFrame.component as EqContainer).getChildren().push(this.getAddComponent());
            }
        }
    }

    /**
     * Adds content when the click was on a
     * component. This adds the content
     * adjacent to the component.
     * 
     * @param clickedFrame The Frame of the clicked component.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     */
    private addClickOnComponent(clickedFrame: Frame, x: number, y: number): void {
        //Add adjacent to content
        let container: EqComponent = clickedFrame.layoutParent.component;
        if (container instanceof VBox) {
            //Add top/bottom
            if (clickedFrame.onTop(y)) {
                //Add top
                this.addBefore(container.getChildren(), this.getAddComponent(), clickedFrame.component);
            }
            else {
                //Add bottom
                this.addAfter(container.getChildren(), this.getAddComponent(), clickedFrame.component);
            }
        }
        else if (container instanceof HBox) {
            //Add left/right
            if (clickedFrame.onLeft(x)) {
                //Add left
                this.addBefore(container.getChildren(), this.getAddComponent(), clickedFrame.component);
            }
            else {
                //Add right
                this.addAfter(container.getChildren(), this.getAddComponent(), clickedFrame.component);
            }
        } else {
            throw "unrecognized container type";
        }
    }

    /**
     * Given clicked coordinates, find
     * the frame that was clicked. If not
     * found, returns undefined.
     * 
     * @param x X-ordinate on the canvas.
     * @param y Y-ordinate on the canvas.
     */
    private getClickedFrame(x: number, y: number): Frame {
        for (let i = 0; i < this.frames.length; i++) {
            let currFrame = this.frames[i];
            if (currFrame.contains(x, y)) {
                return currFrame;
            }
        }
        return undefined;
    }

    /**
     * Start the conversion to a step
     * layout object.
     * 
     * ENSURE THIS DOES NOT RETURN REFERENCES
     * TO THE ORIGINAL INSTRUCTIONS OBJECT.
     * 
     * @param root The root container.
     */
    private toStepLayout(root: EqContainer): Object {
        return {
            text:   this.newText ?
                    this.newText :
                    this.steps[0].text,
            root: this.containerToStepLayout(root)
        }
    }

    /**
     * Given the root Component of a layout,
     * return the JSON-ifyable representation
     * as used by the steps array.
     * 
     * @param comp The component to start with.
     */
    private containerToStepLayout(comp: EqContainer): Object {
        let toReturn: any = {};
        if (comp instanceof VBox) {
            toReturn.type = "vbox";
        } else if (comp instanceof HBox) {
            toReturn.type = "hbox";
        } else {
            throw 'unrecognized container type';
        }
        toReturn.children = this.childrenToStepLayout(comp.getChildren());
        return toReturn;
    }

    /**
     * Given a list of components,
     * converts them all to the JSON-ifyable
     * format.
     * 
     * @param children A list of components.
     */
    private childrenToStepLayout(children: EqComponent[]): any[] {
        let toReturn = [];
        children.forEach(comp => {

            if (comp instanceof EqContent) {
                toReturn.push(this.content.indexOf(comp));
            } else if (comp instanceof EqContainer) {
                toReturn.push(this.containerToStepLayout(comp as EqContainer));
            } else {
                throw "unrecognized type";
            }

        });
        return toReturn;
    }

    /**
     * Add an element before another in
     * an array.
     * 
     * @param arr The array. 
     * @param toAdd The element to add.
     * @param before The element after the new one.
     */
    private addBefore(arr: EqComponent[], toAdd: EqComponent, before: EqComponent) {
        let index = arr.indexOf(before);
        console.log(index);
        arr.splice(index, 0, toAdd);
    }

    /**
     * Add an element after another in an
     * array.
     * 
     * @param arr The array.
     * @param toAdd The element to add.
     * @param after The element before the new one.
     */
    private addAfter(arr: EqComponent[], toAdd: EqComponent, after: EqComponent) {
        let index = arr.indexOf(after);
        arr.splice(index + 1, 0, toAdd);
    }

    /**
     * Updates the controller to 
     * reflect the changes made.
     */
    private refresh(): void {
        let root = this.frames[this.frames.length - 1].component as EqContainer;
        let newLayout = this.toStepLayout(root);
        this.onLayoutModified(this.controller.instructionsFromStep(newLayout));
    }

    /**
     * Delete the component that generated
     * a frame.
     * 
     * @param frame The frame. 
     */
    delete(frame: Frame) {
        let parentChildren = (frame.layoutParent.component as EqContainer).getChildren();
        parentChildren.splice(parentChildren.indexOf(frame.component), 1);
        this.refresh();
    }

    /**
     * Select a component on the next click.
     */
    select() {
        this.state = State.Selecting;
    }

    /**
     * Set the component to be added
     * upon a click.
     * 
     * @param newAdd The to-be-added component. 
     */
    setAdding(newAdd) {
        this.state = State.Adding;
        this.adding = newAdd;
    }

    /**
     * Return the to-be-added component.
     */
    getAdding() {
        return this.adding;
    }

    /**
     * Returns the current step layout
     * as an instructions object that
     * can be used to re-initialize the
     * canvas.
     */
    getStepAsInstructions() {
        return this.controller.instructionsFromStep(this.steps[0]);
    }

    /**
     * Sets the state of a new canvas to be
     * the same as of an old one.
     * 
     * @param oldCanvas The old canvas.
     * @param newCanvas The new canvas.
     */
    static transferState(oldCanvas: CreatorCanvasController, newCanvas: CreatorCanvasController) {
        switch (oldCanvas.state) {
            case State.Adding:
                newCanvas.setAdding(oldCanvas.getAdding());
                break;
            case State.Selecting:
                newCanvas.select();
                break;
        }
    }
}
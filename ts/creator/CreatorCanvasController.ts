import CanvasController from "../main/CanvasController";
import VBox from "../layout/VBox";
import HBox from "../layout/HBox";
import TightHBox from '../layout/TightHBox';
import EqContainer from '../layout/EqContainer';
import EqContent from '../layout/EqContent';
import C from '../main/consts';
import LayoutState from '../animation/LayoutState';
import EqComponent from "../layout/EqComponent";
import Controller from "./main";
import SubSuper from '../layout/SubSuper';
import HDivider from "../layout/HDivider";
import SelectableCanvasController from "./SelectableCanvasController";

enum State {
    Adding,
    Selecting,
    Idle,
}

/**
 * Overrides methods of the canvas controller to
 * provide editing functionality.
 */
export default class CreatorCanvasController extends SelectableCanvasController {

    private state: State;

    //The thing to add when clicked.
    //If container, is object.
    //If content, is string.
    private adding: string | Object;

    //Called when the canvas is clicked and something done
    //Is passed the layout for the single step the controller posseses
    private onLayoutModified: (Object) => void;

    private textField: HTMLTextAreaElement;

    private controller: Controller;

    private rootContainer: EqComponent;

    constructor(container: Element, instructions, onLayoutModified: (Object) => void, controller: Controller) {
        super(container, instructions);
        this.state = State.Idle;
        this.controller = controller;
        this.onLayoutModified = onLayoutModified;
        this.canvas.removeEventListener('click', this.nextStep);
        this.canvas.addEventListener('click', this.editClick.bind(this));

        //Add text area
        this.textField = document.createElement('textarea');
        this.textField.rows = 1;
        this.textField.cols = 70;
        this.textField.value = this.steps[0].text;
        this.container.appendChild(this.textField);
        let confirm = this.controller.getOkButton(function () {
            this.steps[0].text = this.textField.value;
            this.refresh();
        }.bind(this));
        confirm.innerHTML = "Set Text";
        this.container.appendChild(confirm);
    }

    protected redraw() {
        super.redraw();
        this.currStates.forEach(f => {
            if (f.component instanceof EqContainer) {
                f.component.creatorDraw(f, this.ctx);
            }
        });
    }

    /**
     * Recalculates and redraws the current step.
     * Override to store the root layout for later.
     */
    protected recalc() {
        let rootLayout;
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        this.rootContainer = rootLayout.component;
        let [width, height] = this.getSize(rootLayout);
        this.setSize(width, height);
        this.redraw();
    }

    protected nextStep() {
        //Override to not animate
        this.currStates = this.calcLayout(++this.currStep)[0];
    }

    //Override to change padding
    protected parseContainer(containerObj): EqContainer {
        let type: string = containerObj.type;
        if (type === "vbox") {
            return new VBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorVBoxPadding);
        } else if (type === "hbox") {
            return new HBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorHBoxPadding);
        } else if (type === "tightHBox") {
            return new TightHBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorTightHBoxPadding
            );
        } else if (type === 'subSuper') {
            let top = new HBox(
                this.parseContainerChildren(containerObj.top),
                C.creatorHBoxPadding
            );
            let middle = new TightHBox(
                this.parseContainerChildren(containerObj.middle),
                C.creatorTightHBoxPadding
            );
            let bottom = new HBox(
                this.parseContainerChildren(containerObj.bottom),
                C.creatorHBoxPadding
            );
            let portrusion = containerObj['portrusion'] ? containerObj['portrusion'] : C.defaultExpPortrusion;
            return new SubSuper(top, middle, bottom, portrusion, C.creatorSubSuperPadding);
        } else if (type === undefined) {
            this.controller.error("Invalid JSON File");
            throw "Invalid JSON File: Missing type attribute on container descriptor.";
        } else {
            this.controller.error("Invalid JSON File");
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
        } else if (typeof this.adding === 'string') {
            return this.getContentFromRef(this.adding);
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
        let canvasX = e.offsetX;
        let canvasY = e.offsetY;
        switch (this.state) {
            case State.Adding:
                this.addClick(canvasX, canvasY);
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
        let clickedLayout: LayoutState = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            throw "click wasn't on any frame";
        } else {
            this.controller.select(clickedLayout);
            this.selected = [];
            this.selected.push(clickedLayout);
            this.controller.contentManager.deEmphasize();
            if (clickedLayout.component instanceof EqContent) {
                //Highlight clicked content in the content pane
                this.controller.contentManager.showSelected(this.getContentReference(clickedLayout.component as EqContent<any>));
            }
            this.redraw();
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
        let found = false;
        Object.keys(toCheck).forEach(key => {
            let value = toCheck[key];
            if (typeof value === 'object') {
                if (this.recursiveOnCanvas(value)) {
                    found = true;
                }
            } else if (typeof value === 'string') {
                if (value === this.adding) {
                    found = true;
                }
            }
        });
        return found;
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
            this.controller.error("Can't add duplicate content.");
            throw "duplicate content not allowed";
        }
        let clickedLayout: LayoutState = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            //Didn't click on anything
            throw "click wasn't on any frame";
        }
        else if (clickedLayout.component instanceof EqContent) {
            this.addClickOnComponent(clickedLayout, x, y);
        }
        else if (clickedLayout.component instanceof EqContainer) {
            clickedLayout.component.addClick(clickedLayout, x, y, this.getAddComponent());
        }
        else {
            throw "unrecognized frame type";
        }
        this.refresh();
        this.controller.contentManager.startSelecting();
    }

    /**
     * Adds content when the click was on a
     * component. This adds the content
     * adjacent to the component.
     * 
     * @param clickedLayout The Layout state of the clicked component.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     */
    private addClickOnComponent(clickedLayout: LayoutState, x: number, y: number): void {
        //Add adjacent to content
        let container: EqContainer = clickedLayout.layoutParent.component as EqContainer;
        container.addClickOnChild(clickedLayout, x, y, this.getAddComponent());
    }

    /**
     * Start the conversion to a step
     * layout object.
     * 
     * @param root The root container.
     */
    private toStepLayout(root: EqContainer): Object {
        return {
            color: this.steps[0].color,
            opacity: this.steps[0].opacity,
            text: this.steps[0].text,
            root: root.toStepLayout(this)
        }
    }

    /**
     * Show some content piece as
     * selected.
     * 
     * @param ref Reference of the content to be selected. 
     */
    showAsSelected(ref: string) {
        let content = this.getContentFromRef(ref);
        //Find the layout state for that content
        let state = this.currStates.get(content);
        if (state) {
            this.selected.push(state);
        }
        this.redraw();
    }

    /**
     * Updates the controller to 
     * reflect the changes made.
     */
    refresh(): void {
        let newLayout = this.toStepLayout(this.rootContainer as EqContainer);
        this.onLayoutModified(this.controller.instructionsFromStep(newLayout));
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
     * Delete the component that generated
     * a layout state.
     * 
     * @param state The layout state generated by a component. 
     */
    delete(state: LayoutState) {
        let parent = (state.layoutParent.component as EqContainer);
        parent.delete(state.component);
        this.refresh();
    }

    /**
     * Changes the color of components. If the selected
     * component is a container, changes the color of all
     * components within it. If it is content, just changes
     * that content.
     * 
     * @param selected The component to apply color to.
     * @param colorName The name of the color (defined by the keys in C.colors)
     */
    changeColor(selected: EqComponent, colorName: string) {
        if (selected instanceof EqContent) {
            this.applyColor(selected, colorName);
        } else if (selected instanceof EqContainer) {
            //Apply to all inside container
            selected.forEachUnder(function (content) {
                this.applyColor(content, colorName);
            }.bind(this));
        }
        this.refresh();
    }

    /**
     * Changes the opacity of components. If the selected
     * component is a container, changes the color of all 
     * components within it. If it is content, just changes
     * that content.
     * 
     * @param selected The component to apply opacity to.
     * @param opacity The new opacity level.
     */
    changeOpacity(selected: EqComponent, opacity: number) {
        if (selected instanceof EqContent) {
            this.applyOpacity(selected, opacity);
        } else if (selected instanceof EqContainer) {
            //Apply to all inside the container
            selected.forEachUnder(function (content) {
                this.applyOpacity(content, opacity);
            }.bind(this));
        }
        this.refresh();
    }

    /**
     * Applies color to a particular piece of content.
     * 
     * @param applyTo The content to apply color to.
     * @param colorName The name of the color.
     */
    private applyColor(applyTo: EqContent<any>, colorName: string) {
        let step = this.steps[0];
        if (step['color'] === undefined) {
            step.color = {};
        }
        let ref = this.getContentReference(applyTo);
        if (colorName === 'default') {
            //Remove any color already set for this content
            delete step.color[ref];
            if (Object.keys(step.color).length === 0) {
                //Empty colors, delete as well
                delete step.color;
            }
        } else {
            step.color[ref] = colorName;
        }
    }

    /**
     * Applies opacity to a particular piece of content.
     * 
     * @param applyTo The content to apply opacity to.
     * @param opacity The opacity to apply.
     */
    private applyOpacity(applyTo: EqContent<any>, opacity: number) {
        let step = this.steps[0];
        if (step['opacity'] === undefined) {
            step.opacity = {};
        }
        let ref = this.getContentReference(applyTo);
        if (opacity === C.normalOpacity) {
            //Remove any opacity already set for this content
            delete step.opacity[ref];
            if (Object.keys(step.opacity).length === 0) {
                //Empty opacity, delete as well
                delete step.opacity;
            }
        } else {
            step.opacity[ref] = opacity;
        }
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
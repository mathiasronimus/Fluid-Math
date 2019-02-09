import CanvasController from '@shared/main/CanvasController';
import EqContainer from '@shared/layout/EqContainer';
import C from '@shared/main/consts';
import VBox from '@shared/layout/VBox';
import HBox from '@shared/layout/HBox';
import TightHBox from '@shared/layout/TightHBox';
import SubSuper from '@shared/layout/SubSuper';
import EqComponent from '@shared/layout/EqComponent';
import LayoutState from '@shared/animation/LayoutState';
import EqContent from '@shared/layout/EqContent';
import { deepClone } from '../helpers';
import { UndoRedoService } from '../undo-redo.service';
import { ContentSelectionService } from '../content-selection.service';

export default class CreatorCanvasController extends CanvasController {

    private originalInstructions;

    private rootContainer: EqContainer;

    private undoRedo: UndoRedoService;
    private selection: ContentSelectionService;

    constructor(container, instructions, editingStep, undoRedo, selection) {
        super(container, instructions);
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.currStep = editingStep;
        this.recalc();
        // Don't allow going to next step
        this.canvas.removeEventListener('click', this.nextStep);
        this.originalInstructions = instructions;
        // Whether dragging or clicking, mouse up could mean add
        this.onMoveOver = this.onMoveOver.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('drop', (e) => {
            this.onMouseUp(e);
            e.preventDefault();
        });
        this.canvas.addEventListener('mousemove', this.onMoveOver);
        this.canvas.addEventListener('dragover', this.onMoveOver);
        this.canvas.addEventListener('dragenter', (e) => {
            e.preventDefault();
        });
        this.canvas.setAttribute('droppable', 'true');
    }

    /**
     * Fires when mouse moved over canvas.
     * @param e The mouse event.
     */
    private onMoveOver(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (this.selection.adding) {
            this.previewAdd(e.offsetX, e.offsetY);
        }
    }

    /**
     * Fires when mouse is released over the canvas.
     * @param e The mouse event.
     */
    private onMouseUp(e: MouseEvent) {
        if (this.selection.adding) {
            this.finalizeAdd(e.offsetX, e.offsetY);
        } else {
            this.select(e.offsetX, e.offsetY);
        }
    }

    redraw() {
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
        const [width, height] = this.getSize(rootLayout);
        this.setSize(width, height);
        this.redraw();
    }

    // Override to change padding
    protected parseContainer(containerObj): EqContainer {
        const type: string = containerObj.type;
        if (type === 'vbox') {
            return new VBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorVBoxPadding);
        } else if (type === 'hbox') {
            return new HBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorHBoxPadding);
        } else if (type === 'tightHBox') {
            return new TightHBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorTightHBoxPadding
            );
        } else if (type === 'subSuper') {
            const top = new HBox(
                this.parseContainerChildren(containerObj.top),
                C.creatorHBoxPadding
            );
            const middle = new TightHBox(
                this.parseContainerChildren(containerObj.middle),
                C.creatorTightHBoxPadding
            );
            const bottom = new HBox(
                this.parseContainerChildren(containerObj.bottom),
                C.creatorHBoxPadding
            );
            const portrusion = containerObj.portrusion ? containerObj.portrusion : C.defaultExpPortrusion;
            return new SubSuper(top, middle, bottom, portrusion, C.creatorSubSuperPadding);
        } else if (type === undefined) {
            throw new Error('Invalid JSON File: Missing type attribute on container descriptor.');
        } else {
            throw new Error('Invalid JSON File: Unrecognized type: ' + type);
        }
    }

    /**
     * Add something at (x, y) and save the new state.
     * @param x X-ordinate of mouse
     * @param y Y-ordinate of mouse
     */
    private finalizeAdd(x: number, y: number) {
        this.undoRedo.publishChange(this.getChangedLayout(x, y));
        this.selection.adding = undefined;
    }

    /**
     * Add something at (x, y), but show a preview without saving the state.
     * @param x X-ordinate of mouse.
     * @param y Y-ordinate of mouse.
     */
    private previewAdd(x: number, y: number) {
        const newLayout: any = this.getChangedLayout(x, y);
        const realSteps = this.steps;
        this.steps = newLayout.steps;
        super.recalc();
        this.steps = realSteps;
        let newRootState;
        [this.currStates, newRootState] = this.calcLayout(this.currStep);
        this.rootContainer = newRootState.component;
    }

    /**
     * Get the new layout resulting from adding something at (x, y)
     * @param x The x-ordinate of the mouse.
     * @param y The y-ordinate of the mouse.
     */
    private getChangedLayout(x: number, y: number): object {
        // Check if the content is already on the canvas
        if (this.onCanvas()) {
            throw new Error('duplicate content not allowed');
        }
        const clickedLayout: LayoutState = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            // Didn't click on anything
            throw new Error('click was not on anything.');
        } else if (clickedLayout.component instanceof EqContent) {
            this.addClickOnComponent(clickedLayout, x, y);
        } else if (clickedLayout.component instanceof EqContainer) {
            clickedLayout.component.addClick(clickedLayout, x, y, this.getAddComponent());
        } else {
            throw new Error('unrecognized frame type');
        }
        const newStepLayout = this.rootContainer.toStepLayout(this);
        const origInstructionsClone: any = deepClone(this.originalInstructions);
        origInstructionsClone.steps[this.currStep].root = newStepLayout;
        return origInstructionsClone;
    }

    /**
     * Adds content when the click was on a
     * component. This adds the content
     * adjacent to the component.
     * @param clickedLayout The Layout state of the clicked component.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     */
    private addClickOnComponent(clickedLayout: LayoutState, x: number, y: number): void {
        // Add adjacent to content
        const container: EqContainer = clickedLayout.layoutParent.component as EqContainer;
        container.addClickOnChild(clickedLayout, x, y, this.getAddComponent());
    }

    /**
     * Given clicked coordinates, find
     * the layout that was clicked. If not
     * found, returns undefined.
     * @param x X-ordinate on the canvas.
     * @param y Y-ordinate on the canvas.
     */
    protected getClickedLayout(x: number, y: number): LayoutState {
        let clicked;
        this.currStates.forEach(currState => {
            if (!clicked && currState.contains(x, y)) {
                clicked = currState;
            }
        });
        return clicked;
    }

    /**
     * Whether the component to be added
     * is already on the canvas.
     */
    private onCanvas(): boolean {
        // Duplicate containers allowed
        if (this.selection.addingContainer()) {
            return false;
        }

        return this.recursiveOnCanvas(this.steps[this.currStep].root);
    }

    /**
     * Recursively checks if the
     * component to add already
     * exists on the canvas.
     * @param toCheck The object to check.
     */
    private recursiveOnCanvas(toCheck: object): boolean {
        let found = false;
        Object.keys(toCheck).forEach(key => {
            const value = toCheck[key];
            if (typeof value === 'object') {
                if (this.recursiveOnCanvas(value)) {
                    found = true;
                }
            } else if (typeof value === 'string') {
                if (value === this.selection.adding) {
                    found = true;
                }
            }
        });
        return found;
    }

    /**
     * Select something at (x, y)
     * @param x X-ordinate of mouse.
     * @param y Y-ordinate of mouse.
     */
    private select(x: number, y: number) {

    }

    /**
     * Returns the thing to add as a component.
     */
    private getAddComponent(): EqComponent {
        if (this.selection.addingContainer()) {
            // Adding a container
            return this.parseContainer(this.selection.getContainer());
        } else {
            return this.getContentFromRef(this.selection.adding);
        }
    }
}

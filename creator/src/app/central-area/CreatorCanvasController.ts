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
import HDivider from '@shared/layout/HDivider';
import { deepClone } from '../helpers';
import { UndoRedoService } from '../undo-redo.service';
import { ContentSelectionService } from '../content-selection.service';

export default class CreatorCanvasController extends CanvasController {

    private originalInstructions;

    private rootContainer: EqContainer;

    private undoRedo: UndoRedoService;
    private selection: ContentSelectionService;

    private selectedLayout: LayoutState;

    constructor(container, instructions, editingStep, undoRedo, selection) {
        super(container, instructions);
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.redraw = this.redraw.bind(this);
        this.delete = this.delete.bind(this);
        this.selection.addAddListener(this.redraw);
        this.selection.addSelectedOnCanvasListener(() => {
            if (this.selection.selectedOnCanvas === undefined) {
                this.selectedLayout = undefined;
            }
            this.redraw();
        });
        this.selection.canvasInstance = this;
        this.currStep = editingStep;
        this.recalc();
        // Don't allow going to next step
        this.canvas.removeEventListener('click', this.nextStep);
        this.originalInstructions = instructions;
        // Whether dragging or clicking, mouse up could mean add
        this.onMoveOver = this.onMoveOver.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.canvas.addEventListener('click', this.onMouseUp);
        this.canvas.addEventListener('drop', (e) => {
            this.onMouseUp(e);
            e.preventDefault();
        });
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
        e.stopPropagation();
        if (this.selection.adding) {
            this.finalizeAdd(e.offsetX, e.offsetY);
        } else {
            this.select(e.offsetX, e.offsetY);
        }
    }

    redraw() {
        super.redraw();
        this.currStates.forEach(l => {
            if (l.component instanceof EqContainer) {
                l.component.creatorDraw(l, this.ctx);
            }
            if (this.selection) {
                if (l.component instanceof EqContent &&
                    this.getContentReference(l.component) === this.selection.adding) {
                    // Highlight what's selected on the content pane.
                    this.ctx.save();
                    this.ctx.strokeStyle = '#2196F3';
                    this.ctx.rect(l.tlx, l.tly, l.width, l.height);
                    this.ctx.stroke();
                    this.ctx.restore();
                } else if (l === this.selectedLayout) {
                    this.ctx.save();
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    this.ctx.fillRect(l.tlx, l.tly, l.width, l.height);
                    this.ctx.restore();
                }
            }
        });
    }

    /**
     * Recalculates and redraws the current step.
     * Override to store the root layout for later.
     */
    protected recalc() {
        // Whenever we recalc, the selection becomes invalid as we have new
        // layout states.
        if (this.selection) {
            this.selection.selectedOnCanvas = undefined;
            this.selectedLayout = undefined;
        }
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
                C.creatorContainerPadding);
        } else if (type === 'hbox') {
            return new HBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorContainerPadding);
        } else if (type === 'tightHBox') {
            return new TightHBox(
                this.parseContainerChildren(containerObj.children),
                C.creatorContainerPadding
            );
        } else if (type === 'subSuper') {
            const top = new HBox(
                this.parseContainerChildren(containerObj.top),
                C.creatorContainerPadding
            );
            const middle = new TightHBox(
                this.parseContainerChildren(containerObj.middle),
                C.creatorContainerPadding
            );
            const bottom = new HBox(
                this.parseContainerChildren(containerObj.bottom),
                C.creatorContainerPadding
            );
            const portrusion = containerObj.portrusion ? containerObj.portrusion : C.defaultExpPortrusion;
            return new SubSuper(top, middle, bottom, portrusion, C.creatorContainerPadding);
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
            return this.getLayoutForPublish();
        }
        const clickedLayout: LayoutState = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            // Didn't click on anything
            return this.getLayoutForPublish();
        } else if (clickedLayout.component instanceof EqContent) {
            this.addClickOnComponent(clickedLayout, x, y);
        } else if (clickedLayout.component instanceof EqContainer) {
            clickedLayout.component.addClick(clickedLayout, x, y, this.getAddComponent());
        } else {
            return this.getLayoutForPublish();
        }
        return this.getLayoutForPublish();
    }

    /**
     * Get the current layout in the format
     * that can be published.
     */
    private getLayoutForPublish(): object {
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
        const selectedLayout = this.getClickedLayout(x, y);
        if (!selectedLayout) {
            return;
        }
        const selectedComponent = selectedLayout.component;
        const select = (ref: string) => {
            this.selectedLayout = selectedLayout;
            this.selection.selectedOnCanvas = ref;
        };
        if (selectedComponent instanceof EqContainer) {
            if (selectedComponent instanceof TightHBox) {
                select('c2');
            } else if (selectedComponent instanceof HBox) {
                select('c0');
            } else if (selectedComponent instanceof VBox) {
                select('c1');
            } else if (selectedComponent instanceof SubSuper) {
                select('c3');
            } else {
                throw new Error('Unrecognized container selected.');
            }
        } else if (selectedComponent instanceof EqContent) {
            select(this.getContentReference(selectedComponent));
        }
    }

    /**
     * Delete the currently selected component.
     * @param state The layout state generated by a component.
     */
    delete() {
        const parent = (this.selectedLayout.layoutParent.component as EqContainer);
        parent.delete(this.selectedLayout.component);
        this.undoRedo.publishChange(this.getLayoutForPublish());
    }

    /**
     * Return whether something is selected
     * and it can be deleted.
     */
    canDelete() {
        return  this.selectedLayout &&
                this.selectedLayout.layoutParent &&
                !(this.selectedLayout.layoutParent.component instanceof SubSuper);
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

    // Override to give h dividers some padding
    protected initContent(instructions) {
        super.initContent(instructions);
        this.hDividers = [];
        for (let i = 0; i < instructions.hDividers; i++) {
            this.hDividers.push(new HDivider(C.creatorHDividerPadding, 'h' + i));
        }
    }
}

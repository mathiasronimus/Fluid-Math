import CanvasController from '@shared/main/CanvasController';
import EqContainer from '@shared/layout/EqContainer';
import VBox from '@shared/layout/VBox';
import HBox from '@shared/layout/HBox';
import TightHBox from '@shared/layout/TightHBox';
import SubSuper from '@shared/layout/SubSuper';
import EqComponent from '@shared/layout/EqComponent';
import LayoutState from '@shared/animation/LayoutState';
import EqContent from '@shared/layout/EqContent';
import { deepClone, inLayout } from '../helpers';
import { UndoRedoService } from '../undo-redo.service';
import { ContentSelectionService } from '../content-selection.service';
import { SelectedStepService } from '../selected-step.service';
import { ErrorService } from '../error.service';
import RootContainer from '@shared/layout/RootContainer';
import Radical from '@shared/layout/Radical';
import { ContainerFormat, FileFormat } from '@shared/main/FileFormat';
import CreatorContainer from './CreatorContainer';
import CreatorRootContainer from './CreatorRootContainer';
import Quiz from '@shared/layout/Quiz';
import CreatorTable from './CreatorTable';
import TableContainer from '@shared/layout/TableContainer';
import { normalOpacity } from '@shared/main/consts';
import CreatorComponentModel from './CreatorComponentModel';
// Imports that need to be included but aren't used directly
import './CreatorHBox';
import './CreatorQuiz';
import './CreatorRootContainer';
import './CreatorSubSuper';
import './CreatorTable';
import './CreatorTightHBox';
import './CreatorVBox';
import '@shared/layout/VCenterVBox';
import CreatorTightHBox from './CreatorTightHBox';

export default class CreatorCanvasController extends CanvasController {

    private originalInstructions: FileFormat;

    private rootContainer: EqContainer<any> & CreatorContainer;

    private undoRedo: UndoRedoService;
    private selection: ContentSelectionService;
    private step: SelectedStepService;
    private error: ErrorService;

    protected components: CreatorComponentModel;

    private selectedLayout: LayoutState;

    constructor(container: HTMLElement, instructions, undoRedo, selection, step: SelectedStepService, error: ErrorService) {
        super(container, instructions);
        // Remove autoplay overlay if present
        if (this.isAutoplay) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        // Remove lower area if present
        if (container.childElementCount >= 2) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.step = step;
        this.error = error;
        this.redraw = this.redraw.bind(this);
        this.delete = this.delete.bind(this);
        this.selection.addSelectedOnCanvasListener(() => {
            if (this.selection.selectedOnCanvas === undefined) {
                this.selectedLayout = undefined;
            }
            this.redraw();
        });
        this.selection.canvasInstance = this;
        this.currStep = step.selected;
        // Second recalc after super constructor) needed because step is only updated here
        this.recalc();
        // Don't allow going to next step
        this.canvas.removeEventListener('click', this.handleMouseClick as () => void);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
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

    protected initComponents(instructions: FileFormat) {
        this.components = new CreatorComponentModel(instructions);
        this.components.setGenInfo('customColors', this.customColors);
        this.components.setGenInfo('fixedHeights', this.fixedHeights);
    }

    /**
     * Add an outer border to the currently selected
     * table.
     */
    tableAddOuterBorder() {
        const table = this.getSelectedLayout().component as CreatorTable;
        const vLines = table.getVLines();
        const hLines = table.getHLines();
        const children = table.getChildren();
        // Add left border, if none
        if (!vLines[0]) {
            vLines[0] = this.components.addVDivider();
        }
        // Add right border, if none
        if (!vLines[children[0].length]) {
            vLines[children[0].length] = this.components.addVDivider();
        }
        // Add top border, if none
        if (!hLines[0]) {
            hLines[0] = this.components.addHDivider();
        }
        // Add bottom border, if none
        if (!hLines[children.length]) {
            hLines[children.length] = this.components.addHDivider();
        }
        // Save changes
        this.save();
    }

    /**
     * Add inner borders to the currently selected
     * table.
     */
    tableAddInnerBorder() {
        const table = this.getSelectedLayout().component as CreatorTable;
        const vLines = table.getVLines();
        const hLines = table.getHLines();
        const children = table.getChildren();

        // Add each missing horizontal border
        for (let r = 1; r < children.length; r++) {
            if (!hLines[r]) {
                hLines[r] = this.components.addHDivider();
            }
        }

        // Add each missing vertical border
        for (let c = 1; c < children[0].length; c++) {
            if (!vLines[c]) {
                vLines[c] = this.components.addVDivider();
            }
        }

        this.save();
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
            e.stopPropagation();
            this.select(e.offsetX, e.offsetY);
        }
    }

    redraw() {
        super.redraw();
        this.currStates.forEach(l => {
            if (l.component instanceof EqContainer) {
                (l.component as unknown as CreatorContainer).creatorDraw(l, this.ctx);
            }
            if (this.selection) {
                if (l.component instanceof EqContent &&
                    l.component.getRef() === this.selection.adding) {
                    // Highlight what's selected on the content pane.
                    this.ctx.save();
                    this.ctx.strokeStyle = '#2196F3';
                    this.ctx.rect(l.tlx, l.tly, l.width, l.height);
                    this.ctx.stroke();
                    this.ctx.restore();
                } else if (l === this.selectedLayout) {
                    this.ctx.save();
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
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
        [this.currStates, rootLayout] = this.calcLayout(this.currStep, true);
        this.rootContainer = rootLayout.component;
        const [width, height] = this.getSize(rootLayout);
        this.setSize(width, height);
        this.redraw();
    }

    /**
     * Add something at (x, y) and save the new state.
     * @param x X-ordinate of mouse
     * @param y Y-ordinate of mouse
     */
    private finalizeAdd(x: number, y: number) {
        const newLayout = this.getChangedLayout(x, y, true);
        this.undoRedo.publishChange(newLayout);
        this.selection.adding = undefined;
    }

    /**
     * Add something at (x, y), but show a preview without saving the state.
     * @param x X-ordinate of mouse.
     * @param y Y-ordinate of mouse.
     */
    private previewAdd(x: number, y: number) {
        const newLayout: any = this.getChangedLayout(x, y, false);
        const realSteps = this.steps;
        this.steps = newLayout.steps;
        super.recalc(true);
        this.steps = realSteps;
        let newRootState;
        [this.currStates, newRootState] = this.calcLayout(this.currStep, true);
        this.rootContainer = newRootState.component;
    }

    /**
     * Get the new layout resulting from adding something at (x, y)
     * @param x The x-ordinate of the mouse.
     * @param y The y-ordinate of the mouse.
     * @param final Whether this is a final add. If it is, errors are shown
     *              and some content may be automatically added.
     */
    private getChangedLayout(x: number, y: number, final: boolean): FileFormat {
        let modifyWith = (instructions: object) => {};
        // Check if the content is already on the canvas
        if (this.onCanvas()) {
            if (final) {
                this.error.text = 'Duplicate content not allowed in a step.';
            }
            return this.getLayoutForPublish(modifyWith);
        }
        const clickedLayout: LayoutState = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            // Didn't click on anything
            return this.getLayoutForPublish(modifyWith);
        } else if (clickedLayout.component instanceof EqContent) {
            try {
                // Add adjacent to content
                const container: EqContainer<any> = clickedLayout.layoutParent.component as EqContainer<any>;
                const toAdd = this.getAddComponent();
                (container as unknown as CreatorContainer).addClickOnChild(clickedLayout, x, y, toAdd);
                if (final) {
                    modifyWith = this.autoAddContent(toAdd);
                }
            } catch (e) {
                if (final) {
                    this.error.text = e.message;
                }
            }
        } else if (clickedLayout.component instanceof EqContainer) {
            try {
                const toAdd = this.getAddComponent();
                (clickedLayout.component as unknown as CreatorContainer).addClick(clickedLayout, x, y, toAdd);
                if (final) {
                    modifyWith = this.autoAddContent(toAdd);
                }
            } catch (e) {
                console.error(e);
                if (final) {
                    this.error.text = e.message;
                }
            }
        } else {
            return this.getLayoutForPublish(modifyWith);
        }
        return this.getLayoutForPublish(modifyWith);
    }

    /**
     * Get the current layout in the format
     * that can be published.
     * @param modifyWith A function to modify the instructions with after the step has been changed.
     */
    private getLayoutForPublish(modifyWith: (instructions: object) => void): FileFormat {
        const newStepLayout = this.rootContainer.toStepLayout(this);
        const origInstructionsClone: any = deepClone(this.originalInstructions);
        origInstructionsClone.steps[this.currStep].root = newStepLayout;
        modifyWith(origInstructionsClone);
        return origInstructionsClone;
    }

    /**
     * When a final add happens, automatically
     * add content to what was added if appropriate.
     * Returns a function that will be passed the
     * instructions object after the add. This can
     * be used to add the content.
     * @param addTo The component being added.
     */
    private autoAddContent(addTo: EqComponent<any>): (instructions: object) => void {
        if (addTo instanceof RootContainer) {
            // Add a radical automatically.
            // Look for a radical not used on the
            // current step, next step, or previous
            // step.
            const currState: any = this.undoRedo.getState();
            const currStep = currState.steps[this.step.selected];
            const nextStep = currState.steps[this.step.selected + 1];
            const prevStep = currState.steps[this.step.selected - 1];
            let unusedRef;
            for (let i = 0; i < currState.radicals; i++) {
                const ref = 'r' + i;
                const inCurr = currStep && inLayout(currStep.root, ref);
                const inNext = nextStep && inLayout(nextStep.root, ref);
                const inPrev = prevStep && inLayout(prevStep.root, ref);
                if (!(inCurr || inNext || inPrev)) {
                    // Found an unused ref
                    unusedRef = ref;
                    break;
                }
            }
            if (unusedRef) {
                // Use a previously created radical, no need to add one in instructions.
                (addTo as unknown as CreatorRootContainer).setRadical(this.components.getContent(unusedRef) as Radical);
                return () => {};
            } else {
                // No radicals, or all used in adjacent steps.
                const newRef = 'r' + this.components.numRadicals();
                // Dummy radical, but doesn't matter. Contents of the
                // container are serialized then re-created with the
                // modifed instructions.
                const dummyRadForSave = new Radical(newRef);
                (addTo as unknown as CreatorRootContainer).setRadical(dummyRadForSave);
                return (instructions: any) => {
                    if (!instructions.radicals) {
                        instructions.radicals = 0;
                    }
                    instructions.radicals++;
                };
            }
        } else {
            return () => {};
        }
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

        return inLayout(this.steps[this.currStep].root, this.selection.adding);
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
            if (selectedComponent instanceof CreatorTightHBox) {
                select('c2');
            } else if (selectedComponent instanceof HBox) {
                select('c0');
            } else if (selectedComponent instanceof Quiz) {
                select('c5');
            } else if (selectedComponent instanceof VBox) {
                select('c1');
            } else if (selectedComponent instanceof SubSuper) {
                select('c4');
            } else if (selectedComponent instanceof RootContainer) {
                select('c3');
            } else if (selectedComponent instanceof TableContainer) {
                select('c6');
            } else {
                throw new Error('Unrecognized container selected.');
            }
        } else if (selectedComponent instanceof EqContent) {
            select(selectedComponent.getRef());
        }
    }

    /**
     * Delete the currently selected component.
     * @param state The layout state generated by a component.
     */
    delete() {
        const parent = this.selectedLayout.layoutParent.component;
        (parent as unknown as CreatorContainer).delete(this.selectedLayout.component);
        const newLayout = this.getLayoutForPublish(() => {});
        this.undoRedo.publishChange(newLayout);
    }

    /**
     * Return whether something is selected
     * and it can be deleted.
     */
    canDelete() {
        return  this.selectedLayout &&
                this.selectedLayout.layoutParent &&
                !(this.selectedLayout.layoutParent.component instanceof SubSuper) &&
                !(this.selectedLayout.layoutParent.component instanceof RootContainer && this.selectedLayout.component instanceof HBox);
    }

    /**
     * Returns the thing to add as a component.
     */
    private getAddComponent(): EqComponent<any> {
        if (this.selection.addingContainer()) {
            // Adding a container
            return this.components.parseContainer(this.selection.getContainer(), 0);
        } else {
            return this.components.getContent(this.selection.adding);
        }
    }

    /**
     * Apply color and opacity to the currently
     * selected component. If content is selected,
     * just applies to that content. If a container
     * is selected, applies to all content contained
     * within it.
     * @param opacity The opacity to apply.
     * @param colorName The name of the color to apply.
     */
    applyColorAndOpacity(opacity: number, colorName: string) {
        const selected = this.selectedLayout.component;
        const newState: any = this.undoRedo.getStateClone();
        const step = newState.steps[this.currStep];
        if (selected instanceof EqContent) {
            this.applyColor(selected, colorName, step);
            this.applyOpacity(selected, opacity, step);
        } else if (selected instanceof EqContainer) {
            (selected as unknown as CreatorContainer).forEachUnder((content) => {
                this.applyColor(content, colorName, step);
                this.applyOpacity(content, opacity, step);
            });
        }
        this.undoRedo.publishChange(newState);
    }

    /**
     * Applies color to a particular piece of content.
     * @param content The content to apply color to.
     * @param colorName The name of the color.
     * @param stepObj The step object to apply to.
     */
    private applyColor(content: EqContent<any>, colorName: string, stepObj) {
        if (stepObj.color === undefined) {
            stepObj.color = {};
        }
        const ref = content.getRef();
        if (colorName === 'default') {
            // Remove any color already set for this content
            delete stepObj.color[ref];
            if (Object.keys(stepObj.color).length === 0) {
                // Empty colors, delete as well
                delete stepObj.color;
            }
        } else {
            stepObj.color[ref] = colorName;
        }
    }

    /**
     * Applies opacity to a particular piece of content.
     * @param content The content to apply opacity to.
     * @param opacity The opacity to apply.
     * @param stepObj The step object to apply to.
     */
    private applyOpacity(content: EqContent<any>, opacity: number, stepObj) {
        if (stepObj.opacity === undefined) {
            stepObj.opacity = {};
        }
        const ref = content.getRef();
        if (opacity === normalOpacity) {
            // Remove any opacity already set for this content
            delete stepObj.opacity[ref];
            if (Object.keys(stepObj.opacity).length === 0) {
                // Empty opacity, delete as well
                delete stepObj.opacity;
            }
        } else {
            stepObj.opacity[ref] = opacity;
        }
    }

    /**
     * Change the currently showing step.
     * @param newStep The new step to show.
     */
    showStep(newStep: number) {
        this.currStep = newStep;
        this.recalc();
    }

    /**
     * Return the step layout of the currently
     * selected container.
     */
    getStepLayoutOfSelected(): ContainerFormat {
        const container = this.selectedLayout.component;
        return (container as unknown as CreatorContainer).toStepLayout(this);
    }

    /**
     * Get the currently selected layout state.
     */
    getSelectedLayout() {
        return this.selectedLayout;
    }

    /**
     * Create a new state with the changes
     * made to this canvas saved.
     */
    save() {
        const newState = this.undoRedo.getStateClone();
        newState.steps[this.step.selected].root = this.rootContainer.toStepLayout(this);
        newState.hDividers = this.components.numHDividers();
        newState.vDividers = this.components.numVDividers();
        this.undoRedo.publishChange(newState);
    }
}

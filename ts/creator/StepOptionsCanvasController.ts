import SelectableCanvasController from "./SelectableCanvasController";
import { SelectionStrategy } from './SelectionStrategy';
import EqContent from "../layout/EqContent";

/**
 * Canvas controller to facilitate selecting
 * content and passing their references to
 * a function when changed.
 */
export default class StepOptionsCanvasController extends SelectableCanvasController {

    private onSelectChange: (refs: string[]) => void;
    private strategy: SelectionStrategy;

    constructor(container: HTMLElement, instructions, onSelectChange: (refs: string[]) => void, selectionStrategy: SelectionStrategy, startSelected: string[]) {
        super(container, instructions);
        this.onSelectChange = onSelectChange;
        this.strategy = selectionStrategy;
        this.canvas.removeEventListener('click', this.nextStep);
        this.canvas.addEventListener('click', this.onClick.bind(this));
        startSelected
            .map(ref => this.getContentFromRef(ref))
            .map(content => this.currStates.get(content))
            .forEach(layout => this.selected.push(layout));
        this.redraw();
    }

    private onClick(e: MouseEvent) {
        let canvasX = e.offsetX;
        let canvasY = e.offsetY;
        let clickedLayout = this.getClickedLayout(canvasX, canvasY);
        this.strategy.onSelect(this.selected, clickedLayout);
        this.onSelectChange(
            this.selected
                .map(l => l.component as EqContent<any>)
                .map(c => this.getContentReference(c))
        );
        this.redraw();
    }
}
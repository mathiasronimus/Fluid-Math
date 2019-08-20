import CanvasController from '@shared/main/CanvasController';
import EqContent from '@shared/layout/EqContent';
import EqContainer from '@shared/layout/EqContainer';
import LayoutState from '@shared/animation/LayoutState';
import EqComponent from '@shared/layout/EqComponent';
import SelectableComponentModel from './SelectableComponentModel';

export default class SelectableCanvasController extends CanvasController {

    private selectedRef: string;
    private index: number;
    private onChange: (newRef: string, index: number) => void;
    // Function that throws if we can't select something.
    private changeValid: (newRef: string, index: number) => void;

    protected components: SelectableComponentModel;

    constructor(container: HTMLElement,
                instructions,
                selectedRef: string,
                index: number,
                onChange: (newRef: string, index: number) => void,
                changeValid: (newRef: string, index: number) => void) {
        super(container, instructions);
        this.components = new SelectableComponentModel(instructions);
        // Remove autoplay overlay if present
        if (this.isAutoplay) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        this.selectedRef = selectedRef;
        this.index = index;
        this.onChange = onChange;
        this.changeValid = changeValid;
        this.canvas.addEventListener('click', this.select.bind(this));
        this.recalc(true);
    }

    // Override to draw selected differently
    redraw() {
        super.redraw();
        this.currStates.forEach((layout, component) => {
            if (component instanceof EqContent) {
                if (component.getRef() === this.selectedRef) {
                    this.ctx.save();
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(layout.tlx, layout.tly, layout.width, layout.height);
                    this.ctx.restore();
                }
            }
        });
    }

    /**
     * Deselect what is currently selected,
     * and select what is clicked.
     * @param e The click mouse event.
     */
    select(e: MouseEvent) {
        const x = e.offsetX;
        const y = e.offsetY;
        const layoutsArr: [LayoutState, EqComponent<any>][] = [];
        this.currStates.forEach((layout, component) => {
            layoutsArr.push([layout, component]);
        });
        let newRef = this.selectedRef;
        for (const [layout, component] of layoutsArr) {
            if (layout.contains(x, y)) {
                if (component instanceof EqContainer) {
                    // Clicking on container deselects.
                    newRef = '';
                } else if (component instanceof EqContent) {
                    // Select the new content
                    newRef = component.getRef();
                    break;
                }
            }
        }
        try {
            this.changeValid(newRef, this.index);
            this.selectedRef = newRef;
            this.onChange(this.selectedRef, this.index);
            this.redraw();
        } catch (e) {} finally {}
    }
}

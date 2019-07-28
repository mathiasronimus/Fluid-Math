import CanvasController from '@shared/main/CanvasController';
import EqContent from '@shared/layout/EqContent';
import EqContainer from '@shared/layout/EqContainer';
import HDivider from '@shared/layout/HDivider';
import C from '@shared/main/consts';
import LayoutState from '@shared/animation/LayoutState';
import EqComponent from '@shared/layout/EqComponent';
import VDivider from '@shared/layout/VDivider';
import { ContainerFormat, TableFormat } from '@shared/main/FileFormat';
import TableContainer from '@shared/layout/TableContainer';
import Padding from '@shared/layout/Padding';

export default class SelectableCanvasController extends CanvasController {

    private selectedRef: string;
    private index: number;
    private onChange: (newRef: string, index: number) => void;
    // Function that throws if we can't select something.
    private changeValid: (newRef: string, index: number) => void;

    constructor(container: HTMLElement,
                instructions,
                selectedRef: string,
                index: number,
                onChange: (newRef: string, index: number) => void,
                changeValid: (newRef: string, index: number) => void) {
        super(container, instructions);
        // Remove autoplay overlay if present
        if (this.isAutoplay) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        this.selectedRef = selectedRef;
        this.index = index;
        this.onChange = onChange;
        this.changeValid = changeValid;
        this.canvas.addEventListener('click', this.select.bind(this));
        this.redraw();
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

    // Override to give dividers some padding
    protected initContent(instructions) {
        super.initContent(instructions);
        this.hDividers = [];
        for (let i = 0; i < instructions.hDividers; i++) {
            this.hDividers.push(new HDivider(C.creatorSelectableHDividerPadding, 'h' + i));
        }
        this.vDividers = [];
        for (let i = 0; i < instructions.vDividers; i++) {
            this.vDividers.push(new VDivider(C.creatorSelectableVDividerPadding, 'v' + i));
        }
    }

    /**
     * Parse a container from the JSON Object.
     * Override to change stroke for table.
     * @param containerObj The JSON Object representing the container.
     * @param depth The depth in the layout tree.
     */
    protected parseContainer(containerObj: ContainerFormat, depth: number): EqContainer<any> {
        if (containerObj.type === 'table') {
            const format = containerObj as TableFormat;
            const children = this.parseChildren2D(format.children);
            return new TableContainer(
                C.defaultTablePadding,
                children,
                this.parseChildrenObj(format.hLines),
                this.parseChildrenObj(format.vLines),
                11,
                Padding.even(0)
            );
        } else {
            return super.parseContainer(containerObj, depth);
        }
    }
}

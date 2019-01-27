import CanvasController from "../main/CanvasController";
import LayoutState from '../animation/LayoutState';
import HDivider from '../layout/HDivider';
import C from '../main/consts';

/**
 * A canvas controller that can display
 * certain layouts as being selected.
 */
export default class SelectableCanvasController extends CanvasController {

    //The layouts to display as selected.
    protected selected: LayoutState[] = [];

    protected redraw() {
        super.redraw();
        if (this.selected) this.selected.forEach(s => {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(s.tlx, s.tly, s.width, s.height);
            this.ctx.restore();
        });
    }

    /**
     * Given clicked coordinates, find
     * the layout that was clicked. If not
     * found, returns undefined.
     * 
     * @param x X-ordinate on the canvas.
     * @param y Y-ordinate on the canvas.
     */
    protected getClickedLayout(x: number, y: number): LayoutState {
        let clicked = undefined;
        this.currStates.forEach(currState => {
            if (!clicked && currState.contains(x, y)) {
                clicked = currState;
            }
        });
        return clicked;
    }

    //Override to give h dividers some padding
    protected initContent(instructions) {
        super.initContent(instructions);
        this.hDividers = [];
        for (let i = 0; i < instructions['hDividers']; i++) {
            this.hDividers.push(new HDivider(C.creatorHDividerPadding));
        }
    }

    /**
     * Stop showing any components as
     * selected.
     */
    emptySelected() {
        this.selected = [];
        this.redraw();
    }

}
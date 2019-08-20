import CanvasController from '@shared/main/CanvasController';
import { newMap } from '@shared/main/helpers';
import EqContent from '@shared/layout/EqContent';

/**
 * A canvas controller which can render
 * all the steps it is passed for use
 * on another canvas.
 */
export default class RendererCanvasController extends CanvasController {

    private renderWidth: number;
    private renderHeight: number;

    constructor(instructions, renderWidth, renderHeight) {
        const fakeEl = document.createElement('div');
        super(fakeEl, instructions);
        this.renderWidth = renderWidth;
        this.renderHeight = renderHeight;
    }

    // For performance, override: doesn't need to do anything.
    protected recalc() {}

    /**
     * Render all the steps, returning an
     * array of canvases with dimensions
     * of renderWidth x renderHeight as
     * specified in the constructor.
     */
    render(): HTMLCanvasElement[] {
        const toReturn: HTMLCanvasElement[] = [];
        this.steps.forEach(step => {
            // Get the layouts for the step
            console.log(step.root);
            const rootContainer = this.components.parseContainer(step.root, 0);
            const colors = step.color;
            const opacities = step.opacity;
            const layouts = newMap();
            const rootLayout = rootContainer.addLayout( undefined, layouts, 0 , 0, 1, opacities, colors,
                                                        newMap(), newMap(), newMap(), []);

            // Render the layout
            const overflowX = rootLayout.width - this.renderWidth;
            const overflowY = rootLayout.height - this.renderHeight;
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.setSize(this.renderWidth, this.renderHeight);
            this.lastHeight = -1;
            this.lastWidth = -1;
            let scale: number;
            if (overflowX > overflowY) {
                scale = this.renderWidth / rootLayout.width;
            } else {
                scale = this.renderHeight / rootLayout.height;
            }
            this.ctx.scale(scale, scale);
            layouts.forEach(l => {
                this.ctx.save();
                if (l.component instanceof EqContent) {
                    l.component.interpColorOff();
                    l.component.draw(l, l, 0, this.ctx);
                }
                this.ctx.restore();
            });
            toReturn.push(this.canvas);
        });
        return toReturn;
    }
}

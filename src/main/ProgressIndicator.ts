import { progressOpacity } from './consts';
import EqContent from '../layout/EqContent';
import { line } from './helpers';

/**
 * Given a canvas, draws a line at the bottom to indicate
 * the current completion.
 */
export default class ProgressIndicator {
    
    private ctx: CanvasRenderingContext2D;
    private backgroundFill: string;

    /**
     * Create a new ProgressIndicator drawing
     * to a canvas.
     * @param canvas The canvas to draw to.
     * @param backgroundFill The color to fill the background with. Each frame,
     * the Progress Indicator erases itself independently to the rest of the canvas.
     */
    constructor(canvas: HTMLCanvasElement, backgroundFill: string) {
        this.ctx = canvas.getContext("2d");
        this.backgroundFill = backgroundFill;
    }

    /**
     * Draw the line on the canvas at some level of 
     * completion.
     * @param completion The completion as a decimal.
     * @param width The width of the canvas to draw on.
     * @param height The height of the canvas to draw on.
     */
    public draw(completion: number, width: number, height: number) {
        const color = EqContent.colors['default'];
        this.ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + progressOpacity + ')';
        this.ctx.fillStyle = this.backgroundFill;
        this.ctx.fillRect(0, height - 2, width, 2);
        line(0, height - 1, width * completion, height - 1, this.ctx);
    }

}
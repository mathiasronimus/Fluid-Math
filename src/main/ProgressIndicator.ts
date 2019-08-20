import { progressOpacity } from './consts';
import EqContent from '../layout/EqContent';
import { line } from './helpers';

/**
 * Given a canvas, draws an arc at some circumference
 * to indicate the completion of the animation. I.E
 * nothing is 0% complete, a circle is 100% complete.
 */
export default class ProgressIndicator {
    
    private ctx: CanvasRenderingContext2D;

    /**
     * Create a new ProgressIndicator drawing
     * to a canvas.
     * @param canvas The canvas to draw to.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d");
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
        line(0, height - 1, width * completion, height - 1, this.ctx);
    }

}
import C from './consts';
import EqContent from '../layout/EqContent';

/**
 * Given a canvas, draws an arc at some circumference
 * to indicate the completion of the animation. I.E
 * nothing is 0% complete, a circle is 100% complete.
 */
export default class ProgressIndicator {
    
    private ctx: CanvasRenderingContext2D;

    // Radius of the circle
    private static readonly RADIUS = C.restartAndProgressSize / 2;

    // Center of the circle (x and y)
    private static readonly CENTER = (C.restartAndProgressPadding + C.restartAndProgressSize) / 2;

    // Start of the filled arc
    private static readonly START_Y = ProgressIndicator.CENTER - ProgressIndicator.RADIUS;

    // Total dimensions
    public static readonly DIMEN = C.restartAndProgressPadding + C.restartAndProgressSize;


    /**
     * Create a new ProgressIndicator drawing
     * to a canvas.
     * @param canvas The canvas to draw to.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d");
    }

    /**
     * Draw the arc on the canvas at some level of 
     * completion.
     * @param completion The completion as a decimal.
     */
    public draw(completion: number) {
        this.ctx.clearRect(0, 0, ProgressIndicator.DIMEN, ProgressIndicator.DIMEN);
        const color = EqContent.colors['default'];
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + C.progressOpacity + ')';
        this.ctx.beginPath();
        this.ctx.moveTo(ProgressIndicator.CENTER, ProgressIndicator.CENTER);
        this.ctx.lineTo(ProgressIndicator.CENTER, ProgressIndicator.START_Y);
        this.ctx.arc(   
            ProgressIndicator.CENTER, 
            ProgressIndicator.CENTER, 
            ProgressIndicator.RADIUS, 
            -Math.PI / 2, 
            Math.PI * 2 * completion - Math.PI / 2
        );
        this.ctx.lineTo(ProgressIndicator.CENTER, ProgressIndicator.CENTER);
        this.ctx.fill();
    }

}
import C from './consts';

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

    // Right of the circle
    private static readonly RIGHT_X = ProgressIndicator.RADIUS + ProgressIndicator.CENTER;

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
     * Given a completion value, return the co-ordinates on
     * the circle where the filled arc will end.
     * @param completion The completion as a decimal.
     */
    private getEnd(completion: number): [number, number] {
        // Angle from vertical:
        // a = completion * 2PI
        // cos(a) = y/r
        // y = r * cos(a)
        // sin(a) = x/r
        // x = r * sin(a)
        const angleFromVert = completion * Math.PI * 2;
        const rad = ProgressIndicator.RADIUS;
        return [rad * Math.sin(angleFromVert) + ProgressIndicator.CENTER, -rad * Math.cos(angleFromVert) + ProgressIndicator.CENTER];
    }

    /**
     * Draw the arc on the canvas at some level of 
     * completion.
     * @param completion The completion as a decimal.
     */
    public draw(completion: number) {
        this.ctx.clearRect(0, 0, ProgressIndicator.DIMEN, ProgressIndicator.DIMEN);
        this.ctx.fillStyle = C.progressFill;
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
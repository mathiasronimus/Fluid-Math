import EqComponent from "./EqComponent";
import Padding from "./Padding";
import C from '../main/consts';

export default abstract class EqContent extends EqComponent {

    private color: number[];
    private opacity: number;

    constructor(padding: Padding) {
        super(padding);
        this.color = C.colors['default'];
        this.opacity = C.normalOpacity;
    }

    /**
     * Draws the content on the canvas. Should
     * draw with the content centered on (0, 0).
     * Animations will transform this to the correct
     * position. There is no need to call save() or
     * restore(), animations handle this too.
     * 
     * @param width The width to draw at.
     * @param height The height to draw at.
     * @param ctx The context of the canvas to draw on.
     */
    abstract draw(width: number, height: number, ctx: CanvasRenderingContext2D);

    protected setFill(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
    }

    /**
     * Checks if this content has a different
     * color to the argument.
     * 
     * @param newColor The color to check.
     */
    hasDifferentColor(newColor: number[]): boolean {
        return  newColor[0] !== this.color[0] ||
                newColor[1] !== this.color[1] ||
                newColor[2] !== this.color[2];
    }

    setColor(newColor: number[]): void {
        this.color = newColor;
    }

    getColor(): number[] {
        return this.color;
    }

    setOpacity(newOpacity: number): void {
        this.opacity = newOpacity;
    }

    getOpacity(): number {
        return this.opacity;
    }
}
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import C from '../main/consts';
import LayoutState from "../animation/LayoutState";

export default abstract class EqContent<L extends LayoutState> extends EqComponent {

    private color: number[];
    private opacity: number;

    constructor(padding: Padding) {
        super(padding);
        this.color = C.colors['default'];
        this.opacity = C.normalOpacity;
    }

    /**
     * Draws the content on the canvas. 
     * There is no need to call save() or
     * restore(), animations handle this.
     * 
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    draw(before: L, after: L, progress: number, ctx: CanvasRenderingContext2D) {
        let invProg = 1 - progress;
        let x = before.tlx * invProg + after.tlx * progress;
        let y = before.tly * invProg + after.tly * progress;
        let width = before.width * invProg + after.width * progress;
        let height = before.height * invProg + after.height * progress;
        let scale = before.scale * invProg + after.scale * progress;
        ctx.translate(x + width / 2, y + height / 2);
        ctx.scale(scale, scale);
        this.setCtxStyle(ctx);
    }

    /**
     * Sets a graphics context to have
     * the color and opacity of this content.
     * 
     * @param ctx The graphics context.
     */
    protected setCtxStyle(ctx: CanvasRenderingContext2D) {
        let style = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
        ctx.fillStyle = style;
        ctx.strokeStyle = style;
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
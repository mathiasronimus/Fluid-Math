import EqComponent from "./EqComponent";
import Padding from "./Padding";
import C from '../main/consts';
import ContentLayoutState from "../animation/ContentLayoutState";

export default abstract class EqContent<L extends ContentLayoutState> extends EqComponent<L> {

    protected ref: string;
    //Whether to interpolate color and opacity
    //during the current animation.
    protected interpColor = true;

    constructor(padding: Padding, ref: string) {
        super(padding);
        this.ref = ref;
    }

    /**
     * Sets up the Canvas by performing
     * transformations and style changes.
     * Subclasses should call the method as
     * defined here, then draw themselves
     * centered on (0, 0). Returns width
     * and height to allow them 
     * to do this.
     * There is no need to call save() or
     * restore(), animations handle this.
     * 
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    protected setupCtx(before: L, after: L, progress: number, ctx: CanvasRenderingContext2D): [number, number] {
        let invProg = 1 - progress;
        let x = before.tlx * invProg + after.tlx * progress;
        let y = before.tly * invProg + after.tly * progress;
        let width = before.width * invProg + after.width * progress;
        let height = before.height * invProg + after.height * progress;
        let scale = before.scale * invProg + after.scale * progress;
        ctx.translate(x + width / 2, y + height / 2);
        ctx.scale(scale, scale);
        this.setupCtxStyle(before, after, progress, ctx);
        return [width, height];
    }

    /**
     * Interpolates color and opacity and sets up the
     * canvas to draw with the right color and opacity.
     * 
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    protected setupCtxStyle(before: L, after: L, progress: number, ctx: CanvasRenderingContext2D): void {
        if (progress === 0) {
            //Check whether to interpolate color at start of animation
            let colB = before.color;
            let colA = after.color;
            this.interpColor =  colB[0] !== colA[0] ||
            colB[1] !== colA[1] ||
            colB[2] !== colA[2] ||
            before.opacity !== after.opacity;
        }
        let color = before.color;
        let opacity = before.opacity;
        if (this.interpColor) {
            let invProg = 1 - progress;
            let r = before.color[0] * invProg + after.color[0] * progress;
            let g = before.color[1] * invProg + after.color[1] * progress;
            let b = before.color[2] * invProg + after.color[2] * progress;
            let a = before.opacity * invProg + after.opacity * progress;
            color = [Math.round(r), Math.round(g), Math.round(b)];
            opacity = a;
        }
        this.setCtxStyle(ctx, color, opacity);
    }

    /**
     * Draws the content on the canvas.
     * 
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    abstract draw(before: L, after: L, progress: number, ctx: CanvasRenderingContext2D);

    /**
     * Sets a graphics context to have
     * a certain color and opacity.
     * 
     * @param ctx The graphics context.
     * @param color The color.
     * @param opacity The opacity.
     */
    protected setCtxStyle(ctx: CanvasRenderingContext2D, color: number[], opacity: number) {
        let style = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + opacity + ")";
        ctx.fillStyle = style;
        ctx.strokeStyle = style;
    }

    /**
     * Given a colors object, determine what
     * color this content should be.
     * 
     * @param colorObj The colors object for a step.
     */
    protected getColorForContent(colorObj: object): number[] {
        if (colorObj !== undefined && colorObj[this.ref] !== undefined) {
            //A color is specified
            return C.colors[colorObj[this.ref]];
        } else {
            //A color isn't specified, use default
            return C.colors['default'];
        }
    }

    /**
     * Gets the opacity for this content
     * at a step.
     * 
     * @param opacityObj The opacities object for a step.
     */
    protected getOpacityForContent(opacityObj: object): number {
        if (opacityObj !== undefined && opacityObj[this.ref] !== undefined) {
            //Opacity specified
            return opacityObj[this.ref];
        } else {
            //No opacity specified
            return C.normalOpacity;
        }
    }

    /**
     * Set the content to not interpolate color
     * until setupCtx is called with progress = 0.
     */
    interpColorOff() {
        this.interpColor = false;
    }

    getRef() {
        return this.ref;
    }
}
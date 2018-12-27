import EqComponent from "./EqComponent";
import Padding from "./Padding";
import C from '../main/consts';

export default abstract class EqContent extends EqComponent {

    private color: number[];
    private opacity: number;

    constructor(padding: Padding) {
        super(padding);
        this.color = C.defaultColor;
        this.opacity = C.normalOpacity;
    }

    protected setFill(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + "," + this.opacity + ")";
    }

    setColor(newColor: number[]): void {
        this.color = newColor;
    }

    setOpacity(newOpacity: number): void {
        this.opacity = newOpacity;
    }
}
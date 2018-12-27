import Padding from './Padding';
import LayoutState from '../animation/Frame';
import EqComponent from './EqComponent';
import C from '../main/consts';
import EqContent from './EqContent';

const padding: Padding = Padding.even(C.termPadding);
const color = "rgba(0, 0, 0, 0.85)";

export default class Term extends EqContent {

    private text: string;
    private ascent: number;

    constructor(text: string, ctx, ctxWidth: number, ctxHeight: number) {
        //At the time of term initialization, layout is unknown.
        super(padding);
        let textMetrics = ctx.measureText(text);
        this.fixedWidth = textMetrics.width + padding.width();

        //Draw the text on the canvas to measure ascent and descent
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctxWidth, ctxHeight);
        ctx.fillStyle = "black";
        ctx.fillText(text, 0, ctxHeight / 2);

        let image = ctx.getImageData(0, 0, textMetrics.width, ctxHeight);
        let imageData = image.data;
        
        //Go down until we find text
        let i = 0;
        while (++i < imageData.length && imageData[i] === 255);
        let ascent = i / (image.width * 4);
        
        //Go up until we find text
        i = imageData.length - 1;
        while (--i > 0 && imageData[i] === 255);
        let descent = i / (image.width * 4);
        
        this.fixedHeight = (descent - ascent) + this.padding.height();
        this.ascent = ctxHeight / 2 - ascent;
        this.text = text;
    }
    
    protected calcHeight(): number {
        return this.fixedHeight;
    }
    
    protected calcWidth(): number {
        return this.fixedWidth;
    }
    
    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = 
            new LayoutState(parentLayout, this, tlx, tly, this.fixedWidth, this.fixedHeight, currScale);
        layouts.push(state);
        return state;
    }
    
    draw(f: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.translate(f.tlx + f.width / 2, f.tly + f.height / 2);
        ctx.scale(f.scale, f.scale);
        this.setFill(ctx);
        ctx.fillText(this.text, -f.width / 2 + this.padding.left, -f.height / 2 + this.padding.top + this.ascent);
    }

    shouldAnimate() {
        return true;
    }

    interpolate(otherComp: EqComponent, amount: number): EqComponent {
        return this;
    }

}
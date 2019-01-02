import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import C from '../main/consts';
import { line } from '../main/helpers';

export default class VBox extends EqContainer {

    constructor(children: EqComponent[], padding: Padding) {
        super(children, padding);
    }

    protected calcHeight(): number {
        let totalHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
            totalHeight += this.children[i].getHeight();
        }
        return totalHeight + this.padding.height();
    }

    protected calcWidth(): number {
        let maxWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
            let childWidth = this.children[i].getWidth();
            if (childWidth > maxWidth) {
                maxWidth = childWidth;
            }
        }
        return maxWidth + this.padding.width();
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

        //Outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let pad = C.creatorVBoxPadding;

        //Middle border, top and bottom
        ctx.setLineDash([5]);
        line(l.tlx, l.tly + pad / 2, l.tlx + l.width, l.tly + pad / 2, ctx);
        line(l.tlx, l.tly + l.height - pad / 2, l.tlx + l.width, l.tly + l.height - pad / 2, ctx);

        //Inner border, top and bottom
        ctx.setLineDash([]);
        line(l.tlx, l.tly + pad, l.tlx + l.width, l.tly + pad, ctx);
        line(l.tlx, l.tly + l.height - pad, l.tlx + l.width, l.tly + l.height - pad, ctx);

        ctx.strokeStyle = "#000";
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        const innerWidth = this.getWidth() - this.padding.width();
        let upToY = tly + this.padding.top;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childWidth = currChild.getWidth();

            //Position child in the middle horizontally
            let childTLX = (innerWidth - childWidth) / 2 + this.padding.left + tlx;
            upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale).height;
        }

        layouts.push(state);

        return state;
    }
}
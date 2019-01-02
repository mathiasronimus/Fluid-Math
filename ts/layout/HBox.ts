import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import { line } from '../main/helpers';

export default class HBox extends EqContainer {

    constructor(children: EqComponent[], padding: Padding) {
        super(children, padding);
    }

    protected calcHeight(): number {
        let maxHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();
            if (childHeight > maxHeight) {
                maxHeight = childHeight;
            }
        }
        return maxHeight + this.padding.height();
    }

    protected calcWidth(): number {
        let totalWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            totalWidth += currChild.getWidth();
        }
        return totalWidth + this.padding.width();
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

        //Outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let pad = C.creatorHBoxPadding;

        //Middle border, top and bottom
        ctx.setLineDash([5]);
        line(l.tlx + pad / 2, l.tly, l.tlx + pad / 2, l.tly + l.height, ctx);
        line(l.tlx + l.width - pad / 2, l.tly, l.tlx + l.width - pad / 2, l.tly + l.height, ctx);

        //Inner border, top and bottom
        ctx.setLineDash([]);
        line(l.tlx + pad, l.tly, l.tlx + pad, l.tly + l.height, ctx);
        line(l.tlx + l.width - pad, l.tly, l.tlx + l.width - pad, l.tly + l.height, ctx);

        ctx.strokeStyle = "#000";
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        const innerHeight = this.getHeight() - this.padding.height();
        let upToX = tlx + this.padding.left;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
            upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale).width;
        }


        layouts.push(state);

        return state;
    }
}
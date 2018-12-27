import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import LayoutState from '../animation/Frame';
import Padding from './Padding';

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
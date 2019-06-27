import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import { Map, tri, line } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController from '../main/CanvasController';
import HDivider from './HDivider';
import Radical from './Radical';
import { LinearContainerFormat } from '../main/FileFormat';

export default class HBox extends LinearContainer<LayoutState> {

    constructor(children: EqComponent<any>[], padding: Padding) {
        super(children, padding);
        this.width = this.calcWidth();
        this.height = this.calcHeight();
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

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorObj: Object): LayoutState {
        let state = 
            new LayoutState(parentLayout, this, 
                            tlx, tly, 
                            this.getWidth() * currScale, 
                            this.getHeight() * currScale, 
                            currScale);
        const innerHeight = (this.getHeight() - this.padding.height()) * currScale;
        let upToX = tlx + this.padding.left * currScale;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight() * currScale;

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
            upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale, opacityObj, colorObj).width;
        }

        layouts.set(this, state);

        return state;
    }
}
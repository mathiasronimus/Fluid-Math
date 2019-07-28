import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import C from '../main/consts';
import { line, Map, tri } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController, { MouseEventCallback } from '../main/CanvasController';
import Radical from './Radical';
import { LinearContainerFormat } from '../main/FileFormat';
import EqContent from './EqContent';

export default class VBox extends LinearContainer<LayoutState> {

    constructor(children: EqComponent<any>[], padding: Padding) {
        super(children, padding);
        this.width = this.calcWidth();
        this.height = this.calcHeight();
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

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object,
                mouseEnter: Map<LayoutState, MouseEventCallback>, 
                mouseExit: Map<LayoutState, MouseEventCallback>, 
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {
        let state = new LayoutState(parentLayout, this, tlx, tly, 
                                    this.getWidth() * currScale, 
                                    this.getHeight() * currScale, 
                                    currScale);
        const innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        let upToY = tly + this.padding.top * currScale;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childWidth = currChild.getWidth() * currScale;

            //Position child in the middle horizontally
            let childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            upToY += currChild.addLayout(   state, layouts, 
                                            childTLX, upToY, currScale, 
                                            opacityObj, colorsObj,
                                            mouseEnter, mouseExit, mouseClick,
                                            tempContent).height;
        }

        layouts.set(this, state);

        return state;
    }
}
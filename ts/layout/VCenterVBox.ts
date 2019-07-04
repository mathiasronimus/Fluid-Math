import VBox from "./VBox";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import LayoutState from '../animation/LayoutState';
import { Map } from '../main/helpers';
import { MouseEventCallback } from "../main/CanvasController";
import EqContent from "./EqContent";

/**
 * VBox used at the root of the layout hierarchy.
 * Vertically centers the children
 * as well as horizontally centering.
 */
export default class VCenterVBox extends VBox {

    private totalChildHeight: number;

    constructor(children: EqComponent<any>[], padding: Padding) {
        super(children, padding);
        this.calcChildHeight();
    }

    private calcChildHeight() {
        // Calculate total child height
        this.totalChildHeight = 0;
        this.children.forEach(child => {
            this.totalChildHeight += child.getHeight();
        });
    }

    recalcDimensions() {
        this.calcChildHeight();
        super.recalcDimensions();
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
        let upToY = tly + this.padding.top * currScale + (this.getHeight() - this.totalChildHeight) / 2;

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
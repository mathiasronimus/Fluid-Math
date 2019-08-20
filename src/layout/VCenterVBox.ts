import VBox from "./VBox";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import LayoutState from '../animation/LayoutState';
import { Map, parseContainerChildren } from '../main/helpers';
import { MouseEventCallback } from "../main/CanvasController";
import EqContent from "./EqContent";
import { Container } from "../main/ComponentModel";
import { LinearContainerFormat } from "../main/FileFormat";
import { defaultRootVBoxPadding, defaultVBoxPadding } from '../main/consts';

/**
 * VBox used at the root of the layout hierarchy.
 * Vertically centers the children
 * as well as horizontally centering.
 * Decorator defined here to avoid circular
 * dependency between this and VBox.
 */
@Container({
    typeString: 'vbox',
    parse: (containerObj, depth, contentGetter, containerGetter, inf) => {
        // Return VBox from file
        const format = containerObj as LinearContainerFormat;
        const children = parseContainerChildren(format.children, depth + 1, containerGetter, contentGetter);
        // Allocate extra padding if at root of layout
        const padding = depth === 0 ? defaultRootVBoxPadding : Padding.even(defaultVBoxPadding);
        // Center vertically if at root of layout
        if (inf['fixedHeights'] && depth === 0) {
           return new VCenterVBox(children, padding);
        } else {
            return new VBox(children, padding);
        }
    }
})
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
        super.recalcDimensions();
        this.calcChildHeight();
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
        let upToY = tly + (this.getHeight() - this.totalChildHeight) / 2;

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
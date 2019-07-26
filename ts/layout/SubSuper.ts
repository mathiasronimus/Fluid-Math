import EqContainer from "./EqContainer";
import HBox from "./HBox";
import Padding from "./Padding";
import C from '../main/consts';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import EqContent from './EqContent';
import CanvasController, { MouseEventCallback } from '../main/CanvasController';
import { line, Map } from "../main/helpers";
import { SubSuperContainerFormat } from "../main/FileFormat";

/**
 * Lays out components in a way that
 * enables exponents (top) and subscripts
 * (bottom).
 */
export default class SubSuper extends EqContainer<LayoutState> {

    protected top: HBox;
    protected middle: HBox;
    protected bottom: HBox;

    //The proportion that the top and bottom portrude from the middle
    protected portrusionProportion: number;
    //The vertical amount the top portrudes from the middle
    private topPortrusion: number;
    //The vertical amount the bottom portrudes from the middle
    private bottomPortrusion: number;

    constructor(top: HBox, middle: HBox, bottom: HBox, portrusion: number, padding: Padding) {
        super(padding);
        this.portrusionProportion = portrusion;
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;
        this.recalcPortrusion();
        this.height = this.calcHeight();
        this.width = this.calcWidth();
    }

    protected recalcPortrusion() {
        this.topPortrusion = this.top.getHeight() * C.expScale * this.portrusionProportion;
        this.bottomPortrusion = this.bottom.getHeight() * C.expScale * this.portrusionProportion;
    }

    recalcDimensions() {
        this.top.recalcDimensions();
        this.middle.recalcDimensions();
        this.bottom.recalcDimensions();
        this.recalcPortrusion();
        super.recalcDimensions();
    }

    getMainTextLine(): [number, number] {
        const middleLine = this.middle.getMainTextLine();
        // Add the y position of the middle inside this container
        const toAdd = this.topPortrusion + this.padding.top;
        middleLine[0] += toAdd;
        middleLine[1] += toAdd;
        return middleLine;
    }

    protected calcWidth(): number {
        //Width of the right portion, ie the top and bottom
        let rightWidth = Math.max(this.top.getWidth() * C.expScale, this.bottom.getWidth() * C.expScale);
        return this.middle.getWidth() + rightWidth + this.padding.width();
    }

    protected calcHeight(): number {
        return    this.middle.getHeight() 
                + this.topPortrusion
                + this.bottomPortrusion
                + this.padding.height();
    }

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object,
                mouseEnter: Map<LayoutState, MouseEventCallback>, 
                mouseExit: Map<LayoutState, MouseEventCallback>, 
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {
                    
        let layout = new LayoutState(   parentLayout, this, tlx, tly, 
                                        this.getWidth() * currScale, 
                                        this.getHeight() * currScale, 
                                        currScale);
        //Add the middle
        let middleLayout = this.middle.addLayout(  
            layout, layouts, 
            tlx + this.padding.left * currScale, 
            tly + (this.topPortrusion + this.padding.top) * currScale, 
            currScale,
            opacityObj, colorsObj,
            mouseEnter, mouseExit, mouseClick,
            tempContent
        );
        let rightX = middleLayout.tlx + middleLayout.width;

        //Add the top
        this.top.addLayout( 
            layout, layouts,
            rightX,
            tly + this.padding.top * currScale, 
            currScale * C.expScale,
            opacityObj, colorsObj,
            mouseEnter, mouseExit, mouseClick,
            tempContent
        );

        //Add the bottom
        this.bottom.addLayout(  
            layout, layouts,
            rightX, 
            tly + layout.height - (this.padding.bottom + this.bottom.getHeight() * C.expScale) * currScale,
            currScale * C.expScale,
            opacityObj, colorsObj,
            mouseEnter, mouseExit, mouseClick,
            tempContent
        );

        //Add own
        layouts.set(this, layout);
        return layout;
    }
}
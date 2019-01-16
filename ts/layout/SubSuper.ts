import EqContainer from "./EqContainer";
import HBox from "./HBox";
import Padding from "./Padding";
import C from '../main/consts';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import EqContent from './EqContent';
import CanvasController from '../main/CanvasController';

/**
 * Lays out components in a way that
 * enables exponents (top) and subscripts
 * (bottom).
 */
export default class SubSuper extends EqContainer {

    private top: HBox;
    private middle: HBox;
    private bottom: HBox;

    //The vertical amount the top and bottom portrude from the middle
    private portrusion: number;
    //The vertical distance between the bottom of the top and the top of the bottom
    private rightMiddleHeight: number;

    constructor(top: HBox, middle: HBox, bottom: HBox, padding: Padding) {
        super(padding);
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;

        let maxHeight = Math.max(this.top.getHeight() * C.expScale, this.bottom.getHeight() * C.expScale);
        this.portrusion = maxHeight * C.expPortrusion;
        this.rightMiddleHeight = this.calcHeight() - maxHeight * 2;
    }

    protected calcWidth(): number {
        //Width of the right portion, ie the top and bottom
        let rightWidth = Math.max(this.top.getWidth() * C.expScale, this.bottom.getWidth() * C.expScale);
        return this.middle.getWidth() + rightWidth + this.padding.width();
    }

    protected calcHeight(): number {
        return this.middle.getHeight() + this.portrusion * 2 + this.padding.height();
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let layout = 
            new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        
        //Add the middle
        let middleLayout = 
            this.middle.addLayout(  layout, layouts, 
                                    tlx + this.padding.left, 
                                    tly + this.portrusion + this.padding.top, 
                                    currScale);

        let rightX = middleLayout.tlx + middleLayout.width;

        //Add the top
        let topLayout = this.top.addLayout( layout, layouts,
                                            rightX,
                                            tly + this.padding.top, 
                                            currScale * C.expScale);

        //Add the bottom
        this.bottom.addLayout(  layout, layouts,
                                rightX,
                                layout.tly + layout.height / 2 + this.rightMiddleHeight / 2,
                                currScale * C.expScale);

        //Add own
        layouts.push(layout);
        return layout;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {

    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {

    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {

    }

    toStepLayout(controller: CanvasController): Object {
        return null;
    }

    delete(toDelete: EqComponent) {

    }

    forEachUnder(forEach: (content: EqContent<any>) => void) {

    }
}
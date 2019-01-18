import EqContainer from "./EqContainer";
import HBox from "./HBox";
import Padding from "./Padding";
import C from '../main/consts';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import EqContent from './EqContent';
import CanvasController from '../main/CanvasController';
import { line } from "../main/helpers";

/**
 * Lays out components in a way that
 * enables exponents (top) and subscripts
 * (bottom).
 */
export default class SubSuper extends EqContainer {

    private top: HBox;
    private middle: HBox;
    private bottom: HBox;

    //The vertical amount the top portrudes from the middle
    private topPortrusion: number;
    //The amount of blank space above the top
    private topBlank: number; 
    //The vertical amount the bottom portrudes from the middle
    private bottomPortrusion: number;
    //The amount of blank space below the bottom
    private bottomBlank: number;
    //The vertical distance between the bottom of the top and the top of the bottom
    private rightMiddleHeight: number;

    constructor(top: HBox, middle: HBox, bottom: HBox, padding: Padding) {
        super(padding);
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;

        this.topPortrusion = this.top.getHeight() * C.expScale * C.expPortrusion;
        this.bottomPortrusion = this.bottom.getHeight() * C.expScale * C.expPortrusion;
        if (this.topPortrusion > this.bottomPortrusion) {
            this.topBlank = 0;
            this.bottomBlank = this.topPortrusion - this.bottomPortrusion;
        } else {
            this.bottomBlank = 0;
            this.topBlank = this.bottomPortrusion - this.topPortrusion;
        }
        this.rightMiddleHeight = 
            this.middle.getHeight() + this.topPortrusion + this.bottomPortrusion
            - (this.top.getHeight() * C.expScale + this.bottom.getHeight() * C.expScale);
    }

    protected calcWidth(): number {
        //Width of the right portion, ie the top and bottom
        let rightWidth = Math.max(this.top.getWidth() * C.expScale, this.bottom.getWidth() * C.expScale);
        return this.middle.getWidth() + rightWidth + this.padding.width();
    }

    protected calcHeight(): number {
        return    this.middle.getHeight() 
                + this.topPortrusion + this.topBlank
                + this.bottomPortrusion + this.bottomBlank
                + this.padding.height();
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let layout = 
            new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        
        //Add the middle
        let middleLayout = 
            this.middle.addLayout(  layout, layouts, 
                                    tlx + this.padding.left, 
                                    tly + this.topPortrusion + this.topBlank + this.padding.top, 
                                    currScale);

        let rightX = middleLayout.tlx + middleLayout.width;

        //Add the top
        let topLayout = this.top.addLayout( layout, layouts,
                                            rightX,
                                            tly + this.padding.top + this.topBlank, 
                                            currScale * C.expScale);

        //Add the bottom
        this.bottom.addLayout(  layout, layouts,
                                rightX, 
                                tly + layout.height - this.padding.bottom - this.bottomBlank - this.bottom.getHeight() * C.expScale,
                                currScale * C.expScale);

        //Add own
        layouts.push(layout);
        return layout;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        //Draw the outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        //Draw inner dashed lines
        ctx.setLineDash(C.creatorLineDash);
        //Left line
        line(   l.tlx + this.padding.left,
                l.tly,
                l.tlx + this.padding.left,
                l.tly + l.height,
                ctx);
        //Right line
        line(   l.tlx + l.width - this.padding.right,
                l.tly,
                l.tlx + l.width - this.padding.right,
                l.tly + l.height,
                ctx);

        ctx.restore();
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        if (x - clickedLayout.tlx < this.padding.left) {
            let container = clickedLayout.layoutParent.component as EqContainer;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right) {
            let container = clickedLayout.layoutParent.component as EqContainer;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else {
            throw "Can't add inside a SubSuper container.";
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        throw "Can't add more children to a SubSuper container.";
    }

    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'subSuper';
        toReturn['top'] = EqContainer.childrenToStepLayout(this.top.getChildren(), controller);
        toReturn['middle'] = EqContainer.childrenToStepLayout(this.middle.getChildren(), controller);
        toReturn['bottom'] = EqContainer.childrenToStepLayout(this.bottom.getChildren(), controller);
        return toReturn;
    }

    delete(toDelete: EqComponent) {
        throw "Can't delete children from a SubSuper container.";
    }

    forEachUnder(forEach: (content: EqContent<any>) => void) {
        this.top.forEachUnder(forEach);
        this.middle.forEachUnder(forEach);
        this.bottom.forEachUnder(forEach);
    }
}
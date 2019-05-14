import EqContainer from "./EqContainer";
import HBox from "./HBox";
import Padding from "./Padding";
import C from '../main/consts';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import EqContent from './EqContent';
import CanvasController from '../main/CanvasController';
import { line, Map } from "../main/helpers";
import { SubSuperContainerFormat } from "../main/FileFormat";

/**
 * Lays out components in a way that
 * enables exponents (top) and subscripts
 * (bottom).
 */
export default class SubSuper extends EqContainer<LayoutState> {

    private top: HBox;
    private middle: HBox;
    private bottom: HBox;

    //The proportion that the top and bottom portrude from the middle
    private portrusionProportion: number;
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

    // Used in creator: What to save portrusionProportion as.
    private savePortrusionAs: number;

    constructor(top: HBox, middle: HBox, bottom: HBox, portrusion: number, padding: Padding) {
        super(padding);
        this.portrusionProportion = portrusion;
        this.top = top;
        this.middle = middle;
        this.bottom = bottom;

        this.topPortrusion = this.top.getHeight() * C.expScale * this.portrusionProportion;
        this.bottomPortrusion = this.bottom.getHeight() * C.expScale * this.portrusionProportion;
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
        this.width = this.calcWidth();
        this.height = this.calcHeight();
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

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): LayoutState {
        let layout = new LayoutState(   parentLayout, this, tlx, tly, 
                                        this.getWidth() * currScale, 
                                        this.getHeight() * currScale, 
                                        currScale);
        //Add the middle
        let middleLayout = this.middle.addLayout(  
            layout, layouts, 
            tlx + this.padding.left * currScale, 
            tly + (this.topPortrusion + this.topBlank + this.padding.top) * currScale, 
            currScale,
            opacityObj, colorsObj
        );
        let rightX = middleLayout.tlx + middleLayout.width;

        //Add the top
        this.top.addLayout( 
            layout, layouts,
            rightX,
            tly + (this.padding.top + this.topBlank) * currScale, 
            currScale * C.expScale,
            opacityObj, colorsObj
        );

        //Add the bottom
        this.bottom.addLayout(  
            layout, layouts,
            rightX, 
            tly + layout.height - (this.padding.bottom + this.bottomBlank + this.bottom.getHeight() * C.expScale) * currScale,
            currScale * C.expScale,
            opacityObj, colorsObj
        );

        //Add own
        layouts.set(this, layout);
        return layout;
    }

    addVertically() {
        return false;
    }

    addHorizontally() {
        return false;
    }

    addBefore(e: EqComponent<any>, b: EqComponent<any>) {
        return;
    }

    addAfter(e: EqComponent<any>, b: EqComponent<any>) {
        return;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        //Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        ctx.restore();
        super.creatorDraw(l, ctx);
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        if (x - clickedLayout.tlx < this.padding.left * clickedLayout.scale) {
            let container = clickedLayout.layoutParent.component as EqContainer<any>;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right * clickedLayout.scale) {
            let container = clickedLayout.layoutParent.component as EqContainer<any>;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        } else {
            return;
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        return;
    }

    toStepLayout(controller: CanvasController): SubSuperContainerFormat {
        let toReturn: SubSuperContainerFormat = {
            type: 'subSuper',
            top: EqContainer.childrenToStepLayout(this.top.getChildren(), controller),
            middle: EqContainer.childrenToStepLayout(this.middle.getChildren(), controller),
            bottom: EqContainer.childrenToStepLayout(this.bottom.getChildren(), controller)
        };
        if (this.savePortrusionAs) {
            if (this.savePortrusionAs !== C.defaultExpPortrusion) {
                toReturn['portrusion'] = this.savePortrusionAs;
            }    
            this.savePortrusionAs = undefined;
        } else if (this.portrusionProportion !== C.defaultExpPortrusion) {
            toReturn['portrusion'] = this.portrusionProportion;
        }
        return toReturn;
    }

    delete(toDelete: EqComponent<any>) {
        throw "Can't delete children from a SubSuper container.";
    }

    forEachUnder(forEach: (content: EqContent<any>) => void) {
        this.top.forEachUnder(forEach);
        this.middle.forEachUnder(forEach);
        this.bottom.forEachUnder(forEach);
    }

    /**
     * Save this SubSuper as having
     * a particular portrusion proportion. The
     * next time toStepLayout is called, this
     * number will be saved, but this container
     * isn't considered to have the proportion.
     * @param saveAs What to save portrusion as.
     */
    savePortrusion(saveAs: number) {
        this.savePortrusionAs = saveAs;
    }
}
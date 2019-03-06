import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import C from '../main/consts';
import { line, Map, tri } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController from '../main/CanvasController';
import Radical from './Radical';

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

    protected addHorizontally() {
        return false;
    }

    protected addVertically() {
        return true;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        //Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let padD = C.creatorContainerPadding;
        let pad = new Padding(padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);     
        
        //Vertical lines
        let y1 = l.tly + pad.top / 2;
        let y2 = l.tly + l.height - pad.bottom / 2;
        let x1 = l.tlx + pad.left / 2;
        let x2 = l.tlx + l.width - pad.right / 2;
        line(x1, y1, x1, y2, ctx);
        line(x2, y1, x2, y2, ctx);

        //Carets
        ctx.fillStyle = C.creatorCaretFillStyle;

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top * 0.75);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.top * 0.75);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        //Carets that depend on parent
        super.creatorDraw(l, ctx);

        ctx.restore();
    }

    addClick(l: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        let scl = l.scale;
        let realPad = new Padding(
            C.creatorContainerPadding.top * scl,
            C.creatorContainerPadding.left * scl,
            C.creatorContainerPadding.bottom * scl,
            C.creatorContainerPadding.right * scl
        );
        // Create mock layout states to use like rectangles
        let innerTop = new LayoutState(
            undefined, undefined, 
            l.tlx + realPad.left / 2, 
            l.tly + realPad.top / 2, 
            l.width - realPad.width() / 2, 
            realPad.height() / 4, 
            1
        );
        let innerBot = new LayoutState(
            undefined, undefined, 
            l.tlx + realPad.left / 2, 
            l.tly + l.height - realPad.bottom, 
            l.width - realPad.width() / 2, 
            realPad.height() / 4, 
            1
        );
        if (innerTop.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        } else if (innerBot.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        } else {
            // Click wasn't on inner part, add adjacent to parent container.
            super.addClick(l, x, y, toAdd);
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        this.addValid(toAdd);
        if (clickedLayout.onTop(y)) {
            //Add top
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            //Add bottom
            this.addAfter(toAdd, clickedLayout.component);
        }
    }
    
    addValid(toAdd: EqComponent<any>) {
        if (toAdd instanceof Radical) {
            throw new Error("Radicals can only be added inside a root container.");
        }
    }

    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'vbox';
        toReturn['children'] = EqContainer.childrenToStepLayout(this.children, controller);
        return toReturn;
    }

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): LayoutState {
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
            upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale, opacityObj, colorsObj).height;
        }

        layouts.set(this, state);

        return state;
    }
}
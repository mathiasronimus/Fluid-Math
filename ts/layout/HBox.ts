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

    addVertically() {
        return false;
    }

    addHorizontally() {
        return true;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        //Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let pad = C.creatorContainerPadding.scale(l.scale);

        //Horizontal lines
        let x1 = l.tlx + pad.left / 2;
        let x2 = l.tlx + l.width - pad.right / 2;
        let y1 = l.tly + pad.top / 2;
        let y2 = l.tly + l.height - pad.bottom / 2;
        line(x1, y1, x2, y1, ctx);
        line(x1, y2, x2, y2, ctx);

        //Carets
        ctx.fillStyle = C.creatorCaretFillStyle;

        ctx.save();
        ctx.translate(l.tlx + pad.left * 0.75, l.tly + l.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width - pad.right * 0.75, l.tly + l.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        //Carets that depend on parent
        super.creatorDraw(l, ctx);

        ctx.restore();
    }

    addClick(l: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        let pad = C.creatorContainerPadding.scale(l.scale);
        // Make fake layout states to use like rectangles
        let innerLeft = new LayoutState(
            undefined,
            undefined,
            l.tlx + pad.left / 2,
            l.tly + pad.top / 2,
            pad.width() / 4,
            l.height - pad.height() / 2,
            1
        );
        let innerRight = new LayoutState(
            undefined,
            undefined,
            l.tlx + l.width - pad.right,
            l.tly + pad.top / 2,
            pad.width() / 4,
            l.height - pad.height() / 2,
            1
        );
        if (innerLeft.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        } else if (innerRight.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        } else {
            super.addClick(l, x, y, toAdd);
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        this.addValid(toAdd);
        if (clickedLayout.onLeft(x)) {
            //Add left
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            //Add right
            this.addAfter(toAdd, clickedLayout.component);
        }
    }
    
    addValid(toAdd: EqComponent<any>) {
        if (toAdd instanceof HDivider) {
            throw new Error("Fraction lines can only be added inside a vertical container.");
        }
        if (toAdd instanceof Radical) {
            throw new Error("Radicals can only be added inside a root container.");
        }
    }

    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'hbox';
        toReturn['children'] = EqContainer.childrenToStepLayout(this.children, controller);
        return toReturn;
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
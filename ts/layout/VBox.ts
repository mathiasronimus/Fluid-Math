import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';
import C from '../main/consts';
import { line } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController from '../main/CanvasController';

export default class VBox extends LinearContainer {

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

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        //Outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let padD = C.creatorVBoxPadding;
        let pad = new Padding(padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);

        //Middle border, top and bottom
        ctx.setLineDash(C.creatorLineDash);
        line(   l.tlx, 
                l.tly + pad.top / 2, 
                l.tlx + l.width, 
                l.tly + pad.top / 2, 
                ctx);
        line(   l.tlx, 
                l.tly + l.height - pad.bottom / 2, 
                l.tlx + l.width, 
                l.tly + l.height - pad.bottom / 2, 
                ctx);

        //Inner border, top and bottom
        ctx.setLineDash([]);
        line(   l.tlx, 
                l.tly + pad.top, 
                l.tlx + l.width, 
                l.tly + pad.top, 
                ctx);
        line(   l.tlx, 
                l.tly + l.height - pad.bottom, 
                l.tlx + l.width,
                l.tly + l.height - pad.bottom, 
                ctx);

        ctx.restore();
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        if (clickedLayout.onTop(y)) {
            if (y - clickedLayout.tly <= (C.creatorVBoxPadding.top / 2) * clickedLayout.scale) {
                //Outer border, add adjacent
                let containerLayout = clickedLayout.layoutParent;
                if (containerLayout === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerLayout.component as EqContainer;
                    container.addClickOnChild(clickedLayout, x, y, toAdd);
                }
            } else {
                //Inside border, add inside
                this.children.unshift(toAdd);
            }
        }
        else {
            //On bottom
            if (clickedLayout.tly + clickedLayout.height - y 
                <= 
                (C.creatorVBoxPadding.bottom / 2) * clickedLayout.scale) {
                //Outer border, add adjacent
                let containerLayout = clickedLayout.layoutParent;
                if (containerLayout === undefined) {
                    throw "no containing frame";
                }
                else {
                    let container = containerLayout.component as EqContainer;
                    container.addClickOnChild(clickedLayout, x, y, toAdd);
                }
            }
            else {
                //Inner border, add inside
                this.children.push(toAdd);
            }
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        if (clickedLayout.onTop(y)) {
            //Add top
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            //Add bottom
            this.addAfter(toAdd, clickedLayout.component);
        }
    }

    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'vbox';
        toReturn['children'] = EqContainer.childrenToStepLayout(this.children, controller);
        return toReturn;
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
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
            upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale).height;
        }

        layouts.push(state);

        return state;
    }
}
import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import { line, Map } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController from '../main/CanvasController';

export default class HBox extends LinearContainer {

    constructor(children: EqComponent[], padding: Padding) {
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

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = C.creatorContainerStroke;

        //Outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let padD = C.creatorHBoxPadding;
        let pad = new Padding(padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);

        //Middle border, top and bottom
        ctx.setLineDash(C.creatorLineDash);
        line(   l.tlx + pad.left / 2, 
                l.tly, 
                l.tlx + pad.left / 2, 
                l.tly + l.height, 
                ctx);
        line(   l.tlx + l.width - pad.right / 2, 
                l.tly, 
                l.tlx + l.width - pad.right / 2, 
                l.tly + l.height, 
                ctx);

        //Inner border, top and bottom
        ctx.setLineDash([]);
        line(   l.tlx + pad.left, 
                l.tly, 
                l.tlx + pad.left, 
                l.tly + l.height, 
                ctx);
        line(   l.tlx + l.width - pad.right, 
                l.tly, 
                l.tlx + l.width - pad.right, 
                l.tly + l.height, 
                ctx);

        ctx.strokeStyle = "#000";
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        if (clickedLayout.onLeft(x)) {
            if (x - clickedLayout.tlx <= (C.creatorHBoxPadding.left / 2) * clickedLayout.scale) {
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
                this.children.unshift(toAdd);
            }
        } else {
            //On right
            if (    clickedLayout.tlx + clickedLayout.width - x 
                    <= 
                    (C.creatorHBoxPadding.right / 2) * clickedLayout.scale) {
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
        if (clickedLayout.onLeft(x)) {
            //Add left
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            //Add right
            this.addAfter(toAdd, clickedLayout.component);
        }
    }

    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'hbox';
        toReturn['children'] = EqContainer.childrenToStepLayout(this.children, controller);
        return toReturn;
    }

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent, LayoutState>, 
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
import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import C from '../main/consts';
import { line } from '../main/helpers';
import LinearContainer from './LinearContainer';
import CanvasController from '../main/CanvasController';

export default class HBox extends LinearContainer {

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
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';

        //Outer border
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        let pad = C.creatorHBoxPadding;

        //Middle border, top and bottom
        ctx.setLineDash([5]);
        line(l.tlx + pad / 2, l.tly, l.tlx + pad / 2, l.tly + l.height, ctx);
        line(l.tlx + l.width - pad / 2, l.tly, l.tlx + l.width - pad / 2, l.tly + l.height, ctx);

        //Inner border, top and bottom
        ctx.setLineDash([]);
        line(l.tlx + pad, l.tly, l.tlx + pad, l.tly + l.height, ctx);
        line(l.tlx + l.width - pad, l.tly, l.tlx + l.width - pad, l.tly + l.height, ctx);

        ctx.strokeStyle = "#000";
    }

    addClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent) {
        if (clickedLayout.onLeft(x)) {
            if (x - clickedLayout.tlx <= C.creatorHBoxPadding / 2) {
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
            if (clickedLayout.tlx + clickedLayout.width - x <= C.creatorHBoxPadding / 2) {
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
        toReturn['children'] = this.childrentoStepLayout(controller);
        return toReturn;
    }

    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        const innerHeight = this.getHeight() - this.padding.height();
        let upToX = tlx + this.padding.left;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
            upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale).width;
        }

        layouts.push(state);

        return state;
    }
}
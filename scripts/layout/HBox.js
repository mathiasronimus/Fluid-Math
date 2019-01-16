define(["require", "exports", "../animation/LayoutState", "../main/consts", "../main/helpers", "./LinearContainer"], function (require, exports, LayoutState_1, consts_1, helpers_1, LinearContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HBox extends LinearContainer_1.default {
        calcHeight() {
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
        calcWidth() {
            let totalWidth = 0;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                totalWidth += currChild.getWidth();
            }
            return totalWidth + this.padding.width();
        }
        creatorDraw(l, ctx) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            //Outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            let pad = consts_1.default.creatorHBoxPadding;
            //Middle border, top and bottom
            ctx.setLineDash([5]);
            helpers_1.line(l.tlx + pad / 2, l.tly, l.tlx + pad / 2, l.tly + l.height, ctx);
            helpers_1.line(l.tlx + l.width - pad / 2, l.tly, l.tlx + l.width - pad / 2, l.tly + l.height, ctx);
            //Inner border, top and bottom
            ctx.setLineDash([]);
            helpers_1.line(l.tlx + pad, l.tly, l.tlx + pad, l.tly + l.height, ctx);
            helpers_1.line(l.tlx + l.width - pad, l.tly, l.tlx + l.width - pad, l.tly + l.height, ctx);
            ctx.strokeStyle = "#000";
        }
        addClick(clickedLayout, x, y, toAdd) {
            if (clickedLayout.onLeft(x)) {
                if (x - clickedLayout.tlx <= consts_1.default.creatorHBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        container.addClickOnChild(clickedLayout, x, y, toAdd);
                    }
                }
                else {
                    //Inner border, add inside
                    this.children.unshift(toAdd);
                }
            }
            else {
                //On right
                if (clickedLayout.tlx + clickedLayout.width - x <= consts_1.default.creatorHBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        container.addClickOnChild(clickedLayout, x, y, toAdd);
                    }
                }
                else {
                    //Inner border, add inside
                    this.children.push(toAdd);
                }
            }
        }
        addClickOnChild(clickedLayout, x, y, toAdd) {
            if (clickedLayout.onLeft(x)) {
                //Add left
                this.addBefore(toAdd, clickedLayout.component);
            }
            else {
                //Add right
                this.addAfter(toAdd, clickedLayout.component);
            }
        }
        toStepLayout(controller) {
            let toReturn = {};
            toReturn['type'] = 'hbox';
            toReturn['children'] = this.childrentoStepLayout(controller);
            return toReturn;
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
            const innerHeight = (this.getHeight() - this.padding.height()) * currScale;
            let upToX = tlx + this.padding.left * currScale;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                let childHeight = currChild.getHeight() * currScale;
                //Position child in the middle vertically
                let childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
                upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale).width;
            }
            layouts.push(state);
            return state;
        }
    }
    exports.default = HBox;
});

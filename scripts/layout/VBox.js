define(["require", "exports", "./EqContainer", "../animation/LayoutState", "./Padding", "../main/consts", "../main/helpers", "./LinearContainer"], function (require, exports, EqContainer_1, LayoutState_1, Padding_1, consts_1, helpers_1, LinearContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class VBox extends LinearContainer_1.default {
        constructor(children, padding) {
            super(children, padding);
            this.width = this.calcWidth();
            this.height = this.calcHeight();
        }
        calcHeight() {
            let totalHeight = 0;
            for (let i = 0; i < this.children.length; i++) {
                totalHeight += this.children[i].getHeight();
            }
            return totalHeight + this.padding.height();
        }
        calcWidth() {
            let maxWidth = 0;
            for (let i = 0; i < this.children.length; i++) {
                let childWidth = this.children[i].getWidth();
                if (childWidth > maxWidth) {
                    maxWidth = childWidth;
                }
            }
            return maxWidth + this.padding.width();
        }
        creatorDraw(l, ctx) {
            ctx.save();
            ctx.strokeStyle = consts_1.default.creatorContainerStroke;
            //Outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            let padD = consts_1.default.creatorVBoxPadding;
            let pad = new Padding_1.default(padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);
            //Middle border, top and bottom
            ctx.setLineDash(consts_1.default.creatorLineDash);
            helpers_1.line(l.tlx, l.tly + pad.top / 2, l.tlx + l.width, l.tly + pad.top / 2, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad.bottom / 2, l.tlx + l.width, l.tly + l.height - pad.bottom / 2, ctx);
            //Inner border, top and bottom
            ctx.setLineDash([]);
            helpers_1.line(l.tlx, l.tly + pad.top, l.tlx + l.width, l.tly + pad.top, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad.bottom, l.tlx + l.width, l.tly + l.height - pad.bottom, ctx);
            ctx.restore();
        }
        addClick(clickedLayout, x, y, toAdd) {
            if (clickedLayout.onTop(y)) {
                if (y - clickedLayout.tly <= (consts_1.default.creatorVBoxPadding.top / 2) * clickedLayout.scale) {
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
                    //Inside border, add inside
                    this.children.unshift(toAdd);
                }
            }
            else {
                //On bottom
                if (clickedLayout.tly + clickedLayout.height - y
                    <=
                        (consts_1.default.creatorVBoxPadding.bottom / 2) * clickedLayout.scale) {
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
            if (clickedLayout.onTop(y)) {
                //Add top
                this.addBefore(toAdd, clickedLayout.component);
            }
            else {
                //Add bottom
                this.addAfter(toAdd, clickedLayout.component);
            }
        }
        toStepLayout(controller) {
            let toReturn = {};
            toReturn['type'] = 'vbox';
            toReturn['children'] = EqContainer_1.default.childrenToStepLayout(this.children, controller);
            return toReturn;
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
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
    exports.default = VBox;
});

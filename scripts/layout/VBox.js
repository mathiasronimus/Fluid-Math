define(["require", "exports", "./EqContainer", "../animation/LayoutState", "../main/consts", "../main/helpers"], function (require, exports, EqContainer_1, LayoutState_1, consts_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class VBox extends EqContainer_1.default {
        constructor(children, padding) {
            super(children, padding);
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
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            //Outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            let pad = consts_1.default.creatorVBoxPadding;
            //Middle border, top and bottom
            ctx.setLineDash([5]);
            helpers_1.line(l.tlx, l.tly + pad / 2, l.tlx + l.width, l.tly + pad / 2, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad / 2, l.tlx + l.width, l.tly + l.height - pad / 2, ctx);
            //Inner border, top and bottom
            ctx.setLineDash([]);
            helpers_1.line(l.tlx, l.tly + pad, l.tlx + l.width, l.tly + pad, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad, l.tlx + l.width, l.tly + l.height - pad, ctx);
            ctx.strokeStyle = "#000";
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
            const innerWidth = this.getWidth() - this.padding.width();
            let upToY = tly + this.padding.top;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                let childWidth = currChild.getWidth();
                //Position child in the middle horizontally
                let childTLX = (innerWidth - childWidth) / 2 + this.padding.left + tlx;
                upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale).height;
            }
            layouts.push(state);
            return state;
        }
    }
    exports.default = VBox;
});

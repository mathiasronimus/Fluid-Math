define(["require", "exports", "./EqContainer", "../animation/LayoutState", "../main/consts", "../main/helpers"], function (require, exports, EqContainer_1, LayoutState_1, consts_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HBox extends EqContainer_1.default {
        constructor(children, padding) {
            super(children, padding);
        }
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
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
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
    exports.default = HBox;
});

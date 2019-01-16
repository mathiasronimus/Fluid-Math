define(["require", "exports", "./EqContainer", "../main/consts", "../animation/LayoutState"], function (require, exports, EqContainer_1, consts_1, LayoutState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Lays out components in a way that
     * enables exponents (top) and subscripts
     * (bottom).
     */
    class SubSuper extends EqContainer_1.default {
        constructor(top, middle, bottom, padding) {
            super(padding);
            this.top = top;
            this.middle = middle;
            this.bottom = bottom;
            let maxHeight = Math.max(this.top.getHeight() * consts_1.default.expScale, this.bottom.getHeight() * consts_1.default.expScale);
            this.portrusion = maxHeight * consts_1.default.expPortrusion;
            this.rightMiddleHeight = this.calcHeight() - maxHeight * 2;
        }
        calcWidth() {
            //Width of the right portion, ie the top and bottom
            let rightWidth = Math.max(this.top.getWidth() * consts_1.default.expScale, this.bottom.getWidth() * consts_1.default.expScale);
            return this.middle.getWidth() + rightWidth + this.padding.width();
        }
        calcHeight() {
            return this.middle.getHeight() + this.portrusion * 2 + this.padding.height();
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let layout = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
            //Add the middle
            let middleLayout = this.middle.addLayout(layout, layouts, tlx + this.padding.left, tly + this.portrusion + this.padding.top, currScale);
            let rightX = middleLayout.tlx + middleLayout.width;
            //Add the top
            let topLayout = this.top.addLayout(layout, layouts, rightX, tly + this.padding.top, currScale * consts_1.default.expScale);
            //Add the bottom
            this.bottom.addLayout(layout, layouts, rightX, layout.tly + layout.height / 2 + this.rightMiddleHeight / 2, currScale * consts_1.default.expScale);
            //Add own
            layouts.push(layout);
            return layout;
        }
        creatorDraw(l, ctx) {
        }
        addClick(clickedLayout, x, y, toAdd) {
        }
        addClickOnChild(clickedLayout, x, y, toAdd) {
        }
        toStepLayout(controller) {
            return null;
        }
        delete(toDelete) {
        }
        forEachUnder(forEach) {
        }
    }
    exports.default = SubSuper;
});

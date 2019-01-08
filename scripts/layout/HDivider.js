define(["require", "exports", "./EqContent", "../animation/LayoutState", "../main/helpers"], function (require, exports, EqContent_1, LayoutState_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HDivider extends EqContent_1.default {
        constructor(padding) {
            super(padding);
            this.fixedHeight = 1 + this.padding.height();
            //For layout purposes, the divider
            //has no width. It stretches to fill
            //its container.
            this.fixedWidth = 0;
        }
        //These won't be called due to fixed dimensions
        calcWidth() { return 0; }
        calcHeight() { return 0; }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            //Set x to align left with parent
            let x = parentLayout.tlx;
            let width = parentLayout.width;
            let height = this.getHeight();
            let state = new LayoutState_1.default(parentLayout, this, x, tly, width, height, currScale);
            layouts.push(state);
            return state;
        }
        draw(before, after, progress, ctx) {
            super.draw(before, after, progress, ctx);
            let width = before.width * (1 - progress) + after.width * progress;
            helpers_1.line(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
        }
    }
    exports.default = HDivider;
});

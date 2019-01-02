define(["require", "exports", "./Padding", "../animation/LayoutState", "../main/consts", "./EqContent"], function (require, exports, Padding_1, LayoutState_1, consts_1, EqContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const padding = Padding_1.default.even(consts_1.default.termPadding);
    class Term extends EqContent_1.default {
        constructor(text, width, height, ascent) {
            //At the time of term initialization, layout is unknown.
            super(padding);
            this.fixedWidth = width + this.padding.width();
            this.fixedHeight = height + this.padding.height();
            this.ascent = ascent;
            this.text = text;
        }
        calcHeight() {
            return this.fixedHeight;
        }
        calcWidth() {
            return this.fixedWidth;
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.fixedWidth, this.fixedHeight, currScale);
            layouts.push(state);
            return state;
        }
        draw(width, height, ctx) {
            this.setFill(ctx);
            ctx.fillText(this.text, -width / 2 + this.padding.left, -height / 2 + this.padding.top + this.ascent);
        }
        shouldAnimate() {
            return true;
        }
        interpolate(otherComp, amount) {
            return this;
        }
    }
    exports.default = Term;
});

define(["require", "exports", "./Padding", "../main/consts", "./EqContent", "../animation/TermLayoutState"], function (require, exports, Padding_1, consts_1, EqContent_1, TermLayoutState_1) {
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
            let state = new TermLayoutState_1.default(parentLayout, this, tlx, tly, this.fixedWidth, this.fixedHeight, currScale);
            layouts.push(state);
            return state;
        }
        draw(before, after, progress, ctx) {
            super.draw(before, after, progress, ctx);
            ctx.fillText(this.text, -before.width / 2 + this.padding.left, -before.height / 2 + this.padding.top + this.ascent);
        }
    }
    exports.default = Term;
});

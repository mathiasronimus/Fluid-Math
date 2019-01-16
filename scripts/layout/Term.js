define(["require", "exports", "./Padding", "../main/consts", "./EqContent", "../animation/TermLayoutState"], function (require, exports, Padding_1, consts_1, EqContent_1, TermLayoutState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Term extends EqContent_1.default {
        constructor(text, width, height, ascent) {
            //At the time of term initialization, layout is unknown.
            super(consts_1.default.termPadding);
            this.halfInnerWidth = width / 2;
            this.halfInnerHeight = height / 2;
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
            let state = new TermLayoutState_1.default(parentLayout, this, tlx, tly, this.fixedWidth * currScale, this.fixedHeight * currScale, currScale);
            layouts.push(state);
            return state;
        }
        draw(before, after, progress, ctx) {
            this.setupCtx(before, after, progress, ctx);
            //Interpolate padding if it's changed
            let padding = before.padding === after.padding
                ? before.padding //No padding change, don't bother calculating
                : Padding_1.default.between(before.padding, after.padding, progress); //Interpolate padding
            ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
        }
    }
    exports.default = Term;
});

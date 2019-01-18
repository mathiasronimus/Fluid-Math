define(["require", "exports", "../main/consts", "./EqContent", "../animation/TermLayoutState"], function (require, exports, consts_1, EqContent_1, TermLayoutState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Term extends EqContent_1.default {
        constructor(text, width, height, ascent) {
            //At the time of term initialization, layout is unknown.
            super(consts_1.default.termPadding);
            this.halfInnerWidth = width / 2;
            this.halfInnerHeight = height / 2;
            this.width = width + this.padding.width();
            this.height = height + this.padding.height();
            this.ascent = ascent;
            this.text = text;
        }
        calcHeight() {
            return this.height;
        }
        calcWidth() {
            return this.width;
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new TermLayoutState_1.default(parentLayout, this, tlx, tly, this.width * currScale, this.height * currScale, currScale);
            layouts.push(state);
            return state;
        }
        draw(before, after, progress, ctx) {
            this.setupCtx(before, after, progress, ctx);
            ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
        }
    }
    exports.default = Term;
});

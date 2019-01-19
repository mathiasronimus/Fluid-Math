define(["require", "exports", "../main/consts", "./EqContent", "../animation/TermLayoutState"], function (require, exports, consts_1, EqContent_1, TermLayoutState_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Term extends EqContent_1.default {
        constructor(text, widths, heights, ascents) {
            //At the time of term initialization, layout is unknown.
            super(consts_1.default.termPadding);
            this.widths = widths;
            this.heights = heights;
            this.halfInnerWidths = this.widths.map(width => width / 2);
            this.halfInnerHeights = this.heights.map(height => height / 2);
            this.ascents = ascents;
            this.recalcDimensions();
            window.addEventListener('resize', this.recalcDimensions.bind(this));
            this.text = text;
        }
        recalcDimensions() {
            this.height = this.calcHeight();
            this.width = this.calcWidth();
            let tier = window['currentWidthTier'];
            this.halfInnerWidth = this.halfInnerWidths[tier];
            this.halfInnerHeight = this.halfInnerHeights[tier];
            this.ascent = this.ascents[tier];
        }
        calcHeight() {
            let tier = window['currentWidthTier'];
            return this.heights[tier] + this.padding.height();
        }
        calcWidth() {
            let tier = window['currentWidthTier'];
            return this.widths[tier] + this.padding.width();
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

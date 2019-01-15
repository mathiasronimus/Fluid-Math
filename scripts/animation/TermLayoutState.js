define(["require", "exports", "./LayoutState", "../main/consts"], function (require, exports, LayoutState_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TermLayoutState extends LayoutState_1.default {
        constructor() {
            super(...arguments);
            this.padding = consts_1.default.termPadding;
        }
        /**
         * Change this layout state to
         * reflect a Term in a tight
         * layout. This reduces padding
         * and width.
         *
         * @param widthDiff The difference in width between a tight and normal term.
         */
        tighten(widthDiff) {
            this.padding = consts_1.default.tightTermPadding;
            this.width -= widthDiff;
        }
        /**
         * Returns a new Layout State the same
         * as this one, but with a scaling of 0.
         */
        withZeroScale() {
            return new TermLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0);
        }
    }
    exports.default = TermLayoutState;
});

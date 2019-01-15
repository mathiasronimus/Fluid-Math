define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Padding {
        constructor(top, left, bottom, right) {
            this.top = top;
            this.left = left;
            this.bottom = bottom;
            this.right = right;
        }
        height() {
            return this.top + this.bottom;
        }
        width() {
            return this.left + this.right;
        }
        /**
         * Return a new Padding with same insets on
         * each side.
         * @param amount The amount of inset on each side.
         */
        static even(amount) {
            return new Padding(amount, amount, amount, amount);
        }
        /**
         * Interpolate between two paddings,
         * returning the result.
         *
         * @param before The initial padding.
         * @param after The ending padding.
         * @param between The interpolation percentage as a decimal.
         */
        static between(before, after, between) {
            let inv = 1 - between;
            let top = before.top * inv + after.top * between;
            let left = before.left * inv + after.left * between;
            let bottom = before.bottom * inv + after.bottom * between;
            let right = before.right * inv + after.right * between;
            return new Padding(top, left, bottom, right);
        }
    }
    exports.default = Padding;
});

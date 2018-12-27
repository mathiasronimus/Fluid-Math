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
    }
    exports.default = Padding;
});

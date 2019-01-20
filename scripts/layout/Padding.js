define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var Padding = (function () {
        function Padding(top, left, bottom, right) {
            this.top = top;
            this.left = left;
            this.bottom = bottom;
            this.right = right;
        }
        Padding.prototype.height = function () {
            return this.top + this.bottom;
        };
        Padding.prototype.width = function () {
            return this.left + this.right;
        };
        /**
         * Return a new Padding with same insets on
         * each side.
         * @param amount The amount of inset on each side.
         */
        Padding.even = function (amount) {
            return new Padding(amount, amount, amount, amount);
        };
        return Padding;
    }());
    exports["default"] = Padding;
});

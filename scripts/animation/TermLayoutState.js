var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./LayoutState", "../main/consts"], function (require, exports, LayoutState_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    var TermLayoutState = (function (_super) {
        __extends(TermLayoutState, _super);
        function TermLayoutState() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.padding = consts_1["default"].termPadding;
            return _this;
        }
        /**
         * Change this layout state to
         * reflect a Term in a tight
         * layout. This reduces padding
         * and width.
         *
         * @param widthDiff The difference in width between a tight and normal term.
         */
        TermLayoutState.prototype.tighten = function (widthDiff) {
            this.padding = consts_1["default"].tightTermPadding;
            this.width -= widthDiff;
        };
        /**
         * Returns a new Layout State the same
         * as this one, but with a scaling of 0.
         */
        TermLayoutState.prototype.withZeroScale = function () {
            return new TermLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0);
        };
        return TermLayoutState;
    }(LayoutState_1["default"]));
    exports["default"] = TermLayoutState;
});

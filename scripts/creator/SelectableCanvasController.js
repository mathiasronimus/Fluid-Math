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
define(["require", "exports", "../main/CanvasController", "../layout/HDivider", "../main/consts"], function (require, exports, CanvasController_1, HDivider_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * A canvas controller that can display
     * certain layouts as being selected.
     */
    var SelectableCanvasController = (function (_super) {
        __extends(SelectableCanvasController, _super);
        function SelectableCanvasController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //The layouts to display as selected.
            _this.selected = [];
            return _this;
        }
        SelectableCanvasController.prototype.redraw = function () {
            var _this = this;
            _super.prototype.redraw.call(this);
            if (this.selected)
                this.selected.forEach(function (s) {
                    _this.ctx.save();
                    _this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                    _this.ctx.fillRect(s.tlx, s.tly, s.width, s.height);
                    _this.ctx.restore();
                });
        };
        /**
         * Given clicked coordinates, find
         * the layout that was clicked. If not
         * found, returns undefined.
         *
         * @param x X-ordinate on the canvas.
         * @param y Y-ordinate on the canvas.
         */
        SelectableCanvasController.prototype.getClickedLayout = function (x, y) {
            var clicked = undefined;
            this.currStates.forEach(function (currState) {
                if (!clicked && currState.contains(x, y)) {
                    clicked = currState;
                }
            });
            return clicked;
        };
        //Override to give h dividers some padding
        SelectableCanvasController.prototype.initContent = function (instructions) {
            _super.prototype.initContent.call(this, instructions);
            this.hDividers = [];
            for (var i = 0; i < instructions['hDividers']; i++) {
                this.hDividers.push(new HDivider_1["default"](consts_1["default"].creatorHDividerPadding, 'h' + i));
            }
        };
        /**
         * Stop showing any components as
         * selected.
         */
        SelectableCanvasController.prototype.emptySelected = function () {
            this.selected = [];
            this.redraw();
        };
        return SelectableCanvasController;
    }(CanvasController_1["default"]));
    exports["default"] = SelectableCanvasController;
});

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
define(["require", "exports", "./SelectableCanvasController"], function (require, exports, SelectableCanvasController_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Canvas controller to facilitate selecting
     * content and passing their references to
     * a function when changed.
     */
    var StepOptionsCanvasController = (function (_super) {
        __extends(StepOptionsCanvasController, _super);
        function StepOptionsCanvasController(container, instructions, onSelectChange, selectionStrategy, startSelected) {
            var _this = _super.call(this, container, instructions) || this;
            _this.onSelectChange = onSelectChange;
            _this.strategy = selectionStrategy;
            _this.canvas.removeEventListener('click', _this.nextStep);
            _this.canvas.addEventListener('click', _this.onClick.bind(_this));
            startSelected
                .map(function (ref) { return _this.getContentFromRef(ref); })
                .map(function (content) { return _this.currStates.get(content); })
                .forEach(function (layout) { return _this.selected.push(layout); });
            _this.redraw();
            return _this;
        }
        StepOptionsCanvasController.prototype.onClick = function (e) {
            var _this = this;
            var canvasX = e.offsetX;
            var canvasY = e.offsetY;
            var clickedLayout = this.getClickedLayout(canvasX, canvasY);
            this.strategy.onSelect(this.selected, clickedLayout);
            this.onSelectChange(this.selected
                .map(function (l) { return l.component; })
                .map(function (c) { return _this.getContentReference(c); }));
            this.redraw();
        };
        return StepOptionsCanvasController;
    }(SelectableCanvasController_1["default"]));
    exports["default"] = StepOptionsCanvasController;
});

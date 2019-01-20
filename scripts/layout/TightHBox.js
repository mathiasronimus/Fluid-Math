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
define(["require", "exports", "./HBox", "../main/consts", "./Term", "../animation/LayoutState", "./EqContainer"], function (require, exports, HBox_1, consts_1, Term_1, LayoutState_1, EqContainer_1) {
    "use strict";
    exports.__esModule = true;
    var widthDiff = consts_1["default"].termPadding.width() - consts_1["default"].tightTermPadding.width();
    var TightHBox = (function (_super) {
        __extends(TightHBox, _super);
        function TightHBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //Override to have right type
        TightHBox.prototype.toStepLayout = function (controller) {
            var toReturn = {};
            toReturn['type'] = 'tightHBox';
            toReturn['children'] = EqContainer_1["default"].childrenToStepLayout(this.children, controller);
            return toReturn;
        };
        //Override to account for reduced width of tight terms.
        TightHBox.prototype.calcWidth = function () {
            var totalWidth = 0;
            var numTerms = 0;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                totalWidth += currChild.getWidth();
                if (currChild instanceof Term_1["default"]) {
                    numTerms++;
                }
            }
            return totalWidth + this.padding.width() - numTerms * widthDiff;
        };
        //Override to reduce term padding.
        TightHBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale) {
            var state = new LayoutState_1["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
            var innerHeight = (this.getHeight() - this.padding.height()) * currScale;
            var upToX = tlx + this.padding.left * currScale;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                var childHeight = currChild.getHeight() * currScale;
                //Position child in the middle vertically
                var childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
                var childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale);
                if (currChild instanceof Term_1["default"]) {
                    childLayout.tighten(widthDiff * currScale);
                }
                upToX += childLayout.width;
            }
            layouts.push(state);
            return state;
        };
        return TightHBox;
    }(HBox_1["default"]));
    exports["default"] = TightHBox;
});

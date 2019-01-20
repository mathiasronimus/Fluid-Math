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
define(["require", "exports", "./EqComponent", "./EqContent"], function (require, exports, EqComponent_1, EqContent_1) {
    "use strict";
    exports.__esModule = true;
    var EqContainer = (function (_super) {
        __extends(EqContainer, _super);
        function EqContainer(padding) {
            return _super.call(this, padding) || this;
        }
        /**
         * Returns an array of children of a container
         * as used in the step layout.
         *
         * @param children The children array.
         * @param controller The canvas controller possessing this container.
         */
        EqContainer.childrenToStepLayout = function (children, controller) {
            var toReturn = [];
            children.forEach(function (comp) {
                if (comp instanceof EqContainer) {
                    toReturn.push(comp.toStepLayout(controller));
                }
                else if (comp instanceof EqContent_1["default"]) {
                    toReturn.push(controller.getContentReference(comp));
                }
                else {
                    throw "unrecognized type " + typeof comp;
                }
            });
            return toReturn;
        };
        return EqContainer;
    }(EqComponent_1["default"]));
    exports["default"] = EqContainer;
});

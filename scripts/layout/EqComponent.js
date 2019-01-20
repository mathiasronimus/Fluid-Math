define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Represents any component (container, content)
     * that takes up space and forms a part of the
     * layout of a step.
     */
    var EqComponent = (function () {
        function EqComponent(padding) {
            this.padding = padding;
        }
        EqComponent.prototype.setWidth = function (newWidth) {
            this.width = newWidth;
        };
        EqComponent.prototype.setHeight = function (newHeight) {
            this.height = newHeight;
        };
        EqComponent.prototype.getWidth = function () {
            return this.width;
        };
        EqComponent.prototype.getHeight = function () {
            return this.height;
        };
        return EqComponent;
    }());
    exports["default"] = EqComponent;
});

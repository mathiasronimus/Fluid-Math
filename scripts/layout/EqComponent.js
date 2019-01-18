define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Represents any component (container, content)
     * that takes up space and forms a part of the
     * layout of a step.
     */
    class EqComponent {
        constructor(padding) {
            this.padding = padding;
        }
        setWidth(newWidth) {
            this.width = newWidth;
        }
        setHeight(newHeight) {
            this.height = newHeight;
        }
        getWidth() {
            return this.width;
        }
        getHeight() {
            return this.height;
        }
    }
    exports.default = EqComponent;
});

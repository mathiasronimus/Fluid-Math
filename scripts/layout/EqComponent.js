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
            this.fixedWidth = -1;
            this.fixedHeight = -1;
            this.padding = padding;
        }
        setFixedWidth(newWidth) {
            this.fixedWidth = newWidth;
        }
        setFixedHeight(newHeight) {
            this.fixedHeight = newHeight;
        }
        getWidth() {
            if (this.fixedWidth < 0) {
                return this.calcWidth();
            }
            else {
                return this.fixedWidth;
            }
        }
        getHeight() {
            if (this.fixedHeight < 0) {
                return this.calcHeight();
            }
            else {
                return this.fixedHeight;
            }
        }
    }
    exports.default = EqComponent;
});

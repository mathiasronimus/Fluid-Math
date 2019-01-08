define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stores how a component should be
     * drawn at a particular step.
     */
    class LayoutState {
        constructor(layoutParent, component, tlx, tly, width, height, scale) {
            this.tlx = tlx;
            this.tly = tly;
            this.width = width;
            this.height = height;
            this.component = component;
            this.layoutParent = layoutParent;
            this.scale = scale;
        }
        /**
         * Checks if this layout contains the
         * specified point.
         *
         * @param x X-ordinate of the point.
         * @param y Y-ordinate of the point.
         */
        contains(x, y) {
            return x >= this.tlx &&
                x <= this.tlx + this.width &&
                y >= this.tly &&
                y <= this.tly + this.height;
        }
        /**
         * Checks if the x-ordinate is on
         * the left half of this layout.
         *
         * @param x The x-ordinate
         */
        onLeft(x) {
            return x <= this.tlx + this.width / 2;
        }
        /**
         * Checks if the y-ordinate is on
         * the top half of this layout.
         *
         * @param y The y-ordinate
         */
        onTop(y) {
            return y <= this.tly + this.height / 2;
        }
        /**
         * Returns a new Layout State the same
         * as this one, but with a scaling of 0.
         */
        withZeroScale() {
            return new LayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0);
        }
    }
    exports.default = LayoutState;
});

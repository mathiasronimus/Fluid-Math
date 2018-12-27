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
        changeScale(amount) {
            return new LayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, this.scale * amount);
        }
        /**
         * Returns a Frame an amount-th way between
         * start and end. For example, amount=0.5 would
         * yield a frame halfway between start and end.
         * When amount = 1, end is returned.
         * When amount = 0, start is returned.
         *
         * @param start The starting Frame.
         * @param end The ending Frame.
         * @param amount The percentage between them as decimal.
         */
        static interpolate(start, end, amount) {
            let invAmount = 1 - amount;
            let newComp = start.component.interpolate(end.component, amount);
            let newTlx = start.tlx * invAmount + end.tlx * amount;
            let newTly = start.tly * invAmount + end.tly * amount;
            let newWidth = start.width * invAmount + end.width * amount;
            let newHeight = start.height * invAmount + end.height * amount;
            let newScale = start.scale * invAmount + end.scale * amount;
            return new LayoutState(start.layoutParent, newComp, newTlx, newTly, newWidth, newHeight, newScale);
        }
    }
    exports.default = LayoutState;
});

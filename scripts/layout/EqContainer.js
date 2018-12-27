define(["require", "exports", "./EqComponent"], function (require, exports, EqComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EqContainer extends EqComponent_1.default {
        constructor(children, padding) {
            super(padding);
            this.children = children;
        }
        getChildren() {
            return this.children;
        }
        //Should never be called
        interpolate(o, a) {
            return undefined;
        }
        /**
         * Containers are not drawn.
         *
         * @param s The layout state.
         * @param ctx The graphics context.
         */
        draw(s, ctx) { }
        /**
         * Containers don't animate.
         */
        shouldAnimate() {
            return false;
        }
    }
    exports.default = EqContainer;
});
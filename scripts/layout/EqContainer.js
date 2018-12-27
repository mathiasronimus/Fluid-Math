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
        draw(f, ctx) {
            //do nothing
        }
        //Containers don't draw anything, their
        //drawables are purely for layout.
        shouldAnimate() {
            return false;
        }
    }
    exports.default = EqContainer;
});

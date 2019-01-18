define(["require", "exports", "./EqComponent", "./EqContent"], function (require, exports, EqComponent_1, EqContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EqContainer extends EqComponent_1.default {
        constructor(padding) {
            super(padding);
        }
        /**
         * Returns an array of children of a container
         * as used in the step layout.
         *
         * @param children The children array.
         * @param controller The canvas controller possessing this container.
         */
        static childrenToStepLayout(children, controller) {
            let toReturn = [];
            children.forEach(comp => {
                if (comp instanceof EqContainer) {
                    toReturn.push(comp.toStepLayout(controller));
                }
                else if (comp instanceof EqContent_1.default) {
                    toReturn.push(controller.getContentReference(comp));
                }
                else {
                    throw "unrecognized type " + typeof comp;
                }
            });
            return toReturn;
        }
    }
    exports.default = EqContainer;
});

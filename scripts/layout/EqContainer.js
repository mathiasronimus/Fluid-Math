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
    }
    exports.default = EqContainer;
});

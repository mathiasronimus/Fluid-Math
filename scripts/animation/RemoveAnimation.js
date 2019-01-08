define(["require", "exports", "../main/consts", "./Animation"], function (require, exports, consts_1, Animation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RemoveAnimation extends Animation_1.default {
        constructor(start, set, ctx) {
            super(consts_1.default.removeDuration, consts_1.default.removeEasing, set, start, start.withZeroScale(), start.component, ctx);
        }
    }
    exports.default = RemoveAnimation;
});

define(["require", "exports", "./Animation", "../main/consts"], function (require, exports, Animation_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MoveAnimation extends Animation_1.default {
        constructor(start, end, set, ctx) {
            super(consts_1.default.moveDuration, consts_1.default.moveEasing, set, start, end, start.component, ctx);
        }
    }
    exports.default = MoveAnimation;
});

define(["require", "exports", "../animation/Animation", "../main/consts"], function (require, exports, Animation_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Animates a component in by scaling it from
     * 0 to its normal size.
     */
    class AddAnimation extends Animation_1.default {
        constructor(end, set, ctx) {
            super(consts_1.default.addDuration, consts_1.default.addEasing, set, end.withZeroScale(), end, end.component, ctx);
        }
    }
    exports.default = AddAnimation;
});

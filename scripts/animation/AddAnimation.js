var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../animation/Animation", "../main/consts"], function (require, exports, Animation_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Animates a component in by scaling it from
     * 0 to its normal size.
     */
    var AddAnimation = (function (_super) {
        __extends(AddAnimation, _super);
        function AddAnimation(end, set, ctx) {
            return _super.call(this, consts_1["default"].addDuration, consts_1["default"].addEasing, set, end.withZeroScale(), end, end.component, ctx) || this;
        }
        return AddAnimation;
    }(Animation_1["default"]));
    exports["default"] = AddAnimation;
});

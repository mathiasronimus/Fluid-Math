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
define(["require", "exports", "./Animation", "../main/consts"], function (require, exports, Animation_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    var ReverseEvalAnimation = (function (_super) {
        __extends(ReverseEvalAnimation, _super);
        function ReverseEvalAnimation(from, to, set, ctx) {
            return _super.call(this, consts_1["default"].moveDuration, consts_1["default"].moveEasing, set, from.withZeroScale(), to, to.component, ctx) || this;
        }
        return ReverseEvalAnimation;
    }(Animation_1["default"]));
    exports["default"] = ReverseEvalAnimation;
});

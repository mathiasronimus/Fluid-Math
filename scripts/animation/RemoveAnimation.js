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
define(["require", "exports", "../main/consts", "./Animation"], function (require, exports, consts_1, Animation_1) {
    "use strict";
    exports.__esModule = true;
    var RemoveAnimation = (function (_super) {
        __extends(RemoveAnimation, _super);
        function RemoveAnimation(start, set, ctx) {
            return _super.call(this, consts_1["default"].removeDuration, consts_1["default"].removeEasing, set, start, start.withZeroScale(), start.component, ctx) || this;
        }
        return RemoveAnimation;
    }(Animation_1["default"]));
    exports["default"] = RemoveAnimation;
});

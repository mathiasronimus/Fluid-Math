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
define(["require", "exports", "./BezierCallback"], function (require, exports, BezierCallback_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * A bezier callback whose step function
     * calls the draw function of content.
     */
    var Animation = (function (_super) {
        __extends(Animation, _super);
        function Animation(duration, easing, set, before, after, component, ctx) {
            var _this = _super.call(this, duration, easing, set) || this;
            _this.before = before;
            _this.after = after;
            _this.component = component;
            _this.ctx = ctx;
            return _this;
        }
        Animation.prototype.step = function (completion) {
            this.ctx.save();
            this.component.draw(this.before, this.after, completion, this.ctx);
            this.ctx.restore();
        };
        return Animation;
    }(BezierCallback_1["default"]));
    exports["default"] = Animation;
});

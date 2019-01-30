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
define(["require", "exports", "./LayoutState"], function (require, exports, LayoutState_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Layout state containing info relevant to
     * content, ie color and opacity.
     */
    var ContentLayoutState = (function (_super) {
        __extends(ContentLayoutState, _super);
        function ContentLayoutState(layoutParent, component, tlx, tly, width, height, scale, color, opacity) {
            var _this = _super.call(this, layoutParent, component, tlx, tly, width, height, scale) || this;
            _this.color = color;
            _this.opacity = opacity;
            return _this;
        }
        /**
         * Returns a new Layout State the same
         * as this one, but with a scaling of 0.
         */
        ContentLayoutState.prototype.withZeroScale = function () {
            return new ContentLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0, this.color, 0);
        };
        return ContentLayoutState;
    }(LayoutState_1["default"]));
    exports["default"] = ContentLayoutState;
});

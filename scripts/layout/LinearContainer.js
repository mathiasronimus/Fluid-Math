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
define(["require", "exports", "./EqContainer", "./EqContent"], function (require, exports, EqContainer_1, EqContent_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Represents a simple linear container
     * whose contents can be represented as
     * a single children array.
     */
    var LinearContainer = (function (_super) {
        __extends(LinearContainer, _super);
        function LinearContainer(children, padding) {
            var _this = _super.call(this, padding) || this;
            _this.children = children;
            return _this;
        }
        /**
         * Add a child before another.
         *
         * @param toAdd The child to add.
         * @param before Add before this child.
         */
        LinearContainer.prototype.addBefore = function (toAdd, before) {
            var index = this.children.indexOf(before);
            this.children.splice(index, 0, toAdd);
        };
        /**
         * Add a child after another.
         *
         * @param toAdd The child to add.
         * @param after Add after this child.
         */
        LinearContainer.prototype.addAfter = function (toAdd, after) {
            var index = this.children.indexOf(after);
            this.children.splice(index + 1, 0, toAdd);
        };
        LinearContainer.prototype.forEachUnder = function (forEach) {
            this.children.forEach(function (child) {
                if (child instanceof EqContent_1["default"]) {
                    //Run the function
                    forEach(child);
                }
                else if (child instanceof EqContainer_1["default"]) {
                    child.forEachUnder(forEach);
                }
                else {
                    throw "unrecognized component type";
                }
            });
        };
        LinearContainer.prototype["delete"] = function (toDelete) {
            this.children.splice(this.children.indexOf(toDelete), 1);
        };
        LinearContainer.prototype.getChildren = function () {
            return this.children;
        };
        return LinearContainer;
    }(EqContainer_1["default"]));
    exports["default"] = LinearContainer;
});

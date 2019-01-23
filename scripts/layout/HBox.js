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
define(["require", "exports", "./EqContainer", "./Padding", "../animation/LayoutState", "../main/consts", "../main/helpers", "./LinearContainer"], function (require, exports, EqContainer_1, Padding_1, LayoutState_1, consts_1, helpers_1, LinearContainer_1) {
    "use strict";
    exports.__esModule = true;
    var HBox = (function (_super) {
        __extends(HBox, _super);
        function HBox(children, padding) {
            var _this = _super.call(this, children, padding) || this;
            _this.width = _this.calcWidth();
            _this.height = _this.calcHeight();
            return _this;
        }
        HBox.prototype.calcHeight = function () {
            var maxHeight = 0;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                var childHeight = currChild.getHeight();
                if (childHeight > maxHeight) {
                    maxHeight = childHeight;
                }
            }
            return maxHeight + this.padding.height();
        };
        HBox.prototype.calcWidth = function () {
            var totalWidth = 0;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                totalWidth += currChild.getWidth();
            }
            return totalWidth + this.padding.width();
        };
        HBox.prototype.creatorDraw = function (l, ctx) {
            ctx.strokeStyle = consts_1["default"].creatorContainerStroke;
            //Outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            var padD = consts_1["default"].creatorHBoxPadding;
            var pad = new Padding_1["default"](padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);
            //Middle border, top and bottom
            ctx.setLineDash(consts_1["default"].creatorLineDash);
            helpers_1.line(l.tlx + pad.left / 2, l.tly, l.tlx + pad.left / 2, l.tly + l.height, ctx);
            helpers_1.line(l.tlx + l.width - pad.right / 2, l.tly, l.tlx + l.width - pad.right / 2, l.tly + l.height, ctx);
            //Inner border, top and bottom
            ctx.setLineDash([]);
            helpers_1.line(l.tlx + pad.left, l.tly, l.tlx + pad.left, l.tly + l.height, ctx);
            helpers_1.line(l.tlx + l.width - pad.right, l.tly, l.tlx + l.width - pad.right, l.tly + l.height, ctx);
            ctx.strokeStyle = "#000";
        };
        HBox.prototype.addClick = function (clickedLayout, x, y, toAdd) {
            if (clickedLayout.onLeft(x)) {
                if (x - clickedLayout.tlx <= (consts_1["default"].creatorHBoxPadding.left / 2) * clickedLayout.scale) {
                    //Outer border, add adjacent
                    var containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        var container = containerLayout.component;
                        container.addClickOnChild(clickedLayout, x, y, toAdd);
                    }
                }
                else {
                    //Inner border, add inside
                    this.children.unshift(toAdd);
                }
            }
            else {
                //On right
                if (clickedLayout.tlx + clickedLayout.width - x
                    <=
                        (consts_1["default"].creatorHBoxPadding.right / 2) * clickedLayout.scale) {
                    //Outer border, add adjacent
                    var containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        var container = containerLayout.component;
                        container.addClickOnChild(clickedLayout, x, y, toAdd);
                    }
                }
                else {
                    //Inner border, add inside
                    this.children.push(toAdd);
                }
            }
        };
        HBox.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
            if (clickedLayout.onLeft(x)) {
                //Add left
                this.addBefore(toAdd, clickedLayout.component);
            }
            else {
                //Add right
                this.addAfter(toAdd, clickedLayout.component);
            }
        };
        HBox.prototype.toStepLayout = function (controller) {
            var toReturn = {};
            toReturn['type'] = 'hbox';
            toReturn['children'] = EqContainer_1["default"].childrenToStepLayout(this.children, controller);
            return toReturn;
        };
        HBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale) {
            var state = new LayoutState_1["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
            var innerHeight = (this.getHeight() - this.padding.height()) * currScale;
            var upToX = tlx + this.padding.left * currScale;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                var childHeight = currChild.getHeight() * currScale;
                //Position child in the middle vertically
                var childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
                upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale).width;
            }
            layouts.set(this, state);
            return state;
        };
        return HBox;
    }(LinearContainer_1["default"]));
    exports["default"] = HBox;
});

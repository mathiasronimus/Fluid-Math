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
define(["require", "exports", "./EqContainer", "../animation/LayoutState", "./Padding", "../main/consts", "../main/helpers", "./LinearContainer"], function (require, exports, EqContainer_1, LayoutState_1, Padding_1, consts_1, helpers_1, LinearContainer_1) {
    "use strict";
    exports.__esModule = true;
    var VBox = (function (_super) {
        __extends(VBox, _super);
        function VBox(children, padding) {
            var _this = _super.call(this, children, padding) || this;
            _this.width = _this.calcWidth();
            _this.height = _this.calcHeight();
            return _this;
        }
        VBox.prototype.calcHeight = function () {
            var totalHeight = 0;
            for (var i = 0; i < this.children.length; i++) {
                totalHeight += this.children[i].getHeight();
            }
            return totalHeight + this.padding.height();
        };
        VBox.prototype.calcWidth = function () {
            var maxWidth = 0;
            for (var i = 0; i < this.children.length; i++) {
                var childWidth = this.children[i].getWidth();
                if (childWidth > maxWidth) {
                    maxWidth = childWidth;
                }
            }
            return maxWidth + this.padding.width();
        };
        VBox.prototype.creatorDraw = function (l, ctx) {
            ctx.save();
            ctx.strokeStyle = consts_1["default"].creatorContainerStroke;
            //Outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            var padD = consts_1["default"].creatorVBoxPadding;
            var pad = new Padding_1["default"](padD.top * l.scale, padD.left * l.scale, padD.bottom * l.scale, padD.right * l.scale);
            //Middle border, top and bottom
            ctx.setLineDash(consts_1["default"].creatorLineDash);
            helpers_1.line(l.tlx, l.tly + pad.top / 2, l.tlx + l.width, l.tly + pad.top / 2, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad.bottom / 2, l.tlx + l.width, l.tly + l.height - pad.bottom / 2, ctx);
            //Inner border, top and bottom
            ctx.setLineDash([]);
            helpers_1.line(l.tlx, l.tly + pad.top, l.tlx + l.width, l.tly + pad.top, ctx);
            helpers_1.line(l.tlx, l.tly + l.height - pad.bottom, l.tlx + l.width, l.tly + l.height - pad.bottom, ctx);
            ctx.restore();
        };
        VBox.prototype.addClick = function (clickedLayout, x, y, toAdd) {
            if (clickedLayout.onTop(y)) {
                if (y - clickedLayout.tly <= (consts_1["default"].creatorVBoxPadding.top / 2) * clickedLayout.scale) {
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
                    //Inside border, add inside
                    this.children.unshift(toAdd);
                }
            }
            else {
                //On bottom
                if (clickedLayout.tly + clickedLayout.height - y
                    <=
                        (consts_1["default"].creatorVBoxPadding.bottom / 2) * clickedLayout.scale) {
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
        VBox.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
            if (clickedLayout.onTop(y)) {
                //Add top
                this.addBefore(toAdd, clickedLayout.component);
            }
            else {
                //Add bottom
                this.addAfter(toAdd, clickedLayout.component);
            }
        };
        VBox.prototype.toStepLayout = function (controller) {
            var toReturn = {};
            toReturn['type'] = 'vbox';
            toReturn['children'] = EqContainer_1["default"].childrenToStepLayout(this.children, controller);
            return toReturn;
        };
        VBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale) {
            var state = new LayoutState_1["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
            var innerWidth = (this.getWidth() - this.padding.width()) * currScale;
            var upToY = tly + this.padding.top * currScale;
            for (var i = 0; i < this.children.length; i++) {
                var currChild = this.children[i];
                var childWidth = currChild.getWidth() * currScale;
                //Position child in the middle horizontally
                var childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
                upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale).height;
            }
            layouts.push(state);
            return state;
        };
        return VBox;
    }(LinearContainer_1["default"]));
    exports["default"] = VBox;
});

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
define(["require", "exports", "./EqContainer", "../main/consts", "../animation/LayoutState", "../main/helpers"], function (require, exports, EqContainer_1, consts_1, LayoutState_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Lays out components in a way that
     * enables exponents (top) and subscripts
     * (bottom).
     */
    var SubSuper = (function (_super) {
        __extends(SubSuper, _super);
        function SubSuper(top, middle, bottom, portrusion, padding) {
            var _this = _super.call(this, padding) || this;
            _this.portrusionProportion = portrusion;
            _this.top = top;
            _this.middle = middle;
            _this.bottom = bottom;
            _this.topPortrusion = _this.top.getHeight() * consts_1["default"].expScale * _this.portrusionProportion;
            _this.bottomPortrusion = _this.bottom.getHeight() * consts_1["default"].expScale * _this.portrusionProportion;
            if (_this.topPortrusion > _this.bottomPortrusion) {
                _this.topBlank = 0;
                _this.bottomBlank = _this.topPortrusion - _this.bottomPortrusion;
            }
            else {
                _this.bottomBlank = 0;
                _this.topBlank = _this.bottomPortrusion - _this.topPortrusion;
            }
            _this.rightMiddleHeight =
                _this.middle.getHeight() + _this.topPortrusion + _this.bottomPortrusion
                    - (_this.top.getHeight() * consts_1["default"].expScale + _this.bottom.getHeight() * consts_1["default"].expScale);
            _this.width = _this.calcWidth();
            _this.height = _this.calcHeight();
            return _this;
        }
        SubSuper.prototype.calcWidth = function () {
            //Width of the right portion, ie the top and bottom
            var rightWidth = Math.max(this.top.getWidth() * consts_1["default"].expScale, this.bottom.getWidth() * consts_1["default"].expScale);
            return this.middle.getWidth() + rightWidth + this.padding.width();
        };
        SubSuper.prototype.calcHeight = function () {
            return this.middle.getHeight()
                + this.topPortrusion + this.topBlank
                + this.bottomPortrusion + this.bottomBlank
                + this.padding.height();
        };
        SubSuper.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale) {
            var layout = new LayoutState_1["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
            //Add the middle
            var middleLayout = this.middle.addLayout(layout, layouts, tlx + this.padding.left * currScale, tly + (this.topPortrusion + this.topBlank + this.padding.top) * currScale, currScale);
            var rightX = middleLayout.tlx + middleLayout.width;
            //Add the top
            this.top.addLayout(layout, layouts, rightX, tly + (this.padding.top + this.topBlank) * currScale, currScale * consts_1["default"].expScale);
            //Add the bottom
            this.bottom.addLayout(layout, layouts, rightX, tly + layout.height - (this.padding.bottom + this.bottomBlank + this.bottom.getHeight() * consts_1["default"].expScale) * currScale, currScale * consts_1["default"].expScale);
            //Add own
            layouts.set(this, layout);
            return layout;
        };
        SubSuper.prototype.creatorDraw = function (l, ctx) {
            ctx.save();
            ctx.strokeStyle = consts_1["default"].creatorContainerStroke;
            //Draw the outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            var padLeft = this.padding.left * l.scale;
            var padRight = this.padding.right * l.scale;
            //Draw inner dashed lines
            ctx.setLineDash(consts_1["default"].creatorLineDash);
            //Left line
            helpers_1.line(l.tlx + padLeft, l.tly, l.tlx + padLeft, l.tly + l.height, ctx);
            //Right line
            helpers_1.line(l.tlx + l.width - padRight, l.tly, l.tlx + l.width - padRight, l.tly + l.height, ctx);
            ctx.restore();
        };
        SubSuper.prototype.addClick = function (clickedLayout, x, y, toAdd) {
            if (x - clickedLayout.tlx < this.padding.left * clickedLayout.scale) {
                var container = clickedLayout.layoutParent.component;
                container.addClickOnChild(clickedLayout, x, y, toAdd);
            }
            else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right * clickedLayout.scale) {
                var container = clickedLayout.layoutParent.component;
                container.addClickOnChild(clickedLayout, x, y, toAdd);
            }
            else {
                throw "Can't add inside a SubSuper container.";
            }
        };
        SubSuper.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
            throw "Can't add more children to a SubSuper container.";
        };
        SubSuper.prototype.toStepLayout = function (controller) {
            var toReturn = {};
            toReturn['type'] = 'subSuper';
            toReturn['top'] = EqContainer_1["default"].childrenToStepLayout(this.top.getChildren(), controller);
            toReturn['middle'] = EqContainer_1["default"].childrenToStepLayout(this.middle.getChildren(), controller);
            toReturn['bottom'] = EqContainer_1["default"].childrenToStepLayout(this.bottom.getChildren(), controller);
            if (this.portrusionProportion !== consts_1["default"].defaultExpPortrusion) {
                toReturn['portrusion'] = this.portrusionProportion;
            }
            return toReturn;
        };
        SubSuper.prototype["delete"] = function (toDelete) {
            throw "Can't delete children from a SubSuper container.";
        };
        SubSuper.prototype.forEachUnder = function (forEach) {
            this.top.forEachUnder(forEach);
            this.middle.forEachUnder(forEach);
            this.bottom.forEachUnder(forEach);
        };
        SubSuper.prototype.setPortrusion = function (newPortrusion) {
            this.portrusionProportion = newPortrusion;
        };
        return SubSuper;
    }(EqContainer_1["default"]));
    exports["default"] = SubSuper;
});

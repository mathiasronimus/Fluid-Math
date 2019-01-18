define(["require", "exports", "./EqContainer", "../main/consts", "../animation/LayoutState", "../main/helpers"], function (require, exports, EqContainer_1, consts_1, LayoutState_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Lays out components in a way that
     * enables exponents (top) and subscripts
     * (bottom).
     */
    class SubSuper extends EqContainer_1.default {
        constructor(top, middle, bottom, padding) {
            super(padding);
            this.top = top;
            this.middle = middle;
            this.bottom = bottom;
            this.topPortrusion = this.top.getHeight() * consts_1.default.expScale * consts_1.default.expPortrusion;
            this.bottomPortrusion = this.bottom.getHeight() * consts_1.default.expScale * consts_1.default.expPortrusion;
            if (this.topPortrusion > this.bottomPortrusion) {
                this.topBlank = 0;
                this.bottomBlank = this.topPortrusion - this.bottomPortrusion;
            }
            else {
                this.bottomBlank = 0;
                this.topBlank = this.bottomPortrusion - this.topPortrusion;
            }
            this.rightMiddleHeight =
                this.middle.getHeight() + this.topPortrusion + this.bottomPortrusion
                    - (this.top.getHeight() * consts_1.default.expScale + this.bottom.getHeight() * consts_1.default.expScale);
        }
        calcWidth() {
            //Width of the right portion, ie the top and bottom
            let rightWidth = Math.max(this.top.getWidth() * consts_1.default.expScale, this.bottom.getWidth() * consts_1.default.expScale);
            return this.middle.getWidth() + rightWidth + this.padding.width();
        }
        calcHeight() {
            return this.middle.getHeight()
                + this.topPortrusion + this.topBlank
                + this.bottomPortrusion + this.bottomBlank
                + this.padding.height();
        }
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let layout = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
            //Add the middle
            let middleLayout = this.middle.addLayout(layout, layouts, tlx + this.padding.left, tly + this.topPortrusion + this.topBlank + this.padding.top, currScale);
            let rightX = middleLayout.tlx + middleLayout.width;
            //Add the top
            let topLayout = this.top.addLayout(layout, layouts, rightX, tly + this.padding.top + this.topBlank, currScale * consts_1.default.expScale);
            //Add the bottom
            this.bottom.addLayout(layout, layouts, rightX, tly + layout.height - this.padding.bottom - this.bottomBlank - this.bottom.getHeight() * consts_1.default.expScale, currScale * consts_1.default.expScale);
            //Add own
            layouts.push(layout);
            return layout;
        }
        creatorDraw(l, ctx) {
            ctx.save();
            ctx.strokeStyle = consts_1.default.creatorContainerStroke;
            //Draw the outer border
            ctx.rect(l.tlx, l.tly, l.width, l.height);
            ctx.stroke();
            //Draw inner dashed lines
            ctx.setLineDash(consts_1.default.creatorLineDash);
            //Left line
            helpers_1.line(l.tlx + this.padding.left, l.tly, l.tlx + this.padding.left, l.tly + l.height, ctx);
            //Right line
            helpers_1.line(l.tlx + l.width - this.padding.right, l.tly, l.tlx + l.width - this.padding.right, l.tly + l.height, ctx);
            ctx.restore();
        }
        addClick(clickedLayout, x, y, toAdd) {
            if (x - clickedLayout.tlx < this.padding.left) {
                let container = clickedLayout.layoutParent.component;
                container.addClickOnChild(clickedLayout, x, y, toAdd);
            }
            else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right) {
                let container = clickedLayout.layoutParent.component;
                container.addClickOnChild(clickedLayout, x, y, toAdd);
            }
            else {
                throw "Can't add inside a SubSuper container.";
            }
        }
        addClickOnChild(clickedLayout, x, y, toAdd) {
            throw "Can't add more children to a SubSuper container.";
        }
        toStepLayout(controller) {
            let toReturn = {};
            toReturn['type'] = 'subSuper';
            toReturn['top'] = EqContainer_1.default.childrenToStepLayout(this.top.getChildren(), controller);
            toReturn['middle'] = EqContainer_1.default.childrenToStepLayout(this.middle.getChildren(), controller);
            toReturn['bottom'] = EqContainer_1.default.childrenToStepLayout(this.bottom.getChildren(), controller);
            return toReturn;
        }
        delete(toDelete) {
            throw "Can't delete children from a SubSuper container.";
        }
        forEachUnder(forEach) {
            this.top.forEachUnder(forEach);
            this.middle.forEachUnder(forEach);
            this.bottom.forEachUnder(forEach);
        }
    }
    exports.default = SubSuper;
});

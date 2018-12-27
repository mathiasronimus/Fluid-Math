define(["require", "exports", "./EqContainer", "../animation/Frame"], function (require, exports, EqContainer_1, Frame_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class HBox extends EqContainer_1.default {
        constructor(children, padding) {
            super(children, padding);
        }
        calcHeight() {
            let maxHeight = 0;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                let childHeight = currChild.getHeight();
                if (childHeight > maxHeight) {
                    maxHeight = childHeight;
                }
            }
            return maxHeight + this.padding.height();
        }
        calcWidth() {
            let totalWidth = 0;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                totalWidth += currChild.getWidth();
            }
            return totalWidth + this.padding.width();
        }
        addDrawable(parentFrame, drawables, tlx, tly, currScale) {
            let frame = new Frame_1.default(parentFrame, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
            const innerHeight = this.getHeight() - this.padding.height();
            let upToX = tlx + this.padding.left;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                let childHeight = currChild.getHeight();
                //Position child in the middle vertically
                let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
                upToX += currChild.addDrawable(frame, drawables, upToX, childTLY, currScale).width;
            }
            drawables.push(frame);
            return frame;
        }
    }
    exports.default = HBox;
});

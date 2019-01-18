define(["require", "exports", "./HBox", "../main/consts", "./Term", "../animation/LayoutState", "./EqContainer"], function (require, exports, HBox_1, consts_1, Term_1, LayoutState_1, EqContainer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const widthDiff = consts_1.default.termPadding.width() - consts_1.default.tightTermPadding.width();
    class TightHBox extends HBox_1.default {
        //Override to have right type
        toStepLayout(controller) {
            let toReturn = {};
            toReturn['type'] = 'tightHBox';
            toReturn['children'] = EqContainer_1.default.childrenToStepLayout(this.children, controller);
            return toReturn;
        }
        //Override to account for reduced width of tight terms.
        calcWidth() {
            let totalWidth = 0;
            let numTerms = 0;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                totalWidth += currChild.getWidth();
                if (currChild instanceof Term_1.default) {
                    numTerms++;
                }
            }
            return totalWidth + this.padding.width() - numTerms * widthDiff;
        }
        //Override to reduce term padding.
        addLayout(parentLayout, layouts, tlx, tly, currScale) {
            let state = new LayoutState_1.default(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
            const innerHeight = this.getHeight() - this.padding.height();
            let upToX = tlx + this.padding.left;
            for (let i = 0; i < this.children.length; i++) {
                let currChild = this.children[i];
                let childHeight = currChild.getHeight();
                //Position child in the middle vertically
                let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
                let childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale);
                if (currChild instanceof Term_1.default) {
                    childLayout.tighten(widthDiff);
                }
                upToX += childLayout.width;
            }
            layouts.push(state);
            return state;
        }
    }
    exports.default = TightHBox;
});

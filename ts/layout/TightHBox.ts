import HBox from "./HBox";
import C from '../main/consts';
import Term from "./Term";
import LayoutState from '../animation/LayoutState';
import TermLayoutState from "../animation/TermLayoutState";
import CanvasController from '../main/CanvasController';
import EqContainer from "./EqContainer";

const widthDiff = C.termPadding.width() - C.tightTermPadding.width();

export default class TightHBox extends HBox {

    //Override to have right type
    toStepLayout(controller: CanvasController): Object {
        let toReturn = {};
        toReturn['type'] = 'tightHBox';
        toReturn['children'] = EqContainer.childrenToStepLayout(this.children, controller);
        return toReturn;
    }

    //Override to account for reduced width of tight terms.
    protected calcWidth(): number {
        let totalWidth = 0;
        let numTerms = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            totalWidth += currChild.getWidth();
            if (currChild instanceof Term) {
                numTerms++;
            }
        }
        return totalWidth + this.padding.width() - numTerms * widthDiff;
    }

    //Override to reduce term padding.
    addLayout(parentLayout: LayoutState, layouts: LayoutState[], tlx: number, tly: number, currScale: number): LayoutState {
        let state = new LayoutState(parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        const innerHeight = this.getHeight() - this.padding.height();
        let upToX = tlx + this.padding.left;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
            let childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale);
            if (currChild instanceof Term) {
                (childLayout as TermLayoutState).tighten(widthDiff);
            }
            upToX += childLayout.width;
        }


        layouts.push(state);

        return state;
    }
}
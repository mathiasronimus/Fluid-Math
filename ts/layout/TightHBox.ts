import HBox from "./HBox";
import C from '../main/consts';
import Term from "./Term";
import LayoutState from '../animation/LayoutState';
import TermLayoutState from "../animation/TermLayoutState";
import CanvasController from '../main/CanvasController';
import EqContainer from "./EqContainer";
import EqComponent from "./EqComponent";
import { Map } from '../main/helpers';
import { LinearContainerFormat } from "../main/FileFormat";

const widthDiff = C.termPadding.width() - C.tightTermPadding.width();

export default class TightHBox extends HBox {

    //Override to have right type
    toStepLayout(controller: CanvasController): LinearContainerFormat {
        return {
            type: 'tightHBox',
            children: EqContainer.childrenToStepLayout(this.children, controller)
        }
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
    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): LayoutState {
        let state = new LayoutState(
                            parentLayout, this, tlx, tly, 
                            this.getWidth() * currScale, 
                            this.getHeight() * currScale, 
                            currScale);
        const innerHeight = (this.getHeight() - this.padding.height()) * currScale;
        let upToX = tlx + this.padding.left * currScale;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight() * currScale;

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
            let childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale, opacityObj, colorsObj);
            if (currChild instanceof Term) {
                (childLayout as TermLayoutState).tighten(widthDiff * currScale);
            }
            upToX += childLayout.width;
        }


        layouts.set(this, state);

        return state;
    }
}
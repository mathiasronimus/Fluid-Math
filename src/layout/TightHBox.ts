import HBox from "./HBox";
import { termPadding, tightTermPadding, defaultHBoxPadding } from '../main/consts';
import Term from "./Term";
import LayoutState from '../animation/LayoutState';
import TermLayoutState from "../animation/TermLayoutState";
import EqComponent from "./EqComponent";
import { Map, parseContainerChildren } from '../main/helpers';
import { MouseEventCallback } from "../main/CanvasController";
import EqContent from "./EqContent";
import { Container } from "../main/ComponentModel";
import { LinearContainerFormat } from "../main/FileFormat";
import Padding from "./Padding";

const widthDiff = termPadding.width() - tightTermPadding.width();

@Container({
    typeString: 'tightHBox',
    parse: (containerObj, depth, contentGetter, containerGetter) => {
        // Return HBox from file
        const format = containerObj as LinearContainerFormat;
        const children = parseContainerChildren(format.children, depth + 1, containerGetter, contentGetter);
        return new TightHBox(children, Padding.even(defaultHBoxPadding));
    }
})
export default class TightHBox extends HBox {

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
                opacityObj: Object, colorObj: Object,
                mouseEnter: Map<LayoutState, MouseEventCallback>,
                mouseExit: Map<LayoutState, MouseEventCallback>, 
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {

        let state = new LayoutState(
            parentLayout, this, 
            tlx, tly, 
            this.getWidth() * currScale, 
            this.getHeight() * currScale, 
            currScale
        );

        let upToX = tlx + this.padding.left * currScale;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight() * currScale;

            //Position child in the middle vertically
            let childTLY = this.middleMainLineDist * currScale - childHeight / 2 + tly;

            const childLayout = currChild.addLayout(   
                state, layouts, 
                upToX, childTLY, 
                currScale, opacityObj, colorObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            );

            if (currChild instanceof Term) {
                (childLayout as TermLayoutState).tighten(widthDiff * currScale);
            }

            upToX += childLayout.width;
        }

        layouts.set(this, state);

        return state;
    }
}
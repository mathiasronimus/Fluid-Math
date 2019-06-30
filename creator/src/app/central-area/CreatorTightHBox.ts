import CreatorHBox from './CreatorHBox';
import CanvasController, { MouseEventCallback } from '@shared/main/CanvasController';
import { LinearContainerFormat } from '@shared/main/FileFormat';
import { childrenToStepLayout } from './CreatorContainerMethods';
import Term from '@shared/layout/Term';
import C from '@shared/main/consts';
import LayoutState from '@shared/animation/LayoutState';
import EqComponent from '@shared/layout/EqComponent';
import TermLayoutState from '@shared/animation/TermLayoutState';
import EqContent from '@shared/layout/EqContent';

const widthDiff = C.termPadding.width() - C.tightTermPadding.width();

export default class CreatorTightHBox extends CreatorHBox {

    // Override to have right type
    toStepLayout(controller: CanvasController): LinearContainerFormat {
        return {
            type: 'tightHBox',
            children: childrenToStepLayout(this.children, controller)
        };
    }

    // Override to account for reduced width of tight terms.
    protected calcWidth(): number {
        let totalWidth = 0;
        let numTerms = 0;
        for (const currChild of this.children) {
            totalWidth += currChild.getWidth();
            if (currChild instanceof Term) {
                numTerms++;
            }
        }
        return totalWidth + this.padding.width() - numTerms * widthDiff;
    }

    // Override to reduce term padding.
    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
                tlx: number, tly: number, currScale: number,
                opacityObj: object, colorsObj: object,
                mouseEnter: Map<LayoutState, MouseEventCallback>,
                mouseExit: Map<LayoutState, MouseEventCallback>,
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {
        const state = new LayoutState(
                            parentLayout, this, tlx, tly,
                            this.getWidth() * currScale,
                            this.getHeight() * currScale,
                            currScale);
        const innerHeight = (this.getHeight() - this.padding.height()) * currScale;
        let upToX = tlx + this.padding.left * currScale;

        for (const currChild of this.children) {
            const childHeight = currChild.getHeight() * currScale;

            // Position child in the middle vertically
            const childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
            const childLayout = currChild.addLayout(state, layouts,
                                                    upToX, childTLY, currScale,
                                                    opacityObj, colorsObj,
                                                    mouseEnter, mouseExit, mouseClick, tempContent);
            if (currChild instanceof Term) {
                (childLayout as TermLayoutState).tighten(widthDiff * currScale);
            }
            upToX += childLayout.width;
        }


        layouts.set(this, state);

        return state;
    }
}

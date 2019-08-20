import Padding from "../layout/Padding";
import ContentLayoutState from "./ContentLayoutState";
import { termPadding, tightTermPadding } from "../main/consts";

export default class TermLayoutState extends ContentLayoutState {
    
    padding: Padding = termPadding;

    /**
     * Change this layout state to
     * reflect a Term in a tight
     * layout. This reduces padding
     * and width.
     * 
     * @param widthDiff The difference in width between a tight and normal term.
     */
    tighten(widthDiff: number): void {
        this.padding = tightTermPadding;
        this.width -= widthDiff;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): TermLayoutState {
        return new TermLayoutState( this.layoutParent, 
                                this.component,
                                this.tlx,
                                this.tly,
                                this.width, 
                                this.height,
                                0,
                                this.color,
                                0);
    }
}
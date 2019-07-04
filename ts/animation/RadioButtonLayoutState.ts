import ContentLayoutState from "./ContentLayoutState";
import EqComponent from "../layout/EqComponent";

export default class RadioButtonLayoutState extends ContentLayoutState {

    percentFill: number;

    constructor(component: EqComponent<any>, tlx: number, tly: number, width: number, height: number, scale: number,
                color: number[], opacity: number, percentFill: number) {
        super(undefined, component, tlx, tly, width, height, scale, color, opacity);
        this.percentFill = percentFill;
    }

    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    withZeroScale(): RadioButtonLayoutState {
        return new RadioButtonLayoutState(
                                this.component,
                                this.tlx,
                                this.tly,
                                this.width, 
                                this.height,
                                0,
                                this.color,
                                0,
                                this.percentFill);
    }

}
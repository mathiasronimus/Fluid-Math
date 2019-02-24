import EqContainer from "./EqContainer";
import RootContainerLayoutState from '../animation/RootContainerLayoutState';
import Padding from "./Padding";
import HBox from "./HBox";
import Radical from './Radical';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import CanvasController from '../main/CanvasController';
import EqContent from './EqContent';
import { Map } from '../main/helpers';
import C from '../main/consts';

/**
 * Works together with the 'Radical' content to
 * display roots. The radical is the line of the root.
 * The index is the container displayed on the top left
 * of the radical. Ie, for a cube root, it would contain
 * '3'. The argument is what is being rooted, residing
 * under the radical.
 */
export default class RootContainer extends EqContainer<RootContainerLayoutState> {

    private index: HBox;
    private argument: HBox;
    private radical: Radical;

    // Metrics:
    // The height of an index term at the current width tier.
    // Used to determine the height of the radical kink
    // so that a normal term fits nicely above it.
    private indexHeight: number;
    // The height of the kink in the radical. Fills the rest
    // of the height of the argument not taken up by idxHeight.
    private kinkHeight: number;
    // The distance that the index rises above the top of the root.
    // This happens when something taller than a regular term is put
    // in the index. If this isn't the case, this will be <= 0 and can
    // be ignored. This is added to the bottom to ensure the arg text
    // remains vertically centered.
    private indexTopOverflow: number;
    // The width of the kink. Depends on the angle the tick makes to
    // the horizontal, which the start of the kink matches. Also depends
    // on the kink height, kink tip length, and kink tip angle.
    private kinkWidth: number;
    // The distance that the index portrudes over the left of the kink.
    // If it doesn't is <= 0 and can be ignored.
    private indexLeftOverflow: number;
    // The vertical distance between the top of this container and the
    // very left point of the kink.
    private yToKinkStart: number;
    // The width of the kink tip.
    private kinkTipWidth: number;
    // The height of the kink tip.
    private kinkTipHeight: number;

    constructor(index: HBox, argument: HBox, radical: Radical, padding: Padding, termHeight: number) {
        super(padding);
        this.index = index;
        this.argument = argument;
        this.radical = radical;
        this.indexHeight = (termHeight + C.termPadding.height()) * C.rootIndexScale;
        this.kinkHeight = argument.getHeight() - this.indexHeight;
        this.indexTopOverflow = index.getHeight() * C.rootIndexScale - this.indexHeight;

        /*
              /\        /-----------
             /  \      /
            /y|z \    /   arg
                  \  /
        __________x\/x______________
        */
        const x = Math.atan2(argument.getHeight(), C.rootArgMarginLeft);
        // tan x = h / w
        // w = h / tan x
        const mainKinkWidth = this.kinkHeight / Math.tan(x);
        const z = Math.PI - x - Math.PI / 2;
        const y = C.rootKinkTipAngle - z;
        // sin y = w / tipLen
        // w = tipLen * sin y
        this.kinkTipWidth = C.rootKinkTipLength * Math.sin(y);
        this.kinkWidth = mainKinkWidth + this.kinkTipWidth;
        // cos y = h / tipLen
        // h = tipLen * cos y
        this.kinkTipHeight = C.rootKinkTipLength * Math.cos(y);
        this.yToKinkStart = this.indexTopOverflow + this.indexHeight + this.kinkTipHeight;

        // tan x = kinkHeight / xFromRightOfKink
        // xFromRightOfKink = kinkHeight / tan x
        const xFromRightOfKinkForIdx = this.kinkHeight / Math.tan(x);
        const widthForIdx = this.kinkWidth + xFromRightOfKinkForIdx;
        const realIdxWidth = index.getWidth() * C.rootIndexScale;
        this.indexLeftOverflow = realIdxWidth - widthForIdx;
        
        this.width = this.calcWidth();
        this.height = this.calcHeight();
    }

    protected calcWidth(): number {
        const realIdxLeftPortrusion = this.indexLeftOverflow > 0 ? this.indexLeftOverflow : 0;
        return realIdxLeftPortrusion + this.kinkWidth + C.rootArgMarginLeft + this.argument.getWidth();
    }

    protected calcHeight(): number {
        const realIdxTopPortrusion = this.indexTopOverflow > 0 ? this.indexTopOverflow : 0;
        return realIdxTopPortrusion * 2 + this.argument.getHeight();
    }

    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     * 
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>, 
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object): RootContainerLayoutState {
        // Work out points for the radical (relative to this container)
        const realLeftOverflow = this.indexLeftOverflow >= 0 ? this.indexLeftOverflow : 0;
        const realTopOverflow = this.indexTopOverflow >= 0 ? this.indexTopOverflow : 0;

        const kinkTipX = realLeftOverflow;
        const kinkTipY = this.yToKinkStart;
        
        const kinkTopX = kinkTipX + this.kinkTipWidth;
        const kinkTopY = kinkTipY - this.kinkTipHeight;
        
        const tickBotX = realLeftOverflow + this.kinkWidth;
        const tickBotY = kinkTopY + this.kinkHeight;
        
        const tickTopX = tickBotX + C.rootArgMarginLeft;
        const tickTopY = tickBotY - this.argument.getHeight() + 1;

        const endX = tickTopX + this.argument.getWidth();
        const endY = tickTopY;

        const thisLayout = new RootContainerLayoutState(
            parentLayout, this, tlx, tly, this.getWidth(), this.getHeight(), currScale,
            kinkTipX, kinkTipY, kinkTopX, kinkTopY, tickBotX, tickBotY,
            tickTopX, tickTopY, endX, endY
        );

        let indexTlx;
        if (this.indexLeftOverflow < 0) {
            // Doesn't overflow, needs to be centered
            indexTlx = tlx - this.indexLeftOverflow / 2;
        } else {
            // Overflows or fits exactly
            indexTlx = tlx;
        }

        this.index.addLayout(
            thisLayout, layouts, indexTlx, tly, currScale * C.rootIndexScale, opacityObj, colorsObj
        );

        const argTlx = tlx + realLeftOverflow + this.kinkWidth + C.rootArgMarginLeft;
        this.argument.addLayout(
            thisLayout, layouts, argTlx, tly, currScale, opacityObj, colorsObj
        );

        this.radical.addLayout(
            thisLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj
        );

        layouts.set(this, thisLayout);
        return thisLayout;
    }

    /**
     * When one of this container's direct
     * children is clicked, add a component
     * adjacent to the clicked child.
     * 
     * @param clickedLayout The layout state generated by the child.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        return;
    }

    /**
     * Returns an object representing
     * the step layout that would generate
     * this container.
     */
    toStepLayout(controller: CanvasController): Object {
        let toReturn: any = {};
        toReturn.type = 'root';
        toReturn.idx = EqContainer.childrenToStepLayout(this.index.getChildren(), controller);
        toReturn.arg = EqContainer.childrenToStepLayout(this.argument.getChildren(), controller);
        toReturn.rad = this.radical.getRef();
        return toReturn;
    }

    /**
     * Delete a child of this container.
     * 
     * @param toDelete The child to delete.
     */
    delete(toDelete: EqComponent<any>) {
        throw "Can't delete children from a root container.";
    }

    /**
     * Runs a function for every piece of
     * content under this container.
     * 
     * @param forEach The function to run for content.
     */
    forEachUnder(forEach: (content: EqContent<any>) => void) {
        this.index.forEachUnder(forEach);
        this.argument.forEachUnder(forEach);
        forEach(this.radical);
    }

    /**
     * Whether this container lays out components vertically
     * and more can be added.
     */
    protected addVertically(): boolean {
        return false;
    }

    /**
     * Whether this container lays out components horizontally
     * and more can be added.
     */
    protected addHorizontally(): boolean {
        return false;
    }

    /**
     * Add a child before another.
     * 
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    protected addBefore(toAdd: EqComponent<any>, before: EqComponent<any>) {
        return;
    }

    /**
     * Add a child after another.
     * 
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    protected addAfter(toAdd: EqComponent<any>, after: EqComponent<any>) {
        return;
    }
}
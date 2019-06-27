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
import { RootContainerFormat } from "../main/FileFormat";

/**
 * Works together with the 'Radical' content to
 * display roots. The radical is the line of the root.
 * The index is the container displayed on the top left
 * of the radical. Ie, for a cube root, it would contain
 * '3'. The argument is what is being rooted, residing
 * under the radical.
 */
export default class RootContainer extends EqContainer<RootContainerLayoutState> {

    protected index: HBox;
    protected argument: HBox;
    protected radical: Radical;

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
    // in the index. If this isn't the case, this will be set to 0. 
    // This is added to the bottom to ensure the arg text
    // remains vertically centered.
    private indexTopOverflow: number;
    // If argument is taller than a normal term, this will be >= 0.
    private emptySpaceAboveIndex: number;
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
    // An amount left blank (not taken up by the radical)
    // at the bottom of the container. Distinct from normal
    // padding, applies only to the radicals physical appearance.
    private padBottom: number;

    constructor(index: HBox, argument: HBox, radical: Radical, padding: Padding, termHeight: number) {
        super(padding);
        this.index = index;
        this.argument = argument;
        this.radical = radical;
        this.padBottom = C.termPadding.bottom / 2;
        termHeight += C.termPadding.height();
        this.indexHeight = termHeight * C.rootIndexScale;
        this.kinkHeight = (termHeight - this.padBottom) - this.indexHeight;
        this.indexTopOverflow = index.getHeight() * C.rootIndexScale - this.indexHeight;
        this.indexTopOverflow = Math.max(this.indexTopOverflow, 0);
        this.emptySpaceAboveIndex = argument.getHeight() - this.kinkHeight - this.indexHeight;
        this.emptySpaceAboveIndex = Math.max(this.emptySpaceAboveIndex, 0);
        /*
              /\        /-----------
             /  \      /
            /y|z \    /   arg
                  \  /
        __________x\/w______________
        Calculate x such that x = w if
        the height of the argument is one
        terms height.
        */
        // tan x = termHeight / argMargin
        // x = atan(termHeight / argMargin)
        const x = Math.atan(termHeight / C.rootArgMarginLeft);
        // tan x = h / w
        // w = h / tan x
        const mainKinkWidth = this.kinkHeight / Math.tan(x);
        const z = Math.PI - x - Math.PI / 2;
        // y + z = rootKinkTipAngle
        // y = rootKinkTipAngle - z
        const y = C.rootKinkTipAngle - z;
        // sin y = w / tipLen
        // w = tipLen * sin y
        this.kinkTipWidth = C.rootKinkTipLength * Math.sin(y);
        this.kinkWidth = mainKinkWidth + this.kinkTipWidth;
        // cos y = h / tipLen
        // h = tipLen * cos y
        this.kinkTipHeight = C.rootKinkTipLength * Math.cos(y);
        this.yToKinkStart = this.indexTopOverflow + this.emptySpaceAboveIndex + this.indexHeight + this.kinkTipHeight - this.padBottom;

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
        const realIdxLeftPortrusion = Math.max(this.indexLeftOverflow, 0);
        return realIdxLeftPortrusion + this.kinkWidth + C.rootArgMarginLeft + this.argument.getWidth() + this.padding.width();
    }

    protected calcHeight(): number {
        return this.indexTopOverflow * 2 + this.argument.getHeight() + this.padding.height();
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
        const adjustedPad = this.padding.scale(currScale);

        // Points for the radical: Relative to this container
        const realLeftOverflow = Math.max(this.indexLeftOverflow, 0);

        const kinkTipX = realLeftOverflow;
        const kinkTipY = this.yToKinkStart;
        
        const kinkTopX = kinkTipX + this.kinkTipWidth;
        const kinkTopY = kinkTipY - this.kinkTipHeight;
        
        const tickBotX = realLeftOverflow + this.kinkWidth;
        const tickBotY = kinkTopY + this.kinkHeight;
        
        const tickTopX = tickBotX + C.rootArgMarginLeft;
        const tickTopY = tickBotY - this.argument.getHeight() + 1 + this.padBottom;

        const endX = tickTopX + this.argument.getWidth();
        const endY = tickTopY;

        const thisWidth = this.getWidth() * currScale;
        const thisHeight = this.getHeight() * currScale;

        // The layout for this container
        const thisLayout = new RootContainerLayoutState(
            parentLayout, this, tlx, tly, thisWidth, thisHeight, currScale,
            kinkTipX, kinkTipY,
            kinkTopX, kinkTopY,
            tickBotX, tickBotY,
            tickTopX, tickTopY,
            endX, endY
        );

        // Calculate layout for the index
        let indexTlx;
        if (this.indexLeftOverflow < 0) {
            // Doesn't overflow, needs to be centered
            indexTlx = tlx - (this.indexLeftOverflow / 2) * currScale;
        } else {
            // Overflows or fits exactly
            indexTlx = tlx;
        }
        indexTlx += adjustedPad.left - 1 * currScale;
        const indexTly = tly + (this.emptySpaceAboveIndex - 1 - this.padBottom) * currScale + adjustedPad.top;

        this.index.addLayout(
            thisLayout, layouts, 
            indexTlx, indexTly,
            currScale * C.rootIndexScale,
            opacityObj, colorsObj
        );

        // Calculate layout for the argument
        const argTlx = tlx + (realLeftOverflow + this.kinkWidth + C.rootArgMarginLeft) * currScale + adjustedPad.left;
        const argTly = tly + this.indexTopOverflow * currScale + adjustedPad.top;
        this.argument.addLayout(
            thisLayout, layouts, argTlx, argTly, currScale, opacityObj, colorsObj
        );

        if (this.radical) {
            this.radical.addLayout(
                thisLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj
            );
        }

        layouts.set(this, thisLayout);
        return thisLayout;
    }
}
import EqContainer from "./EqContainer";
import RootContainerLayoutState from '../animation/RootContainerLayoutState';
import Padding from "./Padding";
import HBox from "./HBox";
import Radical from './Radical';
import LayoutState from '../animation/LayoutState';
import EqComponent from './EqComponent';
import { MouseEventCallback } from '../main/CanvasController';
import EqContent from './EqContent';
import { Map, getWidthTier, parseContainerChildren } from '../main/helpers';
import { defaultRootPadding, termPadding, rootIndexScale, rootArgMarginLeft, rootKinkTipAngle, rootKinkTipLength } from '../main/consts';
import { RootContainerFormat } from "../main/FileFormat";
import { Container } from "../main/ComponentModel";

/**
 * Works together with the 'Radical' content to
 * display roots. The radical is the line of the root.
 * The index is the container displayed on the top left
 * of the radical. Ie, for a cube root, it would contain
 * '3'. The argument is what is being rooted, residing
 * under the radical.
 */
@Container({
    typeString: 'root',
    parse: (containerObj, depth, contentGetter, containerGetter, genInfo) => {
        // Return container from file
        const format = containerObj as RootContainerFormat;
        const idx = new HBox(
            parseContainerChildren(format.idx, depth + 1, containerGetter, contentGetter),
            Padding.even(0)
        );
        const arg = new HBox(
            parseContainerChildren(format.arg, depth + 1, containerGetter, contentGetter),
            Padding.even(0)
        );
        let radical: Radical;
        if (format.rad) {
            radical = contentGetter(format.rad) as Radical;
        }
        return new RootContainer(idx, arg, radical, defaultRootPadding, genInfo['termHeights']);
    }
})
export default class RootContainer extends EqContainer<RootContainerLayoutState> {

    protected index: HBox;
    protected argument: HBox;
    protected radical: Radical;

    private termHeights: number[];

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

    constructor(index: HBox, argument: HBox, radical: Radical, padding: Padding, termHeights: number[]) {
        super(padding);
        this.index = index;
        this.argument = argument;
        this.radical = radical;
        if (this.termHeights === undefined || this.termHeights.length === 0) {
            // Edge case: sometimes a RootContainer is constructed before any terms exist
            this.termHeights = [20, 20, 20];
        } else {
            this.termHeights = termHeights;
        }
        this.calcMetrics();
        this.width = this.calcWidth();
        this.height = this.calcHeight();
    }

    /**
     * Calculate the layout parameters for the display
     * of the container.
     */
    private calcMetrics() {
        this.padBottom = termPadding.bottom / 2;
        const termHeight = this.termHeights[getWidthTier()] + termPadding.height();
        this.indexHeight = termHeight * rootIndexScale;
        this.kinkHeight = (termHeight - this.padBottom) - this.indexHeight;
        this.indexTopOverflow = this.index.getHeight() * rootIndexScale - this.indexHeight;
        this.indexTopOverflow = Math.max(this.indexTopOverflow, 0);
        this.emptySpaceAboveIndex = this.argument.getHeight() - this.kinkHeight - this.indexHeight;
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
        const x = Math.atan(termHeight / rootArgMarginLeft);
        // tan x = h / w
        // w = h / tan x
        const mainKinkWidth = this.kinkHeight / Math.tan(x);
        const z = Math.PI - x - Math.PI / 2;
        // y + z = rootKinkTipAngle
        // y = rootKinkTipAngle - z
        const y = rootKinkTipAngle - z;
        // sin y = w / tipLen
        // w = tipLen * sin y
        this.kinkTipWidth = rootKinkTipLength * Math.sin(y);
        this.kinkWidth = mainKinkWidth + this.kinkTipWidth;
        // cos y = h / tipLen
        // h = tipLen * cos y
        this.kinkTipHeight = rootKinkTipLength * Math.cos(y);
        this.yToKinkStart = this.indexTopOverflow + this.emptySpaceAboveIndex + this.indexHeight + this.kinkTipHeight - this.padBottom;

        // tan x = kinkHeight / xFromRightOfKink
        // xFromRightOfKink = kinkHeight / tan x
        const xFromRightOfKinkForIdx = this.kinkHeight / Math.tan(x);
        const widthForIdx = this.kinkWidth + xFromRightOfKinkForIdx;
        const realIdxWidth = this.index.getWidth() * rootIndexScale;
        this.indexLeftOverflow = realIdxWidth - widthForIdx;
    }

    recalcDimensions() {
        this.radical.recalcDimensions();
        this.argument.recalcDimensions();
        this.index.recalcDimensions();
        this.calcMetrics();
        super.recalcDimensions();
    }

    getMainTextLine(): [number, number] {
        const argLine = this.argument.getMainTextLine();
        const toAdd = this.indexTopOverflow + this.padding.top;
        argLine[0] += toAdd;
        argLine[1] += toAdd;
        return argLine;
    }

    protected calcWidth(): number {
        const realIdxLeftPortrusion = Math.max(this.indexLeftOverflow, 0);
        return realIdxLeftPortrusion + this.kinkWidth + rootArgMarginLeft + this.argument.getWidth() + this.padding.width();
    }

    protected calcHeight(): number {
        return this.indexTopOverflow + this.argument.getHeight() + this.padding.height();
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
    addLayout(parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
        tlx: number, tly: number, currScale: number,
        opacityObj: Object, colorsObj: Object,
        mouseEnter: Map<LayoutState, MouseEventCallback>,
        mouseExit: Map<LayoutState, MouseEventCallback>,
        mouseClick: Map<LayoutState, MouseEventCallback>,
        tempContent: EqContent<any>[]): RootContainerLayoutState {
        const adjustedPad = this.padding.scale(currScale);

        // Points for the radical: Relative to this container
        const realLeftOverflow = Math.max(this.indexLeftOverflow, 0);

        const kinkTipX = realLeftOverflow;
        const kinkTipY = this.yToKinkStart;

        const kinkTopX = kinkTipX + this.kinkTipWidth;
        const kinkTopY = kinkTipY - this.kinkTipHeight;

        const tickBotX = realLeftOverflow + this.kinkWidth;
        const tickBotY = kinkTopY + this.kinkHeight;

        const tickTopX = tickBotX + rootArgMarginLeft;
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
            currScale * rootIndexScale,
            opacityObj, colorsObj,
            mouseEnter, mouseExit, mouseClick,
            tempContent
        );

        // Calculate layout for the argument
        const argTlx = tlx + (realLeftOverflow + this.kinkWidth + rootArgMarginLeft) * currScale + adjustedPad.left;
        const argTly = tly + this.indexTopOverflow * currScale + adjustedPad.top;
        this.argument.addLayout(
            thisLayout, layouts, argTlx, argTly, currScale, opacityObj, colorsObj,
            mouseEnter, mouseExit, mouseClick, tempContent
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
import EqContainer from "./EqContainer";
import LayoutState from "../animation/LayoutState";
import EqComponent from "./EqComponent";
import { MouseEventCallback } from "../main/CanvasController";
import EqContent from "./EqContent";
import Padding from "./Padding";
import { Map, parseContainerChildren } from '../main/helpers';
import { defaultTablePadding, tableCellPadding, tableMinCellDimen } from '../main/consts';
import { Container } from "../main/ComponentModel";
import { TableFormat, ContainerFormat } from "../main/FileFormat";

/**
 * Functions for loading from the file.
 */

/**
 * Parse an object containing references with indices
 * as keys.
 * @param obj The object to parse. 
*/
export function parseChildrenObj(
        obj: { [index: number]: string }, 
        contentGetter: (ref: string) => EqContent<any>
): { [index: number]: EqComponent<any> } {

    let toReturn = {};
    if (!obj) {
        return toReturn;
    }
    Object.keys(obj).forEach(index => {
        let ref = obj[index];
        toReturn[index] = contentGetter(ref);
    });
    return toReturn;
}

/**
 * Parse a 2D array of components.
 * @param fromFile The array from the file.
 */
export function parseChildren2D(
        fromFile: (string | ContainerFormat)[][],
        containerGetter: (obj: ContainerFormat, depth: number) => EqContainer<any>,
        contentGetter: (ref: string) => EqContent<any>
): EqComponent<any>[][] {

    const toReturn: EqComponent<any>[][] = [];
    fromFile.forEach(row => {
        toReturn.push(parseContainerChildren(row, 1, containerGetter, contentGetter));
    });
    return toReturn;
}

/**
 * Lays out components in a table.
 */
@Container({
    typeString: 'table',
    parse: (containerObj, depth, contentGetter, containerGetter) => {
        const format = containerObj as TableFormat;
        const children = parseChildren2D(format.children, containerGetter, contentGetter);
        return new TableContainer(
            defaultTablePadding,
            children,
            parseChildrenObj(format.hLines, contentGetter),
            parseChildrenObj(format.vLines, contentGetter),
            1,
            tableCellPadding
        );
    }
})
export default class TableContainer extends EqContainer<LayoutState> {

    protected children: EqComponent<any>[][];

    // The width of each column
    protected widths: number[] = [];

    // The height of each row
    protected heights: number[] = [];

    protected hLines: { [index: number]: EqComponent<any> };
    protected vLines: { [index: number]: EqComponent<any> };

    protected lineStroke: number;

    // Padding inside each cell
    protected cellPad: Padding;

    constructor(padding: Padding,
        children: EqComponent<any>[][],
        hLines: { [index: number]: EqComponent<any> },
        vLines: { [index: number]: EqComponent<any> },
        lineStroke: number,
        cellPad: Padding) {
        super(padding);
        this.cellPad = cellPad;
        this.lineStroke = lineStroke;
        this.children = children;
        this.width = this.calcWidth();
        this.height = this.calcHeight();
        this.hLines = hLines;
        this.vLines = vLines;
    }

    /**
     * Return the amount of space to leave for lines
     * (both horizontal and vertical).
     */
    protected getLineStroke(): number {
        return this.lineStroke;
    }

    /**
     * Return the mimimum dimension in either axis
     * for a table cell.
     */
    protected getMinCellDimen(): number {
        return tableMinCellDimen;
    }

    recalcDimensions() {
        this.children.forEach(row => {
            row.forEach(child => {
                if (child) {
                    child.recalcDimensions();
                }
            });
        });
        super.recalcDimensions();
    }

    protected calcWidth(): number {
        let totalWidth = 0;
        // Width of each column is the max width of any component in that row
        for (let c = 0; c < this.children[0].length; c++) {
            let maxWidth = this.getMinCellDimen();
            for (let r = 0; r < this.children.length; r++) {
                let currChild = this.children[r][c];
                let currWidth = this.cellPad.width();
                if (currChild) {
                    currWidth += currChild.getWidth();
                }
                if (currWidth > maxWidth) {
                    maxWidth = currWidth;
                }
            }
            totalWidth += maxWidth;
            // Store col width for later
            this.widths[c] = maxWidth;
        }
        // Also need to take width of lines into account,
        // and padding.
        return totalWidth + this.padding.width() + (this.children[0].length + 1) * this.getLineStroke();
    }

    protected calcHeight(): number {
        let totalHeight = 0;
        // Height of each row is the max height of any component in that row
        for (let r = 0; r < this.children.length; r++) {
            let maxHeight = this.getMinCellDimen();
            for (let c = 0; c < this.children[r].length; c++) {
                let currChild = this.children[r][c];
                let currHeight = this.cellPad.height();
                if (currChild) {
                    currHeight += currChild.getHeight();
                }
                if (currHeight > maxHeight) {
                    maxHeight = currHeight;
                }
            }
            totalHeight += maxHeight;
            // Store height of this row for later
            this.heights[r] = maxHeight;
        }
        // Also need to take height of lines into account,
        // and padding.
        return totalHeight + this.padding.height() + (this.children.length + 1) * this.getLineStroke();
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
     * @param mouseEnter Mouse enter events for this step.
     * @param mouseExit Mouse exit events for this step.
     * @param mouseClick Mouse click events for this step.
     * @param tempContent Temporary content added only for this step.
     */
    addLayout(parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
        tlx: number, tly: number, currScale: number,
        opacityObj: Object, colorsObj: Object,
        mouseEnter: Map<LayoutState, MouseEventCallback>,
        mouseExit: Map<LayoutState, MouseEventCallback>,
        mouseClick: Map<LayoutState, MouseEventCallback>,
        tempContent: EqContent<any>[]): LayoutState {

        const thisState = new LayoutState(
            parentLayout, this, tlx, tly,
            this.width, this.height, currScale
        )

        // Add child layouts row by row
        let upToY = tly + this.padding.top + this.getLineStroke();
        for (let r = 0; r < this.children.length; r++) {
            // Do the row
            let upToX = tlx + this.padding.left + this.getLineStroke();
            let rowHeight = this.heights[r];

            // Add hline before row if there is one
            if (this.hLines[r]) {
                this.hLines[r].addLayout(
                    thisState, layouts, undefined, upToY - this.getLineStroke(), currScale,
                    opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent
                );
            }

            for (let c = 0; c < this.children[r].length; c++) {
                // Do each column
                let colWidth = this.widths[c];

                // Add vline before column if there is one
                if (this.vLines[c]) {
                    this.vLines[c].addLayout(
                        thisState, layouts, upToX - this.getLineStroke(), undefined, currScale,
                        opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent
                    );
                }

                let currChild = this.children[r][c];
                if (currChild) {
                    // Add child layout, centering in both directions
                    let childWidth = currChild.getWidth();
                    let childHeight = currChild.getHeight();
                    let childX = upToX + (colWidth - childWidth) / 2;
                    let childY = upToY + (rowHeight - childHeight) / 2;
                    currChild.addLayout(
                        thisState, layouts, childX, childY, currScale,
                        opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick,
                        tempContent
                    );
                }
                upToX += colWidth + this.getLineStroke();

                // Add vline after last column if there is one
                if (c === this.children[r].length - 1 && this.vLines[c + 1]) {
                    this.vLines[c + 1].addLayout(
                        thisState, layouts, upToX - this.getLineStroke(), undefined, currScale,
                        opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent
                    );
                }
            }
            upToY += rowHeight + this.getLineStroke();

            // Add hline after the last row if there is one
            if (r === this.children.length - 1 && this.hLines[r + 1]) {
                this.hLines[r + 1].addLayout(
                    thisState, layouts, tlx + this.padding.left, upToY - this.getLineStroke(),
                    currScale, opacityObj, colorsObj,
                    mouseEnter, mouseExit, mouseClick, tempContent
                )
            }
        }

        layouts.set(this, thisState);
        return thisState;

    }

}
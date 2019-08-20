import EqComponent from './EqComponent';
import Padding from './Padding';
import LayoutState from '../animation/LayoutState';
import { Map, newMap, parseContainerChildren } from '../main/helpers';
import LinearContainer from './LinearContainer';
import { MouseEventCallback } from '../main/CanvasController';
import EqContent from './EqContent';
import { Container } from '../main/ComponentModel';
import { LinearContainerFormat } from '../main/FileFormat';
import { defaultHBoxPadding } from '../main/consts';

@Container({
    typeString: 'hbox',
    parse: (containerObj, depth, contentGetter, containerGetter) => {
        // Return HBox from file
        const format = containerObj as LinearContainerFormat;
        const children = parseContainerChildren(format.children, depth + 1, containerGetter, contentGetter);
        return new HBox(children, Padding.even(defaultHBoxPadding));
    }
})
export default class HBox extends LinearContainer<LayoutState> {

    // Calculated initially, stored for later
    protected mainLine: [number, number];
    protected middleMainLineDist: number; // Vertical distance from top of this to middle of main line

    constructor(children: EqComponent<any>[], padding: Padding) {
        super(children, padding);
        this.width = this.calcWidth();
        this.height = this.calcHeight();
    }

    protected calcHeight(): number {
        // Line up text of children, then return their position relative to this component

        // Sort children into those with a line and those without
        // Store their line if they have one
        const childrenWithLine: Map<EqComponent<any>, [number, number]> = newMap();
        const childrenWithoutLine: Map<EqComponent<any>, undefined> = newMap();
        
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const line = child.getMainTextLine();
            
            if (line === undefined) {
                childrenWithoutLine.set(child, undefined);
            } else {
                childrenWithLine.set(child, line);
            }
        }

        // Calculate the height that the aligned children will take up
        // To do this, we find the maximum of two distances:
        //  - From the middle of the main line to the top of the component
        //  - From the middle of the main line to the bottom of the component
        // And we add them together.
        let maxAboveAligned = 0;
        let maxBelowAligned = 0;
        let lineHeight: number; // Must be consistently one of CanvasController.termHeights for all components

        childrenWithLine.forEach((line, component) => {
            lineHeight = line[1] - line[0];
            const compHeight = component.getHeight();
            const middleOfLine = (line[0] + line[1]) / 2;
            const above = middleOfLine;
            const below = compHeight - middleOfLine;

            if (above > maxAboveAligned) {
                maxAboveAligned = above;
            }

            if (below > maxBelowAligned) {
                maxBelowAligned = below;
            }
        });

        // See if any non-aligned components will poke above/below this
        // when centered with the middle of the aligned line
        let maxAboveNonAligned = maxAboveAligned;
        let maxBelowNonAligned = maxBelowAligned;
        childrenWithoutLine.forEach((nothing, component) => {
            const halfCompHeight = component.getHeight() / 2;

            if (halfCompHeight > maxAboveNonAligned) {
                maxAboveNonAligned = halfCompHeight;
            }

            if (halfCompHeight > maxBelowNonAligned) {
                maxBelowNonAligned = halfCompHeight;
            }
        });

        // Case for if there are no aligned children
        if (childrenWithLine.size === 0) {
            this.mainLine = undefined;
            const finalHeight = maxAboveNonAligned + maxBelowNonAligned + this.padding.height();
            this.middleMainLineDist = finalHeight / 2;
            return finalHeight;
        }
        
        // Distance between top of this and start of aligned part
        const topAlignedDist = maxAboveNonAligned > maxAboveAligned ? maxAboveNonAligned - maxAboveAligned : 0;

        // Distance from top of this to top of main line
        const topMainLineDist = this.padding.top + topAlignedDist + maxAboveAligned - lineHeight / 2;
        
        // Distance from top of this to bottom of main line
        const botMainLineDist = topMainLineDist + lineHeight;
        
        this.middleMainLineDist = topMainLineDist + (botMainLineDist - topMainLineDist) / 2;
        this.mainLine = [topMainLineDist, botMainLineDist];
        
        // The final height
        return maxAboveNonAligned + maxBelowNonAligned + this.padding.height();
    }

    protected calcWidth(): number {
        let totalWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            totalWidth += currChild.getWidth();
        }
        return totalWidth + this.padding.width();
    }

    getMainTextLine(): [number, number] {
        return (this.mainLine ? this.mainLine.slice() : undefined) as [number, number];
    }

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
            let childLine = currChild.getMainTextLine();

            // Position child in the middle of the main line if it isn't aligned
            // Position its main line in the middle of this's main line if it is
            let childTLY = tly;
            if (childLine) {
                childLine[0] *= currScale;
                childLine[1] *= currScale;

                childTLY += this.middleMainLineDist * currScale - (childLine[1] + childLine[0]) / 2;
            } else {
                childTLY += this.middleMainLineDist * currScale - childHeight / 2;
            }

            upToX += currChild.addLayout(   
                state, layouts, 
                upToX, childTLY, 
                currScale, opacityObj, colorObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            ).width;
        }

        layouts.set(this, state);

        return state;
    }
}
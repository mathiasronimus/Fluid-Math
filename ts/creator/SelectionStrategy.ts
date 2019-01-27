import LayoutState from "../animation/LayoutState";

/**
 * Implementations define the strategy used
 * by the StepOptionsCanvasController.
 */
export interface SelectionStrategy {
    onSelect(currSelected: LayoutState[], newSelected: LayoutState): void;
}

/**
 * Strategy allowing only one layout to be
 * selected.
 */
export class OneOnlySelectionStrategy implements SelectionStrategy {
    onSelect(currSelected: LayoutState[], newSelected: LayoutState): void {
        currSelected.splice(0, currSelected.length);
        currSelected.push(newSelected);
    }
}
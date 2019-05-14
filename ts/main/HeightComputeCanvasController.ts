import CanvasController from './CanvasController';
import C from './consts';
import { getWidthTier } from './helpers';
import { FileFormat } from './FileFormat';

/**
 * Canvas controller that computes the max height of an
 * instructions object at each font size.
 */
export default class HeightComputeCanvasController extends CanvasController {

    constructor(instructions: FileFormat) {
        super(document.createElement('div'), instructions);
    }

    /**
     * Compute the maximum height of all steps for
     * a width tier.
     * @param tier The width tier.
     */
    private getMaxHeight(tier: number): number {
        const win: any = window;
        win.currentWidthTier = tier;
        this.terms.forEach(term => {
            term.recalcDimensions();
        });
        let maxHeight = 0;
        for (let i = 0; i < this.steps.length; i++) {
            const layout = this.calcLayout(i)[1];
            if (layout.height > maxHeight) {
                maxHeight = layout.height;
            }
        }
        win.currentWidthTier = getWidthTier();
        return maxHeight;
    }

    /**
     * Compute and return the maximum height of every
     * step for each font size tier. The array returned
     * corresponds to each font size tier.
     */
    compute(): number[] {
        const toReturn: number[] = [];
        for (let i = 0; i < C.widthTiers.length; i++) {
            toReturn.push(this.getMaxHeight(i));
        }
        return toReturn;
    }
}

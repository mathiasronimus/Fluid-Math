import VBox from '@shared/layout/VBox';
import LinearCreatorContainer from './LinearCreatorContainer';
import LayoutState from '@shared/animation/LayoutState';
import C from '@shared/main/consts';
import { line, tri } from '@shared/main/helpers';
import {
    creatorContainerCreatorDraw,
    creatorContainerAddClick,
    childrenToStepLayout,
    linearContainerDelete,
    linearContainerForEachUnder,
    linearContainerAddBefore,
    linearContainerAddAfter
} from './CreatorContainerMethods';
import EqComponent from '@shared/layout/EqComponent';
import Radical from '@shared/layout/Radical';
import CanvasController from '@shared/main/CanvasController';
import { LinearContainerFormat } from '@shared/main/FileFormat';

export default class CreatorVBox extends VBox implements LinearCreatorContainer {

    delete = linearContainerDelete;
    forEachUnder = linearContainerForEachUnder;
    addBefore = linearContainerAddBefore;
    addAfter = linearContainerAddAfter;

    addHorizontally() {
        return false;
    }

    addVertically() {
        return true;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = C.creatorContainerStroke;

        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        const pad = C.creatorContainerPadding.scale(l.scale);

        // Vertical lines
        const y1 = l.tly + pad.top / 2;
        const y2 = l.tly + l.height - pad.bottom / 2;
        const x1 = l.tlx + pad.left / 2;
        const x2 = l.tlx + l.width - pad.right / 2;
        line(x1, y1, x1, y2, ctx);
        line(x2, y1, x2, y2, ctx);

        // Carets
        ctx.fillStyle = C.creatorCaretFillStyle;

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top * 0.75);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.top * 0.75);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        // Carets that depend on parent
        creatorContainerCreatorDraw.call(this, l, ctx);

        ctx.restore();
    }

    addClick(l: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        const realPad = C.creatorContainerPadding.scale(l.scale);
        // Create mock layout states to use like rectangles
        const innerTop = new LayoutState(
            undefined, undefined,
            l.tlx + realPad.left / 2,
            l.tly + realPad.top / 2,
            l.width - realPad.width() / 2,
            realPad.height() / 4,
            1
        );
        const innerBot = new LayoutState(
            undefined, undefined,
            l.tlx + realPad.left / 2,
            l.tly + l.height - realPad.bottom,
            l.width - realPad.width() / 2,
            realPad.height() / 4,
            1
        );
        if (innerTop.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        } else if (innerBot.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        } else {
            // Click wasn't on inner part, add adjacent to parent container.
            creatorContainerAddClick(l, x, y, toAdd);
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        this.addValid(toAdd);
        if (clickedLayout.onTop(y)) {
            // Add top
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            // Add bottom
            this.addAfter(toAdd, clickedLayout.component);
        }
    }

    addValid(toAdd: EqComponent<any>) {
        if (toAdd instanceof Radical) {
            throw new Error('Radicals can only be added inside a root container.');
        }
    }

    toStepLayout(controller: CanvasController): LinearContainerFormat {
        return {
            type: 'vbox',
            children: childrenToStepLayout(this.children, controller)
        };
    }
}

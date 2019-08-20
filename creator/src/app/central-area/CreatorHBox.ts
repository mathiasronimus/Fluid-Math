import HBox from '@shared/layout/HBox';
import LinearCreatorContainer from './LinearCreatorContainer';
import LayoutState from '@shared/animation/LayoutState';
import { line, tri, parseContainerChildren } from '@shared/main/helpers';
import {
    creatorContainerCreatorDraw,
    creatorContainerAddClick,
    linearContainerAddBefore,
    linearContainerAddAfter,
    childrenToStepLayout,
    linearContainerDelete,
    linearContainerForEachUnder
} from './CreatorContainerMethods';
import EqComponent from '@shared/layout/EqComponent';
import HDivider from '@shared/layout/HDivider';
import Radical from '@shared/layout/Radical';
import CanvasController from '@shared/main/CanvasController';
import { LinearContainerFormat } from '@shared/main/FileFormat';
import { creatorContainerStroke, creatorContainerPadding, creatorCaretFillStyle, creatorCaretSize } from '@shared/main/consts';
import { Container } from '@shared/main/ComponentModel';

@Container({
    typeString: 'creator-hbox',
    parse: (containerObj, depth, contentGetter, containerGetter) => {
        // Return HBox from file
        const format = containerObj as LinearContainerFormat;
        return new CreatorHBox(
            parseContainerChildren(format.children, depth, containerGetter, contentGetter),
            creatorContainerPadding);
    }
})
export default class CreatorHBox extends HBox implements LinearCreatorContainer {

    delete = linearContainerDelete;
    forEachUnder = linearContainerForEachUnder;
    addBefore = linearContainerAddBefore;
    addAfter = linearContainerAddAfter;

    addVertically() {
        return false;
    }

    addHorizontally() {
        return true;
    }

    creatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = creatorContainerStroke;

        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();

        const pad = creatorContainerPadding.scale(l.scale);

        // Horizontal lines
        const x1 = l.tlx + pad.left / 2;
        const x2 = l.tlx + l.width - pad.right / 2;
        const y1 = l.tly + pad.top / 2;
        const y2 = l.tly + l.height - pad.bottom / 2;
        line(x1, y1, x2, y1, ctx);
        line(x1, y2, x2, y2, ctx);

        // Carets
        ctx.fillStyle = creatorCaretFillStyle;

        ctx.save();
        ctx.translate(l.tlx + pad.left * 0.75, l.tly + l.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, creatorCaretSize, creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width - pad.right * 0.75, l.tly + l.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, creatorCaretSize, creatorCaretSize, ctx);
        ctx.restore();

        // Carets that depend on parent
        creatorContainerCreatorDraw.call(this, l, ctx);

        ctx.restore();
    }

    addClick(l: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        const pad = creatorContainerPadding.scale(l.scale);
        // Make fake layout states to use like rectangles
        const innerLeft = new LayoutState(
            undefined,
            undefined,
            l.tlx + pad.left / 2,
            l.tly + pad.top / 2,
            pad.width() / 4,
            l.height - pad.height() / 2,
            1
        );
        const innerRight = new LayoutState(
            undefined,
            undefined,
            l.tlx + l.width - pad.right,
            l.tly + pad.top / 2,
            pad.width() / 4,
            l.height - pad.height() / 2,
            1
        );
        if (innerLeft.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        } else if (innerRight.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        } else {
            creatorContainerAddClick.call(this, l, x, y, toAdd);
        }
    }

    addClickOnChild(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        this.addValid(toAdd);
        if (clickedLayout.onLeft(x)) {
            // Add left
            this.addBefore(toAdd, clickedLayout.component);
        } else {
            // Add right
            this.addAfter(toAdd, clickedLayout.component);
        }
    }

    addValid(toAdd: EqComponent<any>) {
        if (toAdd instanceof HDivider) {
            throw new Error('Fraction lines can only be added inside a vertical container.');
        }
        if (toAdd instanceof Radical) {
            throw new Error('Radicals can only be added inside a root container.');
        }
    }

    toStepLayout(controller: CanvasController): LinearContainerFormat {
        return {
            type: 'hbox',
            children: childrenToStepLayout(this.children, controller)
        };
    }
}

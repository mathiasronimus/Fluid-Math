import LayoutState from '@shared/animation/LayoutState';
import EqComponent from '@shared/layout/EqComponent';
import CreatorContainer from './CreatorContainer';
import C from '@shared/main/consts';
import { tri } from '@shared/main/helpers';
import CanvasController from '@shared/main/CanvasController';
import { ContainerFormat } from '@shared/main/FileFormat';
import EqContainer from '@shared/layout/EqContainer';
import EqContent from '@shared/layout/EqContent';

/**
 * Default methods for those declared in CreatorContainer.
 */

export function creatorContainerAddClick(clickedLayout: LayoutState, x: number, y: number, toAdd: EqComponent<any>): void {
    const parentLayout = clickedLayout.layoutParent;
    if (!parentLayout) {
        // Can't add, no parent container
        return;
    }
    const container = parentLayout.component as unknown as CreatorContainer;
    if (container.addVertically()) {
        // Add on top or bottom
        if (clickedLayout.onTop(y)) {
            // Add before this
            container.addBefore(toAdd, this);
        } else {
            // Add after this
            container.addAfter(toAdd, this);
        }
    } else if (container.addHorizontally()) {
        // Add on left or right
        if (clickedLayout.onLeft(x)) {
            // Add before this
            container.addBefore(toAdd, this);
        } else {
            // Add after this
            container.addAfter(toAdd, this);
        }
    } else {
        // Can't add inside this type of container
        return;
    }
}

export function creatorContainerCreatorDraw(l: LayoutState, ctx: CanvasRenderingContext2D): void {
    const parentLayout = l.layoutParent;
    if (!parentLayout) {
        return;
    }
    const pad = C.creatorContainerPadding.scale(l.scale);
    const container = parentLayout.component as unknown as CreatorContainer;
    if (container.addVertically()) {
        // Add carets on top and bottom facing outwards
        ctx.save();
        ctx.fillStyle = C.creatorCaretFillStyleLighter;

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top / 4);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.bottom / 4);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.restore();

    } else if (container.addHorizontally()) {
        // Add carets on left and right facing outwards
        ctx.save();
        ctx.fillStyle = C.creatorCaretFillStyleLighter;

        ctx.save();
        ctx.translate(l.tlx + pad.left / 4, l.tly + l.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width - pad.right / 4, l.tly + l.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, C.creatorCaretSize, C.creatorCaretSize, ctx);
        ctx.restore();

        ctx.restore();
    }
}

/**
 * Returns an array of children of a container
 * as used in the step layout.
 * @param children The children array.
 * @param controller The canvas controller possessing this container.
 */
export function childrenToStepLayout(children: EqComponent<any>[], controller: CanvasController): (string | ContainerFormat)[] {
    const toReturn: (string | ContainerFormat)[] = [];
    children.forEach(comp => {
        if (comp instanceof EqContainer) {
            toReturn.push((comp as unknown as CreatorContainer).toStepLayout(controller));
        } else if (comp instanceof EqContent) {
            toReturn.push(comp.getRef());
        } else {
            throw new Error('unrecognized type');
        }
    });
    return toReturn;
}

export function linearContainerAddBefore(toAdd: EqComponent<any>, before: EqComponent<any>) {
    this.addValid(toAdd);
    const index = this.children.indexOf(before);
    this.children.splice(index, 0, toAdd);
}

export function linearContainerAddAfter(toAdd: EqComponent<any>, after: EqComponent<any>) {
    this.addValid(toAdd);
    const index = this.children.indexOf(after);
    this.children.splice(index + 1, 0, toAdd);
}

export function linearContainerForEachUnder(forEach: (content: EqContent<any>) => void) {
    this.children.forEach(child => {
        if (child instanceof EqContent) {
            // Run the function
            forEach(child);
        } else if (child instanceof EqContainer) {
            (child as unknown as CreatorContainer).forEachUnder(forEach);
        } else {
            throw new Error('unrecognized component type');
        }
    });
}

export function linearContainerDelete(toDelete: EqComponent<any>) {
    this.children.splice(this.children.indexOf(toDelete), 1);
}

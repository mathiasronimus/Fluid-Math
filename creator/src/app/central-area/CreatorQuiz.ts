import Quiz from '@shared/layout/Quiz';
import LinearCreatorContainer from './LinearCreatorContainer';
import {
    linearContainerDelete,
    linearContainerForEachUnder,
    linearContainerAddBefore,
    linearContainerAddAfter,
    creatorContainerCreatorDraw,
    creatorContainerAddClick,
    childrenToStepLayout
} from './CreatorContainerMethods';
import LayoutState from '@shared/animation/LayoutState';
import { line, tri, parseContainerChildren } from '@shared/main/helpers';
import EqComponent from '@shared/layout/EqComponent';
import Radical from '@shared/layout/Radical';
import CanvasController, { MouseEventCallback } from '@shared/main/CanvasController';
import { QuizFormat } from '@shared/main/FileFormat';
import HDivider from '@shared/layout/HDivider';
import EqContent from '@shared/layout/EqContent';
import {
    creatorContainerStroke,
    creatorContainerPadding,
    creatorCaretFillStyle,
    creatorCaretSize,
    curvedOutlineDefaultOpacity,
    curvedOutlineColor,
    radioButtonDefaultOpacity,
    radioButtonColor,
    quizCorrectColor,
    quizIncorrectColor
} from '@shared/main/consts';
import { Container } from '@shared/main/ComponentModel';

@Container({
    typeString: 'creator-quiz',
    parse: (containerObj, depth, contentGetter, containerGetter) => {
        const format = containerObj as QuizFormat;
        return new CreatorQuiz(
            parseContainerChildren(format.children, depth, containerGetter, contentGetter),
            creatorContainerPadding,
            format.answers,
            curvedOutlineDefaultOpacity,
            curvedOutlineColor,
            radioButtonDefaultOpacity,
            radioButtonColor,
            quizCorrectColor,
            quizIncorrectColor
        );
    }
})
export default class CreatorQuiz extends Quiz implements LinearCreatorContainer {

    forEachUnder = linearContainerForEachUnder;
    addBefore = linearContainerAddBefore;
    addAfter = linearContainerAddAfter;

    saveAnswersAs: boolean[];

    // Re-override to not account for extra spacing
    protected calcHeight(): number {
        let totalHeight = 0;
        for (const currChild of this.children) {
            totalHeight += currChild.getHeight();
        }
        return totalHeight + this.padding.height();
    }

    addHorizontally() {
        return false;
    }

    addVertically() {
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

        // Vertical lines
        const y1 = l.tly + pad.top / 2;
        const y2 = l.tly + l.height - pad.bottom / 2;
        const x1 = l.tlx + pad.left / 2;
        const x2 = l.tlx + l.width - pad.right / 2;
        line(x1, y1, x1, y2, ctx);
        line(x2, y1, x2, y2, ctx);

        // Carets
        ctx.fillStyle = creatorCaretFillStyle;

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top * 0.75);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, creatorCaretSize, creatorCaretSize, ctx);
        ctx.restore();

        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.top * 0.75);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        tri(0, 0, creatorCaretSize, creatorCaretSize, ctx);
        ctx.restore();

        // Carets that depend on parent
        creatorContainerCreatorDraw.call(this, l, ctx);

        ctx.restore();
    }

    addClick(l: LayoutState, x: number, y: number, toAdd: EqComponent<any>) {
        const realPad = creatorContainerPadding.scale(l.scale);
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
            this.answers = [];
        } else if (innerBot.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
            this.answers = [];
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
        // Invalidate answers
        this.answers = [];
    }

    addValid(toAdd: EqComponent<any>) {
        if (toAdd instanceof Radical) {
            throw new Error('Radicals can only be added inside a root container.');
        }
        if (toAdd instanceof HDivider) {
            throw new Error('Fraction Lines can only be added inside a vertical container.');
        }
    }

    toStepLayout(controller: CanvasController): QuizFormat {
        // Convert back to saved answer format
        const saveAnswers = [];
        (this.saveAnswersAs ? this.saveAnswersAs : this.answers).forEach((val, index) => {
            if (val) {
                saveAnswers.push(index);
            }
        });
        if (this.saveAnswersAs) {
            this.saveAnswersAs = undefined;
        }
        return {
            type: 'quiz',
            children: childrenToStepLayout(this.children, controller),
            answers: saveAnswers
        };
    }

    delete(toDelete: EqComponent<any>) {
        // Invalidate answers
        this.answers = [];
        linearContainerDelete.call(this, toDelete);
    }

    // Override to not add outlines or extra spacing
    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
                tlx: number, tly: number, currScale: number,
                opacityObj: object, colorsObj: object,
                mouseEnter: Map<LayoutState, MouseEventCallback>,
                mouseExit: Map<LayoutState, MouseEventCallback>,
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {

        const state = new LayoutState(parentLayout, this, tlx, tly,
            this.getWidth() * currScale,
            this.getHeight() * currScale,
            currScale);
        const innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        let upToY = tly + this.padding.top * currScale;

        for (const currChild of this.children) {
            const childWidth = currChild.getWidth() * currScale;

            // Position child in the middle horizontally
            const childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            const childLayout = currChild.addLayout(
                state, layouts,
                childTLX, upToY, currScale,
                opacityObj, colorsObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            );
            upToY += childLayout.height;
        }

        layouts.set(this, state);

        return state;
    }

    /**
     * Save a value of answers the next time
     * toStepLayout is called.
     * @param answers The value to save.
     */
    saveAnswers(answers: boolean[]) {
        this.saveAnswersAs = answers;
    }
}

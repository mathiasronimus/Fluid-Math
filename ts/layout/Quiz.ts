import VBox from "./VBox";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import LayoutState from "../animation/LayoutState";
import CanvasController, { MouseEventCallback } from "../main/CanvasController";
import { Map } from '../main/helpers';
import CurvedOutline from "./CurvedOutline";
import C from '../main/consts';
import ContentLayoutState from "../animation/ContentLayoutState";
import AnimationSet from "../animation/AnimationSet";
import OutlineFadeAnimation from "../animation/OutlineFadeAnimation";
import OutlineColorAnimation from "../animation/OutlineColorAnimation";
import EqContent from "./EqContent";

export default class Quiz extends VBox {

    protected answers: boolean[];
    protected hasBeenClicked: boolean;

    constructor(children: EqComponent<any>[], padding: Padding, answers: number[]) {
        super(children, padding);
        this.width = this.calcWidth();
        this.height = this.calcHeight();
        this.answers = [];
        answers.forEach(index => this.answers[index] = true);
    }

    // Override to add margin
    protected calcHeight(): number {
        let totalHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
            totalHeight += this.children[i].getHeight();
            totalHeight += C.answerVMargin;
        }
        return totalHeight + this.padding.height() + C.answerVMargin * 2;
    }

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object,
                mouseEnter: Map<LayoutState, MouseEventCallback>, 
                mouseExit: Map<LayoutState, MouseEventCallback>, 
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {

        let state = new LayoutState(parentLayout, this, tlx, tly,
            this.getWidth() * currScale,
            this.getHeight() * currScale,
            currScale);
        const innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        let upToY = tly + this.padding.top * currScale + C.answerVMargin;

        let allOutlines: LayoutState[] = [];

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childWidth = currChild.getWidth() * currScale;

            // Position child in the middle horizontally
            let childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            let childLayout = currChild.addLayout(
                state, layouts,
                childTLX, upToY, currScale,
                opacityObj, colorsObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            );
            upToY += childLayout.height + C.answerVMargin;

            // Give child an outline that can respond to events.
            let outline = new CurvedOutline(childLayout, layouts);
            tempContent.push(outline);
            let outlineLayout: ContentLayoutState = outline.getLayout();
            allOutlines.push(outlineLayout);

            // If mouse enters, make it lighter (unless answer has been revealed)
            let onEnter = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (!this.hasBeenClicked) {
                    new OutlineFadeAnimation(outlineLayout, C.hoveredOutlineOpacity, set);
                }
                controller.setCursor('pointer');
            };
            mouseEnter.set(outlineLayout, onEnter);

            // If mouse exits, make darker again (unless answer has been revealed)
            let onExit = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (!this.hasBeenClicked) {
                    new OutlineFadeAnimation(outlineLayout, C.curvedOutlineDefaultOpacity, set);
                }
                controller.setCursor('default');
            };
            mouseExit.set(outlineLayout, onExit);
        }

        // If mouse clicks, reveal answer
        let onClick = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
            // Check if correct
            if (this.answers[allOutlines.indexOf(oldLayout)]) {
                controller.setText('<em class="green">Correct!</em> Tap again to see answer.');
            } else {
                controller.setText('<em class="red">Not quite...</em> Tap again to see answer.');
            }
            // Animate all options
            allOutlines.forEach((layout: ContentLayoutState, index: number) => {
                // If correct, go green. Otherwise go red.
                const color = this.answers[index] ? C.quizCorrectColor : C.quizIncorrectColor;
                new OutlineColorAnimation(layout, color, set);
                new OutlineFadeAnimation(layout, C.revealedOutlineOpacity, set);
                this.hasBeenClicked = true;
                return true;
            });
            this.hasBeenClicked = true;
            // Remove the events so they won't be triggered again.
            allOutlines.forEach(layout => {
                mouseClick.delete(layout);
                mouseEnter.delete(layout);
                mouseExit.delete(layout);
            });
            controller.setCursor("default");
        };

        // Bind all outlines to the same click event
        allOutlines.forEach(layout => {
            mouseClick.set(layout, onClick);
        });

        layouts.set(this, state);

        return state;
    }

}
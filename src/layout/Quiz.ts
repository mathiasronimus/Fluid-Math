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
import RadioButton from "./RadioButton";
import RadioButtonSelectAnimation from "../animation/RadioButtonSelectAnimation";
import RadioButtonLayoutState from "../animation/RadioButtonLayoutState";

export default class Quiz extends VBox {

    protected answers: boolean[];
    protected clickedIndex = -1;

    protected outlineOpacity: number;
    protected outlineColor: [number, number, number];

    protected radioButtonOpacity: number;
    protected radioButtonColor: [number, number, number];

    protected correctColor: [number, number, number];
    protected incorrectColor: [number, number, number];

    constructor(children: EqComponent<any>[], padding: Padding, answers: number[], 
                outlineOpacity: number, outlineColor: [number, number, number],
                radioButtonOpacity: number, radioButtonColor: [number, number, number],
                correctColor: [number, number, number], incorrectColor: [number, number, number]) {
        super(children, padding);
        this.outlineOpacity = outlineOpacity;
        this.outlineColor = outlineColor;
        this.radioButtonOpacity = radioButtonOpacity;
        this.radioButtonColor = radioButtonColor;
        this.correctColor = correctColor;
        this.incorrectColor = incorrectColor;
        this.answers = [];
        answers.forEach(index => this.answers[index] = true);
    }

    // Override to add padding
    protected calcWidth(): number {
        return super.calcWidth() + C.quizCurvedOutlinePadding.width() + C.quizRadioButtonDimen;
    }

    // Override to add margin
    protected calcHeight(): number {
        return super.calcHeight() + C.answerVMargin * (this.children.length + 2);
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
        let allButtons: LayoutState[] = [];

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];

            // Width of the whole row (button, outline, and child)
            const rowWidth = currChild.getWidth() + C.quizCurvedOutlinePadding.width() + C.quizRadioButtonDimen;

            // Height of the whole row (same as height of child)
            const rowHeight = currChild.getHeight();

            // Start x of the whole row
            const rowTLX = tlx + (innerWidth - rowWidth) / 2;

            // Add radio button
            const radioButton = new RadioButton(
                C.quizRadioButtonPadding, rowTLX, upToY + (rowHeight - C.quizRadioButtonDimen) / 2,
                C.quizRadioButtonDimen, layouts, this.radioButtonOpacity, this.radioButtonColor
            );
            tempContent.push(radioButton);
            const radioButtonLayout = radioButton.getLayout();
            allButtons.push(radioButtonLayout);
            if (this.clickedIndex === i) {
                radioButtonLayout.percentFill = 1;
            }

            // Position child in the middle horizontally
            let childTLX = rowTLX + C.quizRadioButtonDimen + C.quizCurvedOutlinePadding.left;
            let childLayout = currChild.addLayout(
                state, layouts,
                childTLX, upToY, currScale,
                opacityObj, colorsObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            );
            upToY += childLayout.height + C.answerVMargin;

            // Give child an outline that can respond to events.
            let outline = new CurvedOutline(C.quizCurvedOutlinePadding, childLayout, layouts, this.outlineOpacity, this.outlineColor);
            tempContent.push(outline);
            let outlineLayout: ContentLayoutState = outline.getLayout();
            allOutlines.push(outlineLayout);  
            if (this.clickedIndex !== -1) {
                outlineLayout.opacity = C.revealedOutlineOpacity;
                if (this.answers[i]) {
                    outlineLayout.color = this.correctColor;
                } else {
                    outlineLayout.color = this.incorrectColor;
                }
            }

            // If mouse enters outline or button, make it lighter (unless answer has been revealed)
            let onEnter = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (this.clickedIndex === -1) {
                    new OutlineFadeAnimation(outlineLayout, C.hoveredOutlineOpacity, set);
                    new RadioButtonSelectAnimation(
                        C.quizRadioButtonSelectDuration,
                        C.quizRadioButtonSelectEasing,
                        set,
                        radioButtonLayout,
                        0,
                        1
                    );
                }
                controller.setCursor('pointer');
            };
            if (this.clickedIndex === -1) {
                mouseEnter.set(outlineLayout, onEnter);
                mouseEnter.set(radioButtonLayout, onEnter);
            }

            // If mouse exits, make darker again (unless answer has been revealed)
            let onExit = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (this.clickedIndex === -1) {
                    new OutlineFadeAnimation(outlineLayout, this.outlineOpacity, set);
                    new RadioButtonSelectAnimation(
                        C.quizRadioButtonDeselectDuration,
                        C.quizRadioButtonDeselectEasing,
                        set,
                        radioButtonLayout,
                        1,
                        0
                    );
                }
                controller.setCursor('default');
            };
            if (this.clickedIndex === -1) {
                mouseExit.set(outlineLayout, onExit);
                mouseExit.set(radioButtonLayout, onExit);
            }
        }

        if (this.clickedIndex === -1) {
            // If mouse clicks, reveal answer
            let onClick = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                // Check if correct
                const clickedIndex = oldLayout instanceof RadioButtonLayoutState ? allButtons.indexOf(oldLayout) : allOutlines.indexOf(oldLayout);
                if (this.answers[clickedIndex]) {
                    controller.setText('<em class="green">Correct!</em> Tap again to see working.');
                } else {
                    controller.setText('<em class="red">Not quite...</em> Tap again to see working.');
                }
                // Animate all options
                allOutlines.forEach((layout: ContentLayoutState, index: number) => {
                    // If correct, go green. Otherwise go red.
                    const color = this.answers[index] ? this.correctColor : this.incorrectColor;
                    new OutlineColorAnimation(layout, color, set);
                    new OutlineFadeAnimation(layout, C.revealedOutlineOpacity, set);
                    return true;
                });
                this.clickedIndex = clickedIndex;
                // Remove the events so they won't be triggered again.
                allOutlines.forEach(layout => {
                    mouseClick.delete(layout);
                    mouseEnter.delete(layout);
                    mouseExit.delete(layout);
                });
                allButtons.forEach(layout => {
                    mouseClick.delete(layout);
                    mouseEnter.delete(layout);
                    mouseExit.delete(layout);
                });
                controller.setCursor("default");
            };
            
            // Bind all outlines to the same click event
            allOutlines.forEach(layout => mouseClick.set(layout, onClick));
            allButtons.forEach(layout => mouseClick.set(layout, onClick));
        }
            
        layouts.set(this, state);

        return state;
    }

}
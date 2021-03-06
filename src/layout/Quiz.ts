import VBox from "./VBox";
import EqComponent from "./EqComponent";
import Padding from "./Padding";
import LayoutState from "../animation/LayoutState";
import CanvasController, { MouseEventCallback } from "../main/CanvasController";
import { Map, parseContainerChildren } from '../main/helpers';
import CurvedOutline from "./CurvedOutline";
import ContentLayoutState from "../animation/ContentLayoutState";
import AnimationSet from "../animation/AnimationSet";
import OutlineFadeAnimation from "../animation/OutlineFadeAnimation";
import OutlineColorAnimation from "../animation/OutlineColorAnimation";
import EqContent from "./EqContent";
import RadioButton from "./RadioButton";
import RadioButtonSelectAnimation from "../animation/RadioButtonSelectAnimation";
import RadioButtonLayoutState from "../animation/RadioButtonLayoutState";
import { Container } from "../main/ComponentModel";
import { QuizFormat } from "../main/FileFormat";
import { defaultQuizPadding, curvedOutlineDefaultOpacity, curvedOutlineColor, radioButtonDefaultOpacity, radioButtonColor, quizCorrectColor, quizIncorrectColor, quizCurvedOutlinePadding, quizRadioButtonDimen, answerVMargin, quizRadioButtonPadding, revealedOutlineOpacity, hoveredOutlineOpacity, quizRadioButtonSelectDuration, quizRadioButtonSelectEasing, quizRadioButtonDeselectDuration, quizRadioButtonDeselectEasing, defaultIncorrectText, defaultCorrectText } from "../main/consts";

@Container({
    typeString: 'quiz',
    parse: (containerObj, depth, contentGetter, containerGetter, inf) => {
        const format = containerObj as QuizFormat;
        return new Quiz(
            parseContainerChildren(format.children, depth + 1, containerGetter, contentGetter),
            defaultQuizPadding,
            format.answers,
            inf['customColors'] && inf['customColors'].curvedOutlineOpacity ? inf['customColors'].curvedOutlineOpacity : curvedOutlineDefaultOpacity,
            inf['customColors'] && inf['customColors'].curvedOutlineColor ? inf['customColors'].curvedOutlineColor : curvedOutlineColor,
            inf['customColors'] && inf['customColors'].radioButtonOpacity ? inf['customColors'].radioButtonOpacity : radioButtonDefaultOpacity,
            inf['customColors'] && inf['customColors'].radioButtonColor ? inf['customColors'].radioButtonColor : radioButtonColor,
            inf['customColors'] && inf['customColors'].quizCorrectColor ? inf['customColors'].quizCorrectColor : quizCorrectColor,
            inf['customColors'] && inf['customColors'].quizIncorrectColor ? inf['customColors'].quizIncorrectColor : quizIncorrectColor,
            inf['iconSetter'],
            format.correctMessage,
            format.incorrectMessage,
            format.customMessages
        );
    }
})
export default class Quiz extends VBox {

    protected answers: boolean[];
    protected clickedIndex = -1;

    // Custom text: may be undefined
    protected correctMessage: string;
    protected incorrectMessage: string;
    protected customMessages: {[idx: number]: string};

    protected outlineOpacity: number;
    protected outlineColor: [number, number, number];

    protected radioButtonOpacity: number;
    protected radioButtonColor: [number, number, number];

    protected correctColor: [number, number, number];
    protected incorrectColor: [number, number, number];

    protected iconSetter: (icon?: string) => void;

    constructor(children: EqComponent<any>[], padding: Padding, answers: number[],
                outlineOpacity: number, outlineColor: [number, number, number],
                radioButtonOpacity: number, radioButtonColor: [number, number, number],
                correctColor: [number, number, number], incorrectColor: [number, number, number],
                iconSetter: (icon?: string) => void, correctMessage: string, incorrectMessage: string,
                customMessages: {[idx: number]: string}) {
        super(children, padding);
        this.outlineOpacity = outlineOpacity;
        this.outlineColor = outlineColor;
        this.radioButtonOpacity = radioButtonOpacity;
        this.radioButtonColor = radioButtonColor;
        this.correctColor = correctColor;
        this.incorrectColor = incorrectColor;
        this.answers = [];
        this.iconSetter = iconSetter;
        answers.forEach(index => this.answers[index] = true);
        this.correctMessage = correctMessage;
        this.incorrectMessage = incorrectMessage;
        this.customMessages = customMessages;
    }

    // Override to add padding
    protected calcWidth(): number {
        return super.calcWidth() + quizCurvedOutlinePadding.width() + quizRadioButtonDimen;
    }

    // Override to add margin
    protected calcHeight(): number {
        return super.calcHeight() + answerVMargin * (this.children.length + 2);
    }

    addLayout(  parentLayout: LayoutState, layouts: Map<EqComponent<any>, LayoutState>,
                tlx: number, tly: number, currScale: number,
                opacityObj: Object, colorsObj: Object,
                mouseEnter: Map<LayoutState, MouseEventCallback>,
                mouseExit: Map<LayoutState, MouseEventCallback>,
                mouseClick: Map<LayoutState, MouseEventCallback>,
                tempContent: EqContent<any>[]): LayoutState {

        // If a quiz is in a layout, next icon is not valid
        this.iconSetter('');

        let state = new LayoutState(parentLayout, this, tlx, tly,
            this.getWidth() * currScale,
            this.getHeight() * currScale,
            currScale);
        const innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        let upToY = tly + this.padding.top * currScale + answerVMargin;

        let allOutlines: LayoutState[] = [];
        let allButtons: LayoutState[] = [];

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];

            // Width of the whole row (button, outline, and child)
            const rowWidth = currChild.getWidth() + quizCurvedOutlinePadding.width() + quizRadioButtonDimen;

            // Height of the whole row (same as height of child)
            const rowHeight = currChild.getHeight();

            // Start x of the whole row
            const rowTLX = tlx + (innerWidth - rowWidth) / 2;

            // Add radio button
            const radioButton = new RadioButton(
                quizRadioButtonPadding, rowTLX, upToY + (rowHeight - quizRadioButtonDimen) / 2,
                quizRadioButtonDimen, layouts, this.radioButtonOpacity, this.radioButtonColor
            );
            tempContent.push(radioButton);
            const radioButtonLayout = radioButton.getLayout();
            allButtons.push(radioButtonLayout);
            if (this.clickedIndex === i) {
                radioButtonLayout.percentFill = 1;
            }

            // Position child in the middle horizontally
            let childTLX = rowTLX + quizRadioButtonDimen + quizCurvedOutlinePadding.left;
            let childLayout = currChild.addLayout(
                state, layouts,
                childTLX, upToY, currScale,
                opacityObj, colorsObj,
                mouseEnter, mouseExit, mouseClick,
                tempContent
            );
            upToY += childLayout.height + answerVMargin;

            // Give child an outline that can respond to events.
            let outline = new CurvedOutline(quizCurvedOutlinePadding, childLayout, layouts, this.outlineOpacity, this.outlineColor);
            tempContent.push(outline);
            let outlineLayout: ContentLayoutState = outline.getLayout();
            allOutlines.push(outlineLayout);
            if (this.clickedIndex !== -1) {
                outlineLayout.opacity = revealedOutlineOpacity;
                if (this.answers[i]) {
                    outlineLayout.color = this.correctColor;
                } else {
                    outlineLayout.color = this.incorrectColor;
                }
            }

            // Layout that encompasses both of them for detecting events
            const selectionRow = LayoutState.encompassing(outlineLayout, radioButtonLayout);

            // If mouse enters outline or button, make it darker (unless answer has been revealed)
            let onEnter = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (this.clickedIndex === -1) {
                    new OutlineFadeAnimation(outlineLayout, hoveredOutlineOpacity, set);
                    new RadioButtonSelectAnimation(
                        quizRadioButtonSelectDuration,
                        quizRadioButtonSelectEasing,
                        set,
                        radioButtonLayout,
                        0,
                        1
                    );
                }
                controller.setCursor('pointer');
            };
            if (this.clickedIndex === -1) {
                mouseEnter.set(selectionRow, onEnter);
            }

            // If mouse exits, make lighter again (unless answer has been revealed)
            let onExit = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                if (this.clickedIndex === -1) {
                    new OutlineFadeAnimation(outlineLayout, this.outlineOpacity, set);
                    new RadioButtonSelectAnimation(
                        quizRadioButtonDeselectDuration,
                        quizRadioButtonDeselectEasing,
                        set,
                        radioButtonLayout,
                        1,
                        0
                    );
                }
                controller.setCursor('default');
            };
            if (this.clickedIndex === -1) {
                mouseExit.set(selectionRow, onExit)
            }
        }

        if (this.clickedIndex === -1) {
            // If mouse clicks, reveal answer
            let onClick = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => {
                // Now we can go next
                this.iconSetter();
                // Check if correct
                const clickedIndex = oldLayout instanceof RadioButtonLayoutState ? allButtons.indexOf(oldLayout) : allOutlines.indexOf(oldLayout);
                if (this.answers[clickedIndex]) {
                    // Is correct
                    if (this.customMessages && this.customMessages[clickedIndex]) {
                        // Show the custom message
                        controller.setText(this.customMessages[clickedIndex]);
                    } else if (this.correctMessage) {
                        // If no custom message, show custom correct message
                        controller.setText(this.correctMessage);
                    } else {
                        // If neither, show default
                        controller.setText(defaultCorrectText);
                    }
                } else {
                    // Is not correct
                    if (this.customMessages && this.customMessages[clickedIndex]) {
                        // Show the custom message
                        controller.setText(this.customMessages[clickedIndex]);
                    } else if (this.incorrectMessage) {
                        // If no custom message, show custom incorrect message
                        controller.setText(this.incorrectMessage);
                    } else {
                        // If neither, show default
                        controller.setText(defaultIncorrectText);
                    }
                }
                // Animate all options
                allOutlines.forEach((layout: ContentLayoutState, index: number) => {
                    // If correct, go green. Otherwise go red.
                    const color = this.answers[index] ? this.correctColor : this.incorrectColor;
                    new OutlineColorAnimation(layout, color, set);
                    new OutlineFadeAnimation(layout, revealedOutlineOpacity, set);
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
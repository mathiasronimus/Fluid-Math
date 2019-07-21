import Term from "../layout/Term";
import HBox from "../layout/HBox";
import Padding from "../layout/Padding";
import VBox from "../layout/VBox";
import EqComponent from "../layout/EqComponent";
import LayoutState from "../animation/LayoutState";
import EqContainer from "../layout/EqContainer";
import AnimationSet from '../animation/AnimationSet';
import MoveAnimation from "../animation/MoveAnimation";
import RemoveAnimation from "../animation/RemoveAnimation";
import AddAnimation from "../animation/AddAnimation";
import EvalAnimation from '../animation/EvalAnimation';
import ReverseEvalAnimation from '../animation/ReverseEvalAnimation';
import C from './consts';
import EqContent from "../layout/EqContent";
import ProgressAnimation from "../animation/ProgressAnimation";
import HDivider from "../layout/HDivider";
import TightHBox from "../layout/TightHBox";
import SubSuper from "../layout/SubSuper";
import { getFontSizeForTier, Map, newMap, isIE, getWidthTier, getFont } from "./helpers";
import Radical from "../layout/Radical";
import RootContainer from "../layout/RootContainer";
import VCenterVBox from "../layout/VCenterVBox";
import { StepFormat, TransitionOptionsFormat, FileFormat, ContainerFormat, LinearContainerFormat, SubSuperContainerFormat, RootContainerFormat, AutoplayFormat, QuizFormat, TableFormat, ColorsFormat } from "./FileFormat";
import ProgressIndicator from "./ProgressIndicator";
import Quiz from "../layout/Quiz";
import ContentLayoutState from "../animation/ContentLayoutState";
import TableContainer from "../layout/TableContainer";
import VDivider from "../layout/VDivider";
import BezierCallback from "../animation/BezierCallback";

export type MouseEventCallback = (oldLayout: ContentLayoutState, set: AnimationSet, controller: CanvasController) => void;

/**
 * Responsible for managing a single canvas,
 * playing through the set of instructions
 * and animating.
 */
export default class CanvasController {

    protected container: Element;
    protected textArea: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected restartOrNextButton: HTMLElement;
    protected overlayContainer: HTMLElement;
    protected ctx: CanvasRenderingContext2D;
    protected progress: ProgressIndicator;

    protected currStep = 0;
    protected steps: StepFormat[];
    protected stepOptions: TransitionOptionsFormat[];
    protected isAutoplay: AutoplayFormat;
    protected customColors: ColorsFormat;

    protected terms: Term[];
    protected termHeights: number[];
    protected hDividers: HDivider[];
    protected vDividers: VDivider[];
    protected radicals: Radical[];
    // Content added temporarily in the current step
    protected tempContent: EqContent<any>[];

    protected currStates: Map<EqComponent<any>, LayoutState>;
    protected currRootContainer: EqContainer<any>;
    protected currAnimation: AnimationSet;

    // Various mouse events. When triggered, the callback
    // may add animations to the set or manipulate the controller.
    // If any click events are present, do not go to the next
    // step as usual.
    protected mouseEnterEvents: Map<LayoutState, MouseEventCallback>;
    protected mouseExitEvents: Map<LayoutState, MouseEventCallback>;
    protected mouseClickEvents: Map<LayoutState, MouseEventCallback>;
    protected mouseOnLast: LayoutState[] = [];

    protected fontWeight: string;
    protected fontStyle: string;
    protected fontSize: number;
    protected fontFamily: string;

    protected lastHeight: number = 0;
    protected lastWidth: number = 0;
    protected fixedHeights: number[];

    /**
     * Create a new Canvas Controller,
     * setting up equation playback in the
     * given container.
     * @param container The container. 
     * @param instructions The instructions.
     */
    constructor(container: HTMLElement, instructions: FileFormat, colors?: ColorsFormat) {
        this.container = container;
        this.steps = instructions.steps;
        this.stepOptions = instructions.stepOpts;
        this.terms = [];
        this.hDividers = [];
        this.vDividers = [];
        this.radicals = [];
        this.setSize = this.setSize.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        
        this.isAutoplay = instructions.autoplay;
        this.customColors = colors;
        
        //Create canvas
        let canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.container.appendChild(canvasContainer);
        
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        canvasContainer.appendChild(this.canvas);

        
        // Check if any steps have text
        let hasText = false;
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i].text) {
                hasText = true;
                break;
            }
        }
        
        // Whether navigational buttons are necessary
        const needButtons = this.steps.length > 1 && !this.isAutoplay;
        
        // Create area below canvas, if needed
        if (needButtons || hasText) {
            let lowerArea = document.createElement("div");
            lowerArea.className = "eqUpper";
            this.container.appendChild(lowerArea);
            
            //Create back button, if needed
            if (needButtons) {
                let backButton = document.createElement("div");
                backButton.className = "material-icons eqIcon";
                backButton.innerHTML = "keyboard_arrow_left";
                backButton.setAttribute("role", "button");
                lowerArea.appendChild(backButton);
                this.prevStep = this.prevStep.bind(this);
                backButton.addEventListener("click", this.prevStep);
                // Highlight button on mouse over
                backButton.addEventListener("mouseenter", this.highlightButton.bind(this, backButton));
                backButton.addEventListener("mouseleave", this.unhighlightButton.bind(this, backButton));
            }
            
            // Create text area, if needed
            // text doesn't show if: none of the steps define any text
            if (hasText) {
                this.textArea = document.createElement("div");
                this.textArea.className = "eqText";
                lowerArea.appendChild(this.textArea);
            }
            
            //Create restart button and progress indicator
            if (needButtons) {
                this.restartOrNextButton = document.createElement("div");
                this.restartOrNextButton.className = "material-icons eqIcon";
                this.restartOrNextButton.innerHTML = "keyboard_arrow_right";
                this.restartOrNextButton.setAttribute("role", "button");
                lowerArea.appendChild(this.restartOrNextButton);
                this.restart = this.restart.bind(this);
                this.restartOrNextButton.addEventListener("click", this.handleMouseClick);
                // Highlight next/restart in all regions where it will happen
                this.canvas.addEventListener("mouseenter", this.highlightButton.bind(this, this.restartOrNextButton));
                this.restartOrNextButton.addEventListener("mouseenter", this.highlightButton.bind(this, this.restartOrNextButton));
                this.canvas.addEventListener("mouseleave", this.unhighlightButton.bind(this, this.restartOrNextButton));
                this.restartOrNextButton.addEventListener("mouseleave", this.unhighlightButton.bind(this, this.restartOrNextButton));
            }
        }

        // Initialize progress indicator, if not autoplaying
        if (!this.isAutoplay) {
            this.progress = new ProgressIndicator(this.canvas);
        }

        //Check whether to fix the height of the canvas
        if (container.hasAttribute('data-fix-height')) {
            this.fixedHeights = instructions.maxHeights;
        }

        //Initialize the font
        [
            this.fontFamily,
            this.fontStyle,
            this.fontWeight
        ] = getFont(instructions);

        //Initialize Components and display first step
        this.initContent(instructions);
        this.updateFontSize();
        this.recalc(true);
        
        // Bind next step to canvas/text click if not autoplaying
        if (!this.isAutoplay) {
            this.canvas.addEventListener("click", this.handleMouseClick);
            if (this.textArea) {
                this.textArea.addEventListener('click', this.handleMouseClick);
            }
        }

        //Redraw when window size changes
        this.recalc = this.recalc.bind(this);
        window.addEventListener('resize', () => {
            this.updateFontSize();
            this.updateDimensions();
            this.recalc(false);
        });

        // Add overlay for play if autoplaying
        if (this.isAutoplay) {
            this.overlayContainer = document.createElement("div");
            this.overlayContainer.className = "overlayContainer";
            this.overlayContainer.addEventListener("click", this.startAutoplay);

            const playButton = document.createElement("span");
            playButton.className = "material-icons playButton";
            playButton.innerHTML = "play_arrow";

            this.overlayContainer.appendChild(playButton);
            container.appendChild(this.overlayContainer);
        }

        // Check for mouse events
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
    }

    /**
     * Emphasize a button.
     * @param button The element of the button.
     */
    protected highlightButton(button: HTMLElement) {
        const set = new AnimationSet(() => {}, this.ctx, 0, 0);

        const anim = new class extends BezierCallback {
            constructor() {
                super(C.buttonHighlightDuration, C.buttonHighlightEasing, set);
            }
            protected step(completion: number): void {
                const opacity = 0.4 * (1 - completion) + C.buttonHighlightedOpacity * completion;
                button.style.opacity = "" + opacity;
            }
        };

        set.addAnimation(anim);
        set.start();
    }

    /**
     * De-emphasize a button
     * @param button The element of the button.
     */
    protected unhighlightButton(button: HTMLElement) {
        const set = new AnimationSet(() => {}, this.ctx, 0, 0);

        const anim = new class extends BezierCallback {
            constructor() {
                super(C.buttonUnhighlightDuration, C.buttonUnhighlightEasing, set);
            }
            protected step(completion: number): void {
                const opacity = C.buttonHighlightedOpacity * (1 - completion) + 0.4 * completion;
                button.style.opacity = "" + opacity;
            }
        };

        set.addAnimation(anim);
        set.start();
    }

    /**
     * Set what the cursor will be above the canvas.
     * @param cursor The css style property for cursor.
     */
    setCursor(cursor: string) {
        this.canvas.style.cursor = cursor;
    }

    /**
     * Set what will be displayed as the text.
     * @param innerHTML The inner HTML text.
     */
    setText(innerHTML: string) {
        if (this.textArea) {
            this.textArea.innerHTML = innerHTML;
        }
    }

    /**
     * Decide what to do when the mouse clicks.
     * @param e The mouse event.
     */
    protected handleMouseClick(e: MouseEvent) {
        if (this.mouseClickEvents.size > 0) {
            // May be something to process
            // Get the relative coords
            const canvasRect = this.canvas.getBoundingClientRect();
            const relX = e.clientX - canvasRect.left;
            const relY = e.clientY - canvasRect.top;

            // Get the layouts that the cursor is currently on
            const currentlyOn = [];
            this.mouseClickEvents.forEach((handler, layout) => {
                if (layout.contains(relX, relY)) {
                    currentlyOn.push(layout);
                }
            });

            // list of all states which need to be drawn each frame
            const allStates: LayoutState[] = [];
            this.currStates.forEach(state => allStates.push(state));

            // The animations that will be played.
            const animSet = new AnimationSet(undefined, this.ctx, this.lastWidth, this.lastHeight, allStates);

            currentlyOn.forEach((layout: LayoutState) => {
                let handler = this.mouseClickEvents.get(layout);
                handler(layout, animSet, this);
            });

            animSet.start();
        } else if (this.currStep >= this.steps.length - 1) {
            this.restart();
        } else {
            this.nextStep();
        }
    }

    /**
     * Fire mouse events if necessary when the mouse moves.
     */
    protected handleMouseMove(e: MouseEvent) {
        if (this.mouseEnterEvents.size > 0 || this.mouseExitEvents.size > 0) {
            // May be something to process
            // Get the relative coords
            const canvasRect = this.canvas.getBoundingClientRect();
            const relX = e.clientX - canvasRect.left;
            const relY = e.clientY - canvasRect.top;
            
            // Get the layouts that the cursor is currently on
            const currentlyOn = [];
            this.mouseEnterEvents.forEach((handler, layout) => {
                if (layout.contains(relX, relY)) {
                    currentlyOn.push(layout);
                }
            });

            this.mouseExitEvents.forEach((handler, layout) => {
                if (layout.contains(relX, relY)) {
                    currentlyOn.push(layout);
                }
            });

            // list of all states which need to be drawn each frame
            const allStates: LayoutState[] = [];
            this.currStates.forEach(state => allStates.push(state));

            // The animations that will be played.
            const animSet = new AnimationSet(undefined, this.ctx, this.lastWidth, this.lastHeight, allStates);

            // For each layout the cursor is on, check if it
            // was on beforehand. If it was not, fire enter
            // event.
            currentlyOn.forEach((layout: LayoutState) => {
                if (this.mouseOnLast.indexOf(layout) === -1) {
                    // Fire the enter event
                    let handler = this.mouseEnterEvents.get(layout);
                    handler(layout, animSet, this);
                }
            });

            // For each layout the cursor was on, check if it
            // is still on. If not, fire the exit event.
            this.mouseOnLast.forEach((oldLayout: LayoutState) => {
                if (currentlyOn.indexOf(oldLayout) === -1) {
                    // Fire the exit event
                    let handler = this.mouseExitEvents.get(oldLayout);
                    handler(oldLayout, animSet, this);
                }
            });

            this.mouseOnLast = currentlyOn;
            animSet.start();

        }
    }

    /**
     * Start playing the steps one after another.
     */
    protected startAutoplay() {
        this.overlayContainer.style.display = "none";
        this.autoplay();
    }

    /**
     * Animate to the next step until done.
     */
    protected autoplay() {
        if (this.currStep >= this.steps.length - 1) {
            // At the end
            setTimeout(() => {
                this.stopAutoplay();
                this.currStep = 0;
                this.recalc(true);
            }, this.getAutoplayDelay(this.steps.length - 1));
        } else {
            // Can go to next step
            setTimeout(() => {
                this.nextStep(() => {
                    this.autoplay();
                });
            }, this.getAutoplayDelay(this.currStep));
        }
    }

    /**
     * Stop autoplaying.
     */
    protected stopAutoplay() {
        this.overlayContainer.style.display = "block";
    }

    /**
     * Get the delay before a step while autoplaying,
     * or 0 if none exists.
     * @param stepNum 
     */
    protected getAutoplayDelay(stepNum: number): number {
        if (this.isAutoplay.delays) {
            if (this.isAutoplay.delays[stepNum]) {
                return this.isAutoplay.delays[stepNum];
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    /**
     * Updates the font size for this canvas.
     * Should be called when the window size
     * changes.
     */
    protected updateFontSize() {
        this.fontSize = getFontSizeForTier(window['currentWidthTier']);
    }

    /**
     * Update the dimensions of all content, and the current layout.
     */
    protected updateDimensions() {
        this.forAllContent(content => {
            content.recalcDimensions();
        });
        if (this.currRootContainer) {
            this.currRootContainer.recalcDimensions();
        }
    }

    /**
     * Redraw the current step without animating.
     * Does not recalculate layout.
     */
    protected redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.currStates.forEach(f => {
            this.ctx.save();
            if (f.component instanceof EqContent) {
                f.component.interpColorOff();
                f.component.draw(f, f, 0, this.ctx);
            }
            this.ctx.restore();
        });
    }

    /**
     * Recalculates and redraws the current step.
     * @param reparse Whether to reparse the container hierarchy.
     */
    protected recalc(reparse: boolean) {
        let rootLayout;
        [
            this.currStates, 
            rootLayout,
            this.mouseEnterEvents, 
            this.mouseExitEvents, 
            this.mouseClickEvents,
            this.tempContent
        ] = this.calcLayout(this.currStep, reparse);
        this.mouseOnLast = [];
        let [width, height] = this.getSize(rootLayout);
        this.setSize(width, height);
        this.redraw();
        if (this.progress) {
            this.progress.draw(this.currStep / (this.steps.length - 1), width, height);
        }
    }

    /**
     * If possible, animate to the next step
     * in the sequence.
     * @param whenDone A function to call when the next step animation is complete.
     */
    protected nextStep(whenDone?: () => void) {
        if (this.currStep + 1 >= this.steps.length || this.currAnimation) {
            //Can't go to next step
            return;
        }

        this.currStep++;

        let oldStates = this.currStates;
        let rootLayout
        [
            this.currStates,
            rootLayout,
            this.mouseEnterEvents,
            this.mouseExitEvents,
            this.mouseClickEvents,
            this.tempContent
        ] = this.calcLayout(this.currStep, true);
        this.mouseOnLast = [];
        let [width, height] = this.getSize(rootLayout);
        this.currAnimation = this.diff(oldStates, width, height, this.currStep - 1, this.currStep, whenDone instanceof Function ? whenDone : undefined);
        this.currAnimation.start();
    }

    /**
     * If possible, animate to the previous step.
     */
    protected prevStep() {
        if (this.currStep - 1 < 0) {
            //Can't go to next step
            return;
        }

        // Stop the current animation if there is one
        if (this.currAnimation) {
            this.currAnimation.stop();
            this.redraw();
        }

        this.currStep--;

        let oldStates = this.currStates;
        let rootLayout;
        [
            this.currStates, 
            rootLayout,
            this.mouseEnterEvents,
            this.mouseExitEvents,
            this.mouseClickEvents,
            this.tempContent
        ] = this.calcLayout(this.currStep, true);
        this.mouseOnLast = [];
        let [width, height] = this.getSize(rootLayout);        
        this.currAnimation = this.diff(oldStates, width, height, this.currStep + 1, this.currStep, undefined);
        this.currAnimation.start();
    }

    /**
     * Return to the first step.
     */
    protected restart() {
        if (this.currAnimation || this.currStep === 0) {
            //Can't go to next step
            return;
        }

        let oldStep = this.currStep;
        this.currStep = 0;

        let oldStates = this.currStates;
        let rootLayout;
        [
            this.currStates, 
            rootLayout,
            this.mouseEnterEvents,
            this.mouseExitEvents,
            this.mouseClickEvents,
            this.tempContent
        ] = this.calcLayout(this.currStep, true);
        this.mouseOnLast = [];
        let [width, height] = this.getSize(rootLayout);
        this.currAnimation = this.diff(oldStates, width, height, oldStep, 0, undefined);
        this.currAnimation.start();
    }

    /**
     * Run a callback for all content.
     * @param forEach A function that will be passed each bit of content.
     */
    private forAllContent(forEach: (content: EqContent<any>) => void) {
        this.terms.forEach(forEach);
        this.hDividers.forEach(forEach);
        this.vDividers.forEach(forEach);
        this.radicals.forEach(forEach);
        this.tempContent.forEach(forEach);
    }
 
    /**
     * Calculates and returns a set of animations
     * to play between the current and old step. 
     * Also changes the canvas dimensions to
     * accommodate the new layout.
     * 
     * @param oldStates The Map of layouts from the previous step.
     * @param canvasWidth The width the canvas should be as of the current step.
     * @param canvasHeight The height the canvas should be as of the current step.
     * @param stepBefore The old step number.
     * @param stepAfter The current step number.
     * @param whenDone A function to call when the animation is done.
     */
    private diff(   oldStates: Map<EqComponent<any>, LayoutState>, canvasWidth: number, canvasHeight: number, 
                    stepBefore: number, stepAfter: number, whenDone: () => void): AnimationSet {

        let updateDimenAfter = canvasHeight < this.lastHeight;
        if (!updateDimenAfter) {
            this.setSize(canvasWidth, canvasHeight);
            /*
            IE Workaround: Setting size erases canvas,
            redraw immediately to avoid flash of blank.
            */
            if (isIE) {
                let actualCurrStates = this.currStates;
                this.currStates = oldStates;
                this.redraw();
                this.currStates = actualCurrStates;
            }
        }

        let set = new AnimationSet(() => {
            //When done
            if (updateDimenAfter) {
                this.setSize(canvasWidth, canvasHeight);
                this.redraw();
            }
            // Update next/restart button
            if (this.restartOrNextButton) {
                if (stepAfter === this.steps.length - 1) {
                    // Going to last step, show restart button (unless only two steps, can just go back)
                    this.restartOrNextButton.innerHTML = 'refresh';
                } else {
                    // Not going to last step, show next step button
                    this.restartOrNextButton.innerHTML = 'keyboard_arrow_right';
                }
            }
            // If we weren't animating the progress bar, draw it on the final frame.
            if (this.progress && updateDimenAfter) {
                this.progress.draw(this.currStep / (this.steps.length - 1), canvasWidth, canvasHeight);
            }
            this.currAnimation = undefined;
            if (whenDone) {
                whenDone();
            }
        }, this.ctx, this.lastWidth, this.lastHeight);

        //Get the step options for this transition
        let stepOptions: TransitionOptionsFormat;
        let reverseStep: boolean;
        if (stepBefore < stepAfter) {
            //Going forward
            stepOptions = this.getStepOptions(stepBefore, stepAfter);
            reverseStep = false;
        } else {
            //Going backwards
            stepOptions = this.getStepOptions(stepAfter, stepBefore);
            reverseStep = true;
        }
        //Whether a merge animation exists for this step
        let mergeExists = (ref: string) => {
            return stepOptions && stepOptions.merges && stepOptions.merges[ref];
        };
        //Whether a clone animation exists for this step
        let cloneExists = (ref: string) => {
            return stepOptions && stepOptions.clones && stepOptions.clones[ref];
        };
        //Whether an eval animation exists for this step
        let evalExists = (ref: string) => {
            return stepOptions && stepOptions.evals && stepOptions.evals[ref];
        };
        // Find the durations for each transition type (may be custom)
        const moveDuration = stepOptions && stepOptions.moveDuration ? stepOptions.moveDuration : C.moveDuration;
        let addDuration;
        let removeDuration;
        // Add and remove need to be switched if we're going backwards
        if (reverseStep) {
            addDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : C.removeDuration;
            removeDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : C.addDuration;
        } else {
            // Not going backwards
            addDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : C.addDuration;
            removeDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : C.removeDuration;
        }
        const maxDuration = Math.max(moveDuration, addDuration, removeDuration);
        //Add a merge animation
        let addMerge = function(mergeToRef: string, stateBefore: LayoutState) {
            let mergeTo = this.getContentFromRef(mergeToRef);
            let mergeToNewState = this.currStates.get(mergeTo);
            set.addAnimation(new MoveAnimation(stateBefore, mergeToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a clone animation
        let addClone = function(cloneFromRef: string, stateAfter: LayoutState) {
            let cloneFrom = this.getContentFromRef(cloneFromRef);
            let cloneFromOldState = oldStates.get(cloneFrom);
            set.addAnimation(new MoveAnimation(cloneFromOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);
        //Add an eval animation
        let addEval = function(evalToRef: string, stateBefore: LayoutState) {
            let evalTo = this.getContentFromRef(evalToRef);
            let evalToNewState = this.currStates.get(evalTo);
            set.addAnimation(new EvalAnimation(stateBefore, evalToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a reverse eval
        let addRevEval = function(evalToRef: string, stateAfter: LayoutState) {
            let evalTo = this.getContentFromRef(evalToRef);
            let evalToOldState = oldStates.get(evalTo);
            set.addAnimation(new ReverseEvalAnimation(evalToOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);

        //Animate the progress indicator
        if (this.progress && !updateDimenAfter) {
            set.addAnimation(new ProgressAnimation( stepBefore, stepAfter, this.steps.length, this.progress, set, maxDuration,
                                                    C.progressEasing, canvasWidth, canvasHeight));
        }

        //Look through content to see what has happened to it (avoiding containers)
        this.forAllContent(content => {

            let stateBefore: LayoutState = undefined;
            //We may be initilizing, where there are no old frames and everything is added
            if (oldStates !== undefined) stateBefore = oldStates.get(content);
            let stateAfter: LayoutState = this.currStates.get(content);
            let contentRef = content.getRef();

            if (stateBefore && stateAfter) {
                //Content has just moved
                set.addAnimation(new MoveAnimation(stateBefore, stateAfter, set, this.ctx, moveDuration));

            } else if (stateBefore) {
                //Doesn't exist after, has been removed
                if (mergeExists(contentRef)) {
                    //Do a merge animation
                    addMerge(stepOptions.merges[contentRef], stateBefore);
                } else if (evalExists(contentRef)) {
                    //Do an eval animation
                    addEval(stepOptions.evals[contentRef], stateBefore);
                } else if (reverseStep && cloneExists(contentRef)) {
                    //Do a reverse clone, aka merge.
                    //Cloning is "to": "from", need to work backwards
                    addMerge(stepOptions.clones[contentRef], stateBefore);
                } else {
                    //Do a regular remove animation
                    set.addAnimation(new RemoveAnimation(stateBefore, set, this.ctx, removeDuration));
                }

            } else if (stateAfter) {
                //Doesn't exist before, has been added
                if (cloneExists(contentRef)) {
                    //Do a clone animation
                    addClone(stepOptions.clones[contentRef], stateAfter);
                } else if (reverseStep && mergeExists(contentRef)) {
                    //Do a reverse merge, aka clone.
                    //Merging is "from": "to", need to work backwards.
                    addClone(stepOptions.merges[contentRef], stateAfter);
                } else if (reverseStep && evalExists(contentRef)) {
                    //Do a reverse eval
                    addRevEval(stepOptions.evals[contentRef], stateAfter);
                } else {
                    set.addAnimation(new AddAnimation(stateAfter, set, this.ctx, addDuration));
                }
            }

        });

        return set;
    }

    /**
     * Gets the dimensions of the canvas based on
     * the root layout state.
     * 
     * @param root The layout state of the root container.
     */
    protected getSize(root: LayoutState): [number, number] {
        let rootHeight = root.height;
        let rootWidth = root.width;
        let currWidth = this.container.clientWidth;
        let newWidth = rootWidth > currWidth ? rootWidth : currWidth;
        return [newWidth, rootHeight];
    }

    /**
     * Sets the dimensions of the canvas.
     * 
     * @param newWidth The new width.
     * @param newHeight The new height.
     */
    protected setSize(newWidth: number, newHeight: number) {
        if (newWidth === this.lastWidth && newHeight === this.lastHeight) {
            //Early return, no need to change size
            return;
        }

        //Update canvas css size
        this.canvas.style.width = newWidth + "px";
        this.canvas.style.height = newHeight + "px";

        //Update canvas pixel size for HDPI
        let pixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = newWidth * pixelRatio;
        this.canvas.height = newHeight * pixelRatio;
        this.ctx.scale(pixelRatio, pixelRatio);
        this.ctx.font = this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFamily;

        this.lastHeight = newHeight;
        this.lastWidth = newWidth;
    }

    /**
     * Uses the instructions to initialize all
     * content that will be used in the 
     * animation. Does not initialize the container
     * layout.
     * 
     * @param instructions The instructions JSON Object.
     */
    protected initContent(instructions: FileFormat) {
        this.termHeights = [];
        let ascents = [];

        if (instructions.terms.length > 0) {
            //Get the heights and ascents from each tier
            for (let w = 0; w < C.widthTiers.length; w++) {
                this.termHeights.push(instructions.metrics[w].height);
                ascents.push(instructions.metrics[w].ascent);
            }
        }

        //Initialize all terms
        for (let t = 0; t < instructions.terms.length; t++) {
            let widths = [];

            //Get the widths for each tier
            for (let w = 0; w < C.widthTiers.length; w++) {
                widths.push(instructions.metrics[w].widths[t]);
            }

            let text = instructions.terms[t];
            let term = new Term(text, widths, this.termHeights, ascents, 't' + t);
            this.terms.push(term);
        }
        //Initialize h dividers
        for (let i = 0; i < instructions.hDividers; i++) {
            this.hDividers.push(new HDivider(C.hDividerPadding, 'h' + i));
        }
        //Initialize v dividers
        for (let i = 0; i < instructions.vDividers; i++) {
            this.vDividers.push(new VDivider(C.vDividerPadding, 'v' + i));
        }
        //Initialize radicals
        for (let i = 0; i < instructions.radicals; i++) {
            this.radicals.push(new Radical('r' + i));
        }
    }

    /**
     * Returns the content for a particular
     * content reference as used in the JSON
     * format.
     * 
     * @param ref The content reference.
     */
    getContentFromRef(ref: string) {
        let contentType: string = ref.substring(0, 1);
        let contentIndex: number = parseFloat(ref.substring(1, ref.length));

        if (contentType === 't') {
            return this.terms[contentIndex];
        } else if (contentType === 'h') {
            return this.hDividers[contentIndex];
        } else if (contentType === 'r') {
            return this.radicals[contentIndex];
        } else if (contentType === 'v') {
            return this.vDividers[contentIndex];
        } else {
            throw "unrecognized content type";
        }
    }

    /**
     * Return the step options object for the
     * transition between two steps. Returns
     * undefined if there are no step options
     * for that transition. Step2 must be greater
     * than Step1.
     * 
     * @param step1 The first step.
     * @param step2 The second step.
     */
    protected getStepOptions(step1: number, step2: number): TransitionOptionsFormat {
        if (!this.stepOptions) {
            //No step options defined
            return undefined;
        }
        if (step2 - step1 !== 1) {
            //Steps are seperated or in the wrong order
            return undefined;
        }
        return this.stepOptions[step2 - 1];
    }

    /**
     * Calculate and return the layout for
     * a particular step. Returns [all layouts, root layout, mouse enter events, mouse exit events, mouse click events, temp content].
     * 
     * @param idx The step number.
     * @param reparse Whether to re-create the container hierarchy.
     */
    protected calcLayout(idx: number, reparse: boolean):  [ Map<EqComponent<any>, LayoutState>, LayoutState, 
                                                            Map<LayoutState, MouseEventCallback>,
                                                            Map<LayoutState, MouseEventCallback>,
                                                            Map<LayoutState, MouseEventCallback>,
                                                            EqContent<any>[]] {

        //First create the structure of containers in memory
        if (reparse) {
            let rootObj = this.steps[idx].root;
            this.currRootContainer = this.parseContainer(rootObj, 0);
        }
        //If content doesn't take up full width, center it
        let width = this.container.clientWidth;
        if (this.currRootContainer.getWidth() < width) {
            this.currRootContainer.setWidth(width);
        }
        //Apply fixed height
        if (this.fixedHeights) {
            let height = this.fixedHeights[window['currentWidthTier']];
            this.currRootContainer.setHeight(height);
        }

        //Set the text
        if (reparse && this.textArea) {
            this.textArea.innerHTML = this.steps[idx].text ? this.steps[idx].text : "";
        }

        //Get the color info
        let colorsObj = this.steps[idx].color;
        let opacityObj = this.steps[idx].opacity;

        let allLayouts = newMap();
        let mouseEnters = newMap();
        let mouseExits = newMap();
        let mouseClicks = newMap();
        let tempContent = [];
        let rootLayout = this.currRootContainer.addLayout(undefined, allLayouts, 0, 0, 1, opacityObj, colorsObj, 
                                        mouseEnters, mouseExits, mouseClicks, tempContent);
        return [allLayouts, rootLayout, mouseEnters, mouseExits, mouseClicks, tempContent];
    }

    /**
     * Parse a container from the JSON Object.
     * 
     * @param containerObj The JSON Object representing the container.
     * @param depth The depth in the layout tree.
     */
    protected parseContainer(containerObj: ContainerFormat, depth: number): EqContainer<any> {
        let type: string = containerObj.type;
        if (type === "vbox") {
            const c = this.parseContainerChildren((containerObj as LinearContainerFormat).children, depth + 1);
            const p = depth === 0 ? C.defaultRootVBoxPadding : Padding.even(C.defaultVBoxPadding);
            if (this.fixedHeights && depth === 0) {
                return new VCenterVBox(c, p);
            } else {
                return new VBox(c, p);
            }
        } else if (type === "hbox") {
            return new HBox(
                this.parseContainerChildren((containerObj as LinearContainerFormat).children, depth + 1),
                Padding.even(C.defaultHBoxPadding));
        } else if (type === "tightHBox") {
            return new TightHBox(
                this.parseContainerChildren((containerObj as LinearContainerFormat).children, depth + 1),
                Padding.even(C.defaultTightHBoxPadding)
            );
        } else if (type === 'subSuper') {
            let format = containerObj as SubSuperContainerFormat;
            let top = new HBox(
                this.parseContainerChildren(format.top, depth + 1),
                Padding.even(0)
            );
            let middle = new TightHBox(
                this.parseContainerChildren(format.middle, depth + 1),
                Padding.even(0)
            );
            let bottom = new HBox(
                this.parseContainerChildren(format.bottom, depth + 1),
                Padding.even(0)
            );
            let portrusion = format.portrusion ? format.portrusion : C.defaultExpPortrusion;
            return new SubSuper(top, middle, bottom, portrusion, C.defaultSubSuperPadding);
        } else if (type === 'root') {
            let format = containerObj as RootContainerFormat;
            let idx = new HBox(
                this.parseContainerChildren(format.idx, depth + 1),
                Padding.even(0)
            );
            let arg = new HBox(
                this.parseContainerChildren(format.arg, depth + 1),
                Padding.even(0)
            );
            let radical;
            if (format.rad) {
                radical = this.getContentFromRef(format.rad) as Radical;
            }
            return new RootContainer(idx, arg, radical, C.defaultRootPadding, this.termHeights);
        } else if (type === 'quiz') {
            let format = containerObj as QuizFormat;
            return new Quiz(
                this.parseContainerChildren(format.children, depth + 1),
                C.defaultQuizPadding,
                format.answers,
                this.customColors && this.customColors.curvedOutlineOpacity ? this.customColors.curvedOutlineOpacity : C.curvedOutlineDefaultOpacity,
                this.customColors && this.customColors.curvedOutlineColor ? this.customColors.curvedOutlineColor : C.curvedOutlineColor,
                this.customColors && this.customColors.radioButtonOpacity ? this.customColors.radioButtonOpacity : C.radioButtonDefaultOpacity,
                this.customColors && this.customColors.radioButtonColor ? this.customColors.radioButtonColor : C.radioButtonColor,
                this.customColors && this.customColors.quizCorrectColor ? this.customColors.quizCorrectColor : C.quizCorrectColor,
                this.customColors && this.customColors.quizIncorrectColor ? this.customColors.quizIncorrectColor : C.quizIncorrectColor
            );
        } else if (type === 'table') {
            let format = containerObj as TableFormat;
            let children = this.parseChildren2D(format.children);
            return new TableContainer(
                C.defaultTablePadding,
                children,
                this.parseChildrenObj(format.hLines),
                this.parseChildrenObj(format.vLines),
                1
            );
        } else if (type === undefined) {
            throw "Invalid JSON File: Missing type attribute on container descriptor.";
        } else {
            throw "Invalid JSON File: Unrecognized type: " + type;
        }
    }

    /**
     * Parse an object containing references with indices
     * as keys.
     * @param obj The object to parse. 
     */
    protected parseChildrenObj(obj: {[index: number]: string}): {[index: number]: EqComponent<any>} {
        let toReturn = {};
        if (!obj) {
            return toReturn;
        }
        Object.keys(obj).forEach(index => {
            let ref = obj[index];
            toReturn[index] = this.getContentFromRef(ref);
        });
        return toReturn;
    }

    /**
     * Parse a 2D array of components.
     * @param fromFile The array from the file.
     */
    protected parseChildren2D(fromFile: (string | ContainerFormat)[][]): EqComponent<any>[][] {
        const toReturn: EqComponent<any>[][] = [];
        fromFile.forEach(row => {
            toReturn.push(this.parseContainerChildren(row, 1));
        });
        return toReturn;
    }

    /**
     * Parse the children attribute of a container
     * JSON Object.
     * 
     * @param children The children array.
     * @param depth The depth in the layout tree.
     */
    protected parseContainerChildren(children: any[], depth: number): EqComponent<any>[] {
        let toReturn = [];
        children.forEach(child => {
            if (typeof child === 'object') {
                if (child === null) {
                    toReturn.push(undefined);
                } else {
                    toReturn.push(this.parseContainer(child, depth + 1));
                }
            } else if (typeof child === 'string') {
                toReturn.push(this.getContentFromRef(child));
            } else {
                throw "Invalid type of child in JSON file.";
            }
        });
        return toReturn;
    }

}
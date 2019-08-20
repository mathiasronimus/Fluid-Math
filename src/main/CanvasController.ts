import EqComponent from "../layout/EqComponent";
import LayoutState from "../animation/LayoutState";
import EqContainer from "../layout/EqContainer";
import AnimationSet from '../animation/AnimationSet';
import MoveAnimation from "../animation/MoveAnimation";
import RemoveAnimation from "../animation/RemoveAnimation";
import AddAnimation from "../animation/AddAnimation";
import EvalAnimation from '../animation/EvalAnimation';
import ReverseEvalAnimation from '../animation/ReverseEvalAnimation';
import { backgroundColor, buttonHighlightDuration, buttonHighlightEasing, buttonHighlightedOpacity, buttonUnhighlightDuration, buttonUnhighlightEasing, defaultMoveDuration, defaultRemoveDuration, defaultAddDuration, progressEasing } from './consts';
import EqContent from "../layout/EqContent";
import ProgressAnimation from "../animation/ProgressAnimation";
import { getFontSizeForTier, Map, newMap, isIE, getFont, rgbaArrayToCssString } from "./helpers";
import { StepFormat, TransitionOptionsFormat, FileFormat, AutoplayFormat, ColorsFormat } from "./FileFormat";
import ProgressIndicator from "./ProgressIndicator";
import ContentLayoutState from "../animation/ContentLayoutState";
import BezierCallback from "../animation/BezierCallback";
import { ComponentModel } from "./ComponentModel";

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
    protected backgroundFill: string;

    protected currStep = 0;
    protected steps: StepFormat[];
    protected stepOptions: TransitionOptionsFormat[];
    protected isAutoplay: AutoplayFormat;
    protected customColors: ColorsFormat;

    protected components: ComponentModel;
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
        this.setSize = this.setSize.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        
        this.isAutoplay = instructions.autoplay;
        this.customColors = colors;
        
        // Create canvas
        let canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.container.appendChild(canvasContainer);
        
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        canvasContainer.appendChild(this.canvas);

        // Set background color
        this.backgroundFill = rgbaArrayToCssString(colors && colors.canvasBackground ? colors.canvasBackground : backgroundColor);
        
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
        this.initComponents(instructions);
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
     * Initialize the components/content and 
     * add general information.
     */
    protected initComponents(instructions: FileFormat) {
        this.components = new ComponentModel(instructions);
        this.components.setGenInfo('customColors', this.customColors);
        this.components.setGenInfo('fixedHeights', this.fixedHeights);
    }

    /**
     * Emphasize a button.
     * @param button The element of the button.
     */
    protected highlightButton(button: HTMLElement) {
        const set = new AnimationSet(() => {}, this.ctx, 0, 0, this.backgroundFill);

        const anim = new class extends BezierCallback {
            constructor() {
                super(buttonHighlightDuration, buttonHighlightEasing, set);
            }
            protected step(completion: number): void {
                const opacity = 0.4 * (1 - completion) + buttonHighlightedOpacity * completion;
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
        const set = new AnimationSet(() => {}, this.ctx, 0, 0, this.backgroundFill);

        const anim = new class extends BezierCallback {
            constructor() {
                super(buttonUnhighlightDuration, buttonUnhighlightEasing, set);
            }
            protected step(completion: number): void {
                const opacity = buttonHighlightedOpacity * (1 - completion) + 0.4 * completion;
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
            const animSet = new AnimationSet(undefined, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill, allStates);

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
            const animSet = new AnimationSet(undefined, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill, allStates);

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
        this.ctx.save();
        const pixelRatio = window.devicePixelRatio || 1;
        this.ctx.fillStyle = this.backgroundFill;
        this.ctx.fillRect(0, 0, this.canvas.width / pixelRatio, this.canvas.height / pixelRatio);
        this.ctx.restore();
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
        this.components.forAllContent(forEach);
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
        }, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill);

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
        const moveDuration = stepOptions && stepOptions.moveDuration ? stepOptions.moveDuration : defaultMoveDuration;
        let addDuration;
        let removeDuration;
        // Add and remove need to be switched if we're going backwards
        if (reverseStep) {
            addDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : defaultRemoveDuration;
            removeDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : defaultAddDuration;
        } else {
            // Not going backwards
            addDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : defaultAddDuration;
            removeDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : defaultRemoveDuration;
        }
        const maxDuration = Math.max(moveDuration, addDuration, removeDuration);
        //Add a merge animation
        let addMerge = function(mergeToRef: string, stateBefore: LayoutState) {
            let mergeTo = this.components.getContent(mergeToRef);
            let mergeToNewState = this.currStates.get(mergeTo);
            set.addAnimation(new MoveAnimation(stateBefore, mergeToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a clone animation
        let addClone = function(cloneFromRef: string, stateAfter: LayoutState) {
            let cloneFrom = this.components.getContent(cloneFromRef);
            let cloneFromOldState = oldStates.get(cloneFrom);
            set.addAnimation(new MoveAnimation(cloneFromOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);
        //Add an eval animation
        let addEval = function(evalToRef: string, stateBefore: LayoutState) {
            let evalTo = this.components.getContent(evalToRef);
            let evalToNewState = this.currStates.get(evalTo);
            set.addAnimation(new EvalAnimation(stateBefore, evalToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a reverse eval
        let addRevEval = function(evalToRef: string, stateAfter: LayoutState) {
            let evalTo = this.components.getContent(evalToRef);
            let evalToOldState = oldStates.get(evalTo);
            set.addAnimation(new ReverseEvalAnimation(evalToOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);

        //Animate the progress indicator
        if (this.progress && !updateDimenAfter) {
            set.addAnimation(new ProgressAnimation( stepBefore, stepAfter, this.steps.length, this.progress, set, maxDuration,
                                                    progressEasing, canvasWidth, canvasHeight));
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
            this.currRootContainer = this.components.parseContainer(rootObj, 0);
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
}
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
import { StepFormat, TransitionOptionsFormat, FileFormat, ContainerFormat, LinearContainerFormat, SubSuperContainerFormat, RootContainerFormat, AutoplayFormat } from "./FileFormat";
import ProgressIndicator from "./ProgressIndicator";

/**
 * Responsible for managing a single canvas,
 * playing through the set of instructions
 * and animating.
 */
export default class CanvasController {

    protected container: Element;
    protected textArea: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected overlayContainer: HTMLElement;
    protected ctx: CanvasRenderingContext2D;
    protected progress: ProgressIndicator;

    protected currStep = 0;
    protected steps: StepFormat[];
    protected stepOptions: TransitionOptionsFormat[];
    protected isAutoplay: AutoplayFormat;

    protected terms: Term[];
    protected termHeights: number[];
    protected hDividers: HDivider[];
    protected radicals: Radical[];

    protected currStates: Map<EqComponent<any>, LayoutState>;
    protected animating = false;

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
    constructor(container: HTMLElement, instructions: FileFormat) {
        this.container = container;
        this.steps = instructions.steps;
        this.stepOptions = instructions.stepOpts;
        this.terms = [];
        this.hDividers = [];
        this.radicals = [];
        this.setSize = this.setSize.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);

        this.isAutoplay = instructions.autoplay;
        
        //Create area above canvas
        let upperArea = document.createElement("div");
        upperArea.className = "eqUpper";
        this.container.appendChild(upperArea);
        
        //Create back button, if needed
        if (this.steps.length > 1 && !this.isAutoplay) {
            let backButton = document.createElement("div");
            backButton.className = "material-icons eqIcon";
            backButton.innerHTML = "arrow_back";
            upperArea.appendChild(backButton);
            this.prevStep = this.prevStep.bind(this);
            backButton.addEventListener("click", this.prevStep);
        }
        
        // Create text area, if needed
        // text doesn't show if: none of the steps define any text
        for (let i = 0; i < this.steps.length; i++) {
            let step = this.steps[i];
            if (step.text) {
                this.textArea = document.createElement("div");
                this.textArea.className = "eqText";
                upperArea.appendChild(this.textArea);
                break;
            }
        }
        
        //Create restart button and progress indicator
        if (this.steps.length > 1 && !this.isAutoplay) {
            let restButton = document.createElement("div");
            restButton.className = "material-icons eqIcon restartIcon";
            restButton.innerHTML = "replay";
            upperArea.appendChild(restButton);
            this.restart = this.restart.bind(this);
            restButton.addEventListener("click", this.restart);

            const progressCanvas = document.createElement("canvas");
            progressCanvas.className = "progressCanvas";
            progressCanvas.setAttribute("height", ProgressIndicator.DIMEN + "");
            progressCanvas.setAttribute("width", ProgressIndicator.DIMEN + "");
            this.progress = new ProgressIndicator(progressCanvas);
            upperArea.appendChild(progressCanvas);
        }
        
        //Create canvas
        let canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.container.appendChild(canvasContainer);
        
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        canvasContainer.appendChild(this.canvas);
        
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
        this.recalc();
        
        //Bind next step to canvas/text click if not autoplaying
        if (!this.isAutoplay) {
            this.nextStep = this.nextStep.bind(this);
            this.canvas.addEventListener("click", this.nextStep as () => void);
            if (this.textArea) {
                this.textArea.addEventListener('click', this.nextStep as () => void);
            }
        }

        //Redraw when window size changes
        this.recalc = this.recalc.bind(this);
        window.addEventListener('resize', this.updateFontSize.bind(this));
        window.addEventListener('resize', this.recalc);

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
                this.recalc();
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
     */
    protected recalc() {
        let rootLayout;
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);
        this.setSize(width, height);
        this.redraw();
    }

    /**
     * If possible, animate to the next step
     * in the sequence.
     * @param whenDone A function to call when the next step animation is complete.
     */
    protected nextStep(whenDone: () => void) {
        if (this.currStep + 1 >= this.steps.length || this.animating) {
            //Can't go to next step
            return;
        }

        this.currStep++;

        let oldStates = this.currStates;
        let rootLayout
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);
        let anims = this.diff(oldStates, width, height, this.currStep - 1, this.currStep, whenDone instanceof Function ? whenDone : undefined);
        this.animating = true;
        anims.start();
    }

    /**
     * If possible, animate to the previous step.
     */
    protected prevStep() {
        if (this.currStep - 1 < 0 || this.animating) {
            //Can't go to next step
            return;
        }

        this.currStep--;

        let oldStates = this.currStates;
        let rootLayout;
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);        
        let anims = this.diff(oldStates, width, height, this.currStep + 1, this.currStep, undefined);
        this.animating = true;
        anims.start();
    }

    /**
     * Return to the first step.
     */
    protected restart() {
        if (this.animating) {
            //Can't go to next step
            return;
        }

        let oldStep = this.currStep;
        this.currStep = 0;

        let oldStates = this.currStates;
        let rootLayout;
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);
        let anims = this.diff(oldStates, width, height, oldStep, 0, undefined);
        this.animating = true;
        anims.start();
    }

    /**
     * Run a callback for all content.
     * @param forEach A function that will be passed each bit of content.
     */
    private forAllContent(forEach: (content: EqContent<any>) => void) {
        this.terms.forEach(term => {
            forEach(term);
        });
        this.hDividers.forEach(hDivider => {
            forEach(hDivider);
        });
        this.radicals.forEach(radical => {
            forEach(radical);
        });
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
            this.animating = false;
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

        //Animate the progress circle
        if (this.progress) {
            set.addAnimation(new ProgressAnimation(stepBefore, stepAfter, this.steps.length, this.progress, set, maxDuration));
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
     * a particular step. Returns [all layouts, root layout].
     * 
     * 
     * @param idx The step number.
     */
    protected calcLayout(idx: number): [Map<EqComponent<any>, LayoutState>, LayoutState] {

        //First create the structure of containers in memory
        let rootObj = this.steps[idx].root;
        let root = this.parseContainer(rootObj, 0);
        //If content doesn't take up full width, center it
        let width = this.container.clientWidth;
        if (root.getWidth() < width) {
            root.setWidth(width);
        }
        //Apply fixed height
        if (this.fixedHeights) {
            let height = this.fixedHeights[window['currentWidthTier']];
            root.setHeight(height);
        }

        //Set the text
        if (this.textArea) {
            this.textArea.innerHTML = this.steps[idx].text ? this.steps[idx].text : "";
        }

        //Get the color info
        let colorsObj = this.steps[idx].color;
        let opacityObj = this.steps[idx].opacity;

        let allLayouts = newMap();
        let rootLayout = root.addLayout(undefined, allLayouts, 0, 0, 1, opacityObj, colorsObj);
        return [allLayouts, rootLayout];
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
            const p = Padding.even(C.defaultVBoxPadding);
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
            return new RootContainer(idx, arg, radical, C.defaultRootPadding, this.termHeights[getWidthTier()]);
        } else if (type === undefined) {
            throw "Invalid JSON File: Missing type attribute on container descriptor.";
        } else {
            throw "Invalid JSON File: Unrecognized type: " + type;
        }
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
                toReturn.push(this.parseContainer(child, depth + 1));
            } else if (typeof child === 'string') {
                toReturn.push(this.getContentFromRef(child));
            } else {
                throw "Invalid type of child in JSON file.";
            }
        });
        return toReturn;
    }

}
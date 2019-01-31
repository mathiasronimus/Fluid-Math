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
import C from './consts';
import EqContent from "../layout/EqContent";
import ProgressAnimation from "../animation/ProgressAnimation";
import HDivider from "../layout/HDivider";
import TightHBox from "../layout/TightHBox";
import SubSuper from "../layout/SubSuper";
import { getFontSizeForTier, Map, newMap } from "./helpers";

/**
 * Responsible for managing a single canvas,
 * playing through the set of instructions
 * and animating.
 */
export default class CanvasController {

    protected container: Element;
    protected textArea: HTMLDivElement;
    protected progressLine: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    protected currStep = 0;
    protected steps: any[];
    protected stepOptions: any[];

    protected terms: Term[];
    protected hDividers: HDivider[];

    protected currStates: Map<EqComponent, LayoutState>;
    protected animating = false;
    protected fontSize: number;
    protected lastHeight: number = 0;
    protected lastWidth: number = 0;

    /**
     * Create a new Canvas Controller,
     * setting up equation playback in the
     * given container.
     * @param container The container. 
     * @param instructions The instructions.
     */
    constructor(container: Element, instructions) {
        this.container = container;
        this.steps = instructions['steps'];
        this.stepOptions = instructions['stepOpts'];
        this.terms = [];
        this.hDividers = [];
        this.setSize = this.setSize.bind(this);

        this.progressLine = document.createElement('div');
        this.progressLine.className = "progressLine";
        this.container.appendChild(this.progressLine);
        this.progressLine.style.left = C.borderRadius + 'px';

        //Create area above canvas
        let upperArea = document.createElement("div");
        upperArea.className = "eqUpper";
        this.container.appendChild(upperArea);

        //Create back button, if needed
        if (this.steps.length > 1) {
            let backButton = document.createElement("div");
            backButton.className = "material-icons eqIcon";
            backButton.innerHTML = "arrow_back";
            upperArea.appendChild(backButton);
            this.prevStep = this.prevStep.bind(this);
            backButton.addEventListener("click", this.prevStep);
        }

        //Create text area, if needed
        //text doesn't show if: there is only one step and it has no text
        if (!(this.steps.length === 1 && this.steps[0]['text'] === undefined)) {
            this.textArea = document.createElement("div");
            this.textArea.className = "eqText";
            this.textArea.innerHTML = "test";
            upperArea.appendChild(this.textArea);
        }

        //Create restart button
        if (this.steps.length > 1) {
            let restButton = document.createElement("div");
            restButton.className = "material-icons eqIcon";
            restButton.innerHTML = "replay";
            upperArea.appendChild(restButton);
            this.restart = this.restart.bind(this);
            restButton.addEventListener("click", this.restart);
        }

        //Create canvas
        let canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.container.appendChild(canvasContainer);

        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        canvasContainer.appendChild(this.canvas);

        //Initialize Components and display first step
        this.initContent(instructions);
        this.updateFontSize();
        this.recalc();

        //Bind next step to canvas/text click
        this.nextStep = this.nextStep.bind(this);
        this.canvas.addEventListener("click", this.nextStep);
        if (this.textArea) {
            this.textArea.addEventListener('click', this.nextStep);
        }

        //Redraw when window size changes
        this.recalc = this.recalc.bind(this);
        window.addEventListener('resize', this.updateFontSize.bind(this));
        window.addEventListener('resize', this.recalc);
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

        //Redraw the progress line
        let widthPerSegment = (this.container.clientWidth - C.borderRadius*2) / (this.steps.length - 1);
        this.progressLine.style.width = (this.currStep * widthPerSegment) + "px";
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
     */
    protected nextStep() {
        if (this.currStep + 1 >= this.steps.length || this.animating) {
            //Can't go to next step
            return;
        }

        this.currStep++;

        let oldStates = this.currStates;
        let rootLayout
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);
        let anims = this.diff(oldStates, width, height, this.currStep - 1, this.currStep);
        this.animating = true;
        anims.start();
    }

    /**
     * If possible, animate to the previous step.
     */
    private prevStep() {
        if (this.currStep - 1 < 0 || this.animating) {
            //Can't go to next step
            return;
        }

        this.currStep--;

        let oldStates = this.currStates;
        let rootLayout;
        [this.currStates, rootLayout] = this.calcLayout(this.currStep);
        let [width, height] = this.getSize(rootLayout);        
        let anims = this.diff(oldStates, width, height, this.currStep + 1, this.currStep);
        this.animating = true;
        anims.start();
    }

    /**
     * Return to the first step.
     */
    private restart() {
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
        let anims = this.diff(oldStates, width, height, oldStep, 0);
        this.animating = true;
        anims.start();
    }

    /**
     * Returns the total amount of content
     * in this slideshow.
     */
    private getNumContent(): number {
        return this.terms.length + this.hDividers.length;
    }

    /**
     * Returns whether the concatenated
     * index belongs to a term.
     * 
     * @param i The index.
     */
    private inTermRange(i: number): boolean {
        return i >= 0 && i < this.terms.length;
    }

    /**
     * Returns whether the concatenated
     * index belongs to an h divider.
     * 
     * @param i The index.
     */
    private inHDividerRange(i: number): boolean {
        return i >= this.terms.length && i < this.terms.length + this.hDividers.length;
    }

    /**
     * Returns the content for a particular
     * index. This is used when looping through
     * all content. The order goes Terms,
     * 
     * @param i The index of the content to get.
     */
    private getContent(i): EqContent<any> {
        if (this.inTermRange(i)) {
            return this.terms[i];
        } else if (this.inHDividerRange(i)) {
            return this.hDividers[i - this.terms.length];
        } else {
            throw "content out of bounds";
        }
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
     */
    private diff(oldStates: Map<EqComponent, LayoutState>, canvasWidth: number, canvasHeight: number, stepBefore: number, stepAfter: number): AnimationSet {

        let updateDimenAfter = canvasHeight < this.lastHeight;
        if (!updateDimenAfter) {
            this.setSize(canvasWidth, canvasHeight);
        }

        let set = new AnimationSet(() => {
            //When done
            if (updateDimenAfter) {
                this.setSize(canvasWidth, canvasHeight);
                this.redraw();
            }
            this.animating = false;
        }, this.ctx, this.lastWidth, this.lastHeight);

        //Get the step options for this transition
        let stepOptions;
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

        //Animate the progress bar
        set.addAnimation(new ProgressAnimation(stepBefore, stepAfter, this.steps.length, this.container.clientWidth, this.progressLine, set));

        //Look through content to see what has happened to it (avoiding containers)
        for (let i = 0; i < this.getNumContent(); i++) {
            let content = this.getContent(i);

            let stateBefore: LayoutState = undefined;
            //We may be initilizing, where there are no old frames and everything is added
            if (oldStates !== undefined) stateBefore = oldStates.get(content);

            let stateAfter: LayoutState = this.currStates.get(content);

            let contentRef = this.getContentRefFromIndex(i);

            if (stateBefore && stateAfter) {
                //Content has just moved
                set.addAnimation(new MoveAnimation(stateBefore, stateAfter, set, this.ctx));
            } else if (stateBefore) {
                //Doesn't exist after, has been removed
                if (stepOptions && stepOptions['merges'] && stepOptions['merges'][contentRef]) {
                    //Do a merge animation
                    let mergeToRef = stepOptions['merges'][contentRef];
                    let mergeTo = this.getContentFromRef(mergeToRef);
                    let mergeToNewState = this.currStates.get(mergeTo);
                    set.addAnimation(new MoveAnimation(stateBefore, mergeToNewState, set, this.ctx));
                } else if (reverseStep && stepOptions && stepOptions['clones'] && stepOptions['clones'][contentRef]) {
                    //Do a reverse clone, aka merge.
                    //Cloning is "to": "from", need to work backwards
                    let mergeToRef = stepOptions['clones'][contentRef];
                    let mergeTo = this.getContentFromRef(mergeToRef);
                    let mergeToNewState = this.currStates.get(mergeTo);
                    set.addAnimation(new MoveAnimation(stateBefore, mergeToNewState, set, this.ctx));
                } else {
                    //Do a regular remove animation
                    set.addAnimation(new RemoveAnimation(stateBefore, set, this.ctx));
                }
            } else if (stateAfter) {
                //Doesn't exist before, has been added
                if (stepOptions && stepOptions['clones'] && stepOptions['clones'][contentRef]) {
                    //Do a clone animation
                    let cloneFromRef = stepOptions['clones'][contentRef];
                    let cloneFrom = this.getContentFromRef(cloneFromRef);
                    let cloneFromOldState = oldStates.get(cloneFrom);
                    set.addAnimation(new MoveAnimation(cloneFromOldState, stateAfter, set, this.ctx));
                } else if (reverseStep && stepOptions && stepOptions['merges'] && stepOptions['merges'][contentRef]) {
                    //Do a reverse merge, aka clone.
                    //Merging is "from": "to", need to work backwards.
                    let cloneFromRef = stepOptions['merges'][contentRef];
                    let cloneFrom = this.getContentFromRef(cloneFromRef);
                    let cloneFromOldState = oldStates.get(cloneFrom);
                    set.addAnimation(new MoveAnimation(cloneFromOldState, stateAfter, set, this.ctx));
                } else {
                    set.addAnimation(new AddAnimation(stateAfter, set, this.ctx));
                }
            }

        }

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
        this.ctx.font = C.fontWeight + " " + this.fontSize + "px " + C.fontFamily;

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
    protected initContent(instructions) {
        let heights = [];
        let ascents = [];

        if (instructions.terms.length > 0) {
            //Get the heights and ascents from each tier
            for (let w = 0; w < C.widthTiers.length; w++) {
                heights.push(instructions.metrics[w].height);
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
            let term = new Term(text, widths, heights, ascents, 't' + t);
            this.terms.push(term);
        }
        //Initialize h dividers
        for (let i = 0; i < instructions.hDividers; i++) {
            this.hDividers.push(new HDivider(C.hDividerPadding, 'h' + i));
        }
    }

    /**
     * Given a piece of content, get the
     * string used to reference it in the
     * JSON instructions.
     * 
     * @param content The content to find a reference for.
     */
    getContentReference(content: EqContent<any>): string {
        if (content instanceof Term) {
            return 't' + this.terms.indexOf(content);
        } else if (content instanceof HDivider) {
            return 'h' + this.hDividers.indexOf(content);
        } else {
            throw "unrecognized content type";
        }
    }

    /**
     * Given the concatenated index of
     * some content, get the reference
     * for it. Preferred to the above method.
     * 
     * @param index The concatenated index of the content.
     */
    getContentRefFromIndex(index: number) {
        if (this.inTermRange(index)) {
            return 't' + index;
        } else if (this.inHDividerRange(index)) {
            return 'h' + (index - this.terms.length);
        } else {
            throw "unrecognized content type";
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
    protected getStepOptions(step1: number, step2: number): any {
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
    protected calcLayout(idx): [Map<EqComponent, LayoutState>, LayoutState] {

        //First create the structure of containers in memory
        let rootObj = this.steps[idx].root;
        let root = this.parseContainer(rootObj);
        //If content doesn't take up full width, center it
        let width = this.container.clientWidth;
        if (root.getWidth() < width) {
            root.setWidth(width);
        }

        //Set the text
        if (this.textArea) {
            this.textArea.innerHTML = this.steps[idx].text;
        }

        //Get the color info
        let colorsObj = this.steps[idx]['color'];
        let opacityObj = this.steps[idx]['opacity'];

        let allLayouts = newMap();
        let rootLayout = root.addLayout(undefined, allLayouts, 0, 0, 1, opacityObj, colorsObj);
        return [allLayouts, rootLayout];
    }

    /**
     * Parse a container from the JSON Object.
     * 
     * @param containerObj The JSON Object representing the container.
     */
    protected parseContainer(containerObj): EqContainer {
        let type: string = containerObj.type;
        if (type === "vbox") {
            return new VBox(
                this.parseContainerChildren(containerObj.children),
                Padding.even(C.defaultVBoxPadding));
        } else if (type === "hbox") {
            return new HBox(
                this.parseContainerChildren(containerObj.children),
                Padding.even(C.defaultHBoxPadding));
        } else if (type === "tightHBox") {
            return new TightHBox(
                this.parseContainerChildren(containerObj.children),
                Padding.even(C.defaultTightHBoxPadding)
            );
        } else if (type === 'subSuper') {
            let top = new HBox(
                this.parseContainerChildren(containerObj.top),
                Padding.even(0)
            );
            let middle = new TightHBox(
                this.parseContainerChildren(containerObj.middle),
                Padding.even(0)
            );
            let bottom = new HBox(
                this.parseContainerChildren(containerObj.bottom),
                Padding.even(0)
            );
            let portrusion = containerObj['portrusion'] ? containerObj['portrusion'] : C.defaultExpPortrusion;
            return new SubSuper(top, middle, bottom, portrusion, C.defaultSubSuperPadding);
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
     */
    protected parseContainerChildren(children: any[]): EqComponent[] {
        let toReturn = [];
        children.forEach(child => {
            if (typeof child === 'object') {
                toReturn.push(this.parseContainer(child));
            } else if (typeof child === 'string') {
                toReturn.push(this.getContentFromRef(child));
            } else {
                throw "Invalid type of child in JSON file.";
            }
        });
        return toReturn;
    }

}
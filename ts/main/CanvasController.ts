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
import CanvasSizeAnimation from "../animation/CanvasSizeAnimation";
import C from './consts';
import EqContent from "../layout/EqContent";
import ColorAnimation from "../animation/ColorAnimation";
import OpacityAnimation from "../animation/OpacityAnimation";
import ProgressAnimation from "../animation/ProgressAnimation";
import HDivider from "../layout/HDivider";
import TightHBox from "../layout/TightHBox";
import SubSuper from "../layout/SubSuper";

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

    protected terms: Term[];
    protected hDividers: HDivider[];

    protected currStates: LayoutState[];
    protected animating = false;
    protected lastHeight = 0;

    /**
     * Create a new Canvas Controller,
     * setting up equation playback in the
     * given container.
     * @param container The container. 
     * @param instructions The instructions.
     */
    constructor(container: Element, instructions) {
        this.container = container;
        this.steps = instructions.steps;
        this.terms = [];
        this.hDividers = [];
        this.fitSize = this.fitSize.bind(this);

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
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.container.appendChild(this.canvas);

        //Initialize Components and display first step
        this.initContent(instructions);
        this.recalc();

        //Bind next step to canvas/text click
        this.nextStep = this.nextStep.bind(this);
        this.canvas.addEventListener("click", this.nextStep);
        if (this.textArea) {
            this.textArea.addEventListener('click', this.nextStep);
        }

        //Redraw when window size changes
        this.recalc = this.recalc.bind(this);
        window.addEventListener('resize', this.recalc);
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
                f.component.setColor(this.getColorForContent(this.getContentReference(f.component)));
                f.component.setOpacity(this.getOpacityForContent(this.getContentReference(f.component)));
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
        this.currStates = this.calcLayout(this.currStep);
        let height = this.currStates[this.currStates.length - 1].height;
        this.fitSize(height);
        this.lastHeight = height;
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
        this.currStates = this.calcLayout(this.currStep);

        let rootLayout = this.currStates[this.currStates.length - 1];
        let height = rootLayout.height;
        let anims = this.diff(oldStates, this.lastHeight, height, this.currStep - 1, this.currStep);
        this.lastHeight = height;
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
        this.currStates = this.calcLayout(this.currStep);

        let rootLayout = this.currStates[this.currStates.length - 1];
        let height = rootLayout.height;
        let anims = this.diff(oldStates, this.lastHeight, height, this.currStep + 1, this.currStep);
        this.lastHeight = height;
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
        this.currStates = this.calcLayout(this.currStep);

        let rootLayout = this.currStates[this.currStates.length - 1];
        let height = rootLayout.height;
        let anims = this.diff(oldStates, this.lastHeight, height, oldStep, 0);
        this.lastHeight = height;
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
     * Also animates the canvas height to
     * accomodate the new layout.
     * 
     * @param oldStates The set of layouts from the previous step.
     * @param cHeightBefore The height of the canvas before the animation.
     * @param cHeightAfter The height of the canvas after the animation.
     */
    private diff(oldStates: LayoutState[], cHeightBefore: number, cHeightAfter: number, stepBefore: number, stepAfter: number): AnimationSet {

        let set = new AnimationSet(() => {
            //When done
            this.animating = false;
        });

        set.addAnimation(new CanvasSizeAnimation(cHeightBefore, cHeightAfter, this.fitSize, set));
        set.addAnimation(new ProgressAnimation(stepBefore, stepAfter, this.steps.length, this.container.clientWidth, this.progressLine, set));

        //Look through content to see what has happened to it (avoiding containers)
        for (let i = 0; i < this.getNumContent(); i++) {
            let content = this.getContent(i);

            let stateBefore: LayoutState = undefined;
            //We may be initilizing, where there are no old frames and everything is added
            if (oldStates !== undefined) for (let o = 0; o < oldStates.length; o++) {
                let oldState = oldStates[o];
                if (oldState.component === content) {
                    stateBefore = oldState;
                    break;
                }
            }

            let stateAfter: LayoutState = undefined;
            for (let n = 0; n < this.currStates.length; n++) {
                let newState = this.currStates[n];
                if (newState.component === content) {
                    stateAfter = newState;
                    break;
                }
            }

            let contentRef = this.getContentRefFromIndex(i);
            let colorAfter: number[] = this.getColorForContent(contentRef);
            let opacityAfter: number = this.getOpacityForContent(contentRef);

            if (stateBefore && stateAfter) {
                //If color has changed, animate it
                if (content.hasDifferentColor(colorAfter)) {
                    set.addAnimation(new ColorAnimation(content.getColor(), colorAfter, set, content));
                }
                //If opacity has changed, animate it
                if (content.getOpacity() !== opacityAfter) {
                    set.addAnimation(new OpacityAnimation(content.getOpacity(), opacityAfter, content, set));
                }
                //Content has just moved
                set.addAnimation(new MoveAnimation(stateBefore, stateAfter, set, this.ctx));
            } else if (stateBefore) {
                //Doesn't exist after, has been removed
                set.addAnimation(new RemoveAnimation(stateBefore, set, this.ctx));
            } else if (stateAfter) {
                //Doesn't exist before, has been added
                set.addAnimation(new AddAnimation(stateAfter, set, this.ctx));
                //Set the color immediately
                content.setColor(colorAfter);
                //Set the opacity immediately
                content.setOpacity(opacityAfter);
            }

        }

        return set;
    }

    /**
     * Given a piece of content, determine
     * what color it should be for the current
     * step.
     * 
     * @param contentRef The reference of the content to find the color for.
     */
    private getColorForContent(contentRef: string): number[] {
        let stepColors = this.steps[this.currStep]['color'];
        if (stepColors !== undefined && stepColors[contentRef] !== undefined) {
            //A color is specified
            return C.colors[stepColors[contentRef]];
        } else {
            //A color isn't specified, use default
            return C.colors['default'];
        }
    }

    /**
     * Gets the opacity for a piece of content
     * at the current step.
     * 
     * @param contentRef The reference of the content to find the opacity of.
     */
    private getOpacityForContent(contentRef: string): number {
        let stepOpacity = this.steps[this.currStep]['opacity'];
        if (stepOpacity !== undefined && stepOpacity[contentRef] !== undefined) {
            //Opacity specified
            return stepOpacity[contentRef];
        } else {
            //No opacity specified
            return C.normalOpacity;
        }
    }

    /**
     * Fit the width of the canvas to the container,
     * but set the height.
     * 
     * @param h The new height.
     */
    private fitSize(h: number) {
        let contWidth = this.container.clientWidth;
        this.setSize(contWidth, h);
    }

    /**
     * Sets the size of the canvas and updates
     * the pixel ratio.
     * @param w The number of css pixels in width.
     * @param h The number of css pixel in height.
     */
    private setSize(w: number, h: number) {

        //Update canvas css size
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";

        //Update canvas pixel size for HDPI
        let pixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = w * pixelRatio;
        this.canvas.height = h * pixelRatio;
        this.ctx.scale(pixelRatio, pixelRatio);
        this.ctx.font = C.fontWeight + " " + C.fontSize + "px " + C.fontFamily;
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
        //Initialize all terms
        for (let i = 0; i < instructions.terms.length; i++) {
            let width = instructions.metrics.widths[i];
            let text = instructions.terms[i];
            let term = new Term(text, width, instructions.metrics.height, instructions.metrics.ascent);
            this.terms.push(term);
        }
        //Initialize h dividers
        for (let i = 0; i < instructions.hDividers; i++) {
            this.hDividers.push(new HDivider(C.hDividerPadding));
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
     * Calculate and return the layout for
     * a particular step.
     * 
     * @param idx The step number.
     */
    protected calcLayout(idx): LayoutState[] {

        //First create the structure of containers in memory
        let rootObj = this.steps[idx].root;
        let root = this.parseContainer(rootObj);
        root.setFixedWidth(this.container.clientWidth);

        //Set the text
        if (this.textArea) {
            this.textArea.innerHTML = this.steps[idx].text;
        }

        let toReturn: LayoutState[] = [];
        root.addLayout(undefined, toReturn, 0, 0, 1);
        return toReturn;
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
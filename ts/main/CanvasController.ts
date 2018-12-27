import Term from "../layout/Term";
import HBox from "../layout/HBox";
import Padding from "../layout/Padding";
import VBox from "../layout/VBox";
import EqComponent from "../layout/EqComponent";
import LayoutState from "../animation/Frame";
import EqContainer from "../layout/EqContainer";
import AnimationSet from '../animation/AnimationSet';
import MoveAnimation from "../animation/MoveAnimation";
import RemoveAnimation from "../animation/RemoveAnimation";
import AddAnimation from "../animation/AddAnimation";
import CanvasSizeAnimation from "../animation/CanvasSizeAnimation";
import C from './consts';

/**
 * Responsible for managing a single canvas,
 * playing through the set of instructions
 * and animating.
 */
export default class CanvasController {

    protected container: Element;
    protected textArea: HTMLDivElement;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;

    protected currStep = -1;
    protected steps: any[];

    protected content: EqComponent[];
    protected currStates: LayoutState[];
    protected animating = false;
    protected lastHeight = 0;

    protected fontFamily: string;
    protected fontWeight: string;

    /**
     * Create a new Canvas Controller,
     * setting up equation playback in the
     * given container.
     * @param container The container. 
     * @param instructions The instructions.
     */
    constructor(container: Element, instructions, fontFamily: string, fontWeight: string) {
        this.container = container;
        this.steps = instructions.steps;
        this.content = [];
        this.fontFamily = fontFamily;
        this.fontWeight = fontWeight;
        this.fitSize = this.fitSize.bind(this);

        //Create canvas
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.container.appendChild(this.canvas);

        //Create area below canvas
        let lowerArea = document.createElement("div");
        lowerArea.className = "eqLower";
        this.container.appendChild(lowerArea);

        //Create back button
        let backButton = document.createElement("div");
        backButton.className = "material-icons eqIcon";
        backButton.innerHTML = "arrow_back";
        lowerArea.appendChild(backButton);
        this.prevStep = this.prevStep.bind(this);
        backButton.addEventListener("click", this.prevStep);

        //Create text area
        this.textArea = document.createElement("div");
        this.textArea.className = "eqText";
        this.textArea.innerHTML = "test";
        lowerArea.appendChild(this.textArea);

        //Create restart button
        let restButton = document.createElement("div");
        restButton.className = "material-icons eqIcon";
        restButton.innerHTML = "replay";
        lowerArea.appendChild(restButton);
        this.restart = this.restart.bind(this);
        restButton.addEventListener("click", this.restart);

        //Initialize Components and display first step
        this.initContent(instructions);
        this.nextStep();

        //Bind next step to canvas click
        this.nextStep = this.nextStep.bind(this);
        this.canvas.addEventListener("click", this.nextStep);

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
            f.component.draw(f, this.ctx);
            this.ctx.restore();
        });
    }

    /**
     * Recalculates and redraws the current step.
     */
    protected recalc() {
        this.currStates = this.calcLayout(this.currStep);
        this.fitSize(this.currStates[this.currStates.length - 1].height);
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
        let anims = this.diff(oldStates, this.lastHeight, height);
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
        let anims = this.diff(oldStates, this.lastHeight, height);
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

        this.currStep = 0;

        let oldStates = this.currStates;
        this.currStates = this.calcLayout(this.currStep);

        let rootLayout = this.currStates[this.currStates.length - 1];
        let height = rootLayout.height;
        let anims = this.diff(oldStates, this.lastHeight, height);
        this.lastHeight = height;
        this.animating = true;
        anims.start();
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
    private diff(oldStates: LayoutState[], cHeightBefore: number, cHeightAfter: number): AnimationSet {

        let set = new AnimationSet(() => {
            //When done
            this.animating = false;
        });

        let color = this.steps[this.currStep]['color'];

        set.addAnimation(new CanvasSizeAnimation(cHeightBefore, cHeightAfter, this.fitSize, set));

        //Look through content to see what has happened to it (avoiding containers)
        this.content.forEach(content => {

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

            if (stateBefore && stateAfter) {
                //Content has just moved
                set.addAnimation(new MoveAnimation(stateBefore, stateAfter, set, this.ctx));
            } else if (stateBefore) {
                //Doesn't exist after, has been removed
                set.addAnimation(new RemoveAnimation(stateBefore, set, this.ctx));
            } else if (stateAfter) {
                //Doesn't exist before, has been added
                set.addAnimation(new AddAnimation(stateAfter, set, this.ctx));
            }

        });

        return set;
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
        this.ctx.font = this.fontWeight + " " + C.fontSize + "px " + this.fontFamily;
    }

    /**
     * Uses the instructions to initialize all
     * content that will be used in the 
     * animation. Does not initialize the container
     * layout.
     * 
     * @param instructions The instructions JSON Object.
     */
    private initContent(instructions) {
        //Initialize all terms

        //Create the canvas so that terms can
        //measure themselves.
        let testCanvas = document.createElement("canvas");
        testCanvas.width = 400;
        testCanvas.height = C.fontSize * C.testCanvasFontSizeMultiple;
        let testCtx = testCanvas.getContext("2d");
        testCtx.font = C.fontSize + "px " + this.fontFamily;

        instructions.terms.forEach(t => {
            let term = new Term(t, testCtx, this.canvas.width, this.canvas.height);
            this.content.push(term);
        });
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
        this.textArea.innerHTML = this.steps[idx].text;

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
            } else if (typeof child === 'number') {
                toReturn.push(this.content[child]);
            } else {
                throw "Invalid type of child in JSON file.";
            }
        });
        return toReturn;
    }

}
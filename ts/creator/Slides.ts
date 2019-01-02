import Controller from "./main";
import { deepClone } from '../main/helpers';

export default class Slides {
    private controller: Controller;

    private element: HTMLElement = document.getElementById('bottom-row');
    private slidesEl: HTMLElement;
    private selectedEl: HTMLElement;
    private slideEls: HTMLElement[] = [];
    private slideInstructions: Object[] = [];

    constructor(controller: Controller) {
        this.controller = controller;

        this.slidesEl = document.createElement('div');
        this.slidesEl.className = 'slides';
        this.element.appendChild(this.slidesEl);

        let addEl = document.createElement('div');
        addEl.innerHTML = 'add';
        addEl.className = "slide material-icons";
        addEl.addEventListener('click', this.addNewSlide.bind(this));
        this.element.appendChild(addEl);
    }

    /**
     * Add a new slide.
     */
    addNewSlide(): void {
        //Create the instructions
        let index = this.selectedEl ?
            this.slideEls.indexOf(this.selectedEl) + 1 :
            this.slideEls.length;
        let instructions;
        if (index > 0) {
            //Copy from previous slide
            instructions = deepClone(this.slideInstructions[index - 1]);
        } else {
            //Create new
            instructions = this.controller.instructionsFromStep({
                root: {
                    type: "vbox",
                    children: [

                    ]
                }
            });
        }
        this.slideInstructions.splice(index, 0, instructions);
        this.setSlideEls();
        this.setActiveSlide(index);
    }

    private setSlideEls(): void {
        this.slideEls = [];
        for (let i = 0; i < this.slideInstructions.length; i++) {
            this.slideEls.push(this.newSlideEl(i));
        }
        this.controller.fillEl(this.slidesEl, this.slideEls);
    }

    /**
     * Get a new element for selecting
     * a slide with a specific index.
     * 
     * @param index The index to select.
     */
    private newSlideEl(index: number): HTMLElement {
        let newSlide = document.createElement('div');
        newSlide.className = "slide";
        newSlide.innerHTML = "" + index;
        newSlide.addEventListener('click', this.setActiveSlide.bind(this, index));
        return newSlide;
    }

    /**
     * Select a slide and display its editor
     * on the screen.
     * 
     * @param index The index of the slide.
     */
    private setActiveSlide(index: number): void {
        if (this.selectedEl) {
            this.selectedEl.classList.remove('selected');
        }
        this.selectedEl = this.slideEls[index];
        this.selectedEl.classList.add('selected');
        this.controller.setDisplayCanvas(this.slideInstructions[index]);
    }

    /**
     * Given instructions, such as those 
     * stored in slideInstructions, extracts
     * their first step.
     * 
     * @param instructions An instructions object.
     */
    private instructionsToStep(instructions: Object): Object {
        return instructions['steps'][0];
    }

    /**
     * Lets the slides object know that the
     * step information has updated for the 
     * current slide. Unless this is called,
     * changes are not saved.
     * 
     * @param step The step reflecting new changes.
     */
    stepChanged(step: Object) {
        let index = this.slideEls.indexOf(this.selectedEl);
        this.slideInstructions[index] = step;
    }

    /**
     * When content is removed,
     * remove it from all the steps.
     * 
     * @param ref The reference of the content removed.
     */
    removeContent(ref: string) {
        let index: number = parseFloat(ref.substring(1, ref.length));
        //Recursively look for any numbers in the step hierarchy
        this.slideInstructions.forEach(inst => {
            recursiveRemove(inst['steps'][0]['root']);
        });
        console.log(this.slideInstructions);
        //Re-calculate the color/opacity references
        this.slideInstructions.forEach(inst => {
            if (inst['steps'][0]['color']) {
                removeDeletedKeys(inst['steps'][0]['color']);
            }
            if (inst['steps'][0]['opacity']) {
                removeDeletedKeys(inst['steps'][0]['opacity']);
            }
        });
        //Re-calculate the metrics
        let metrics = this.controller.contentManager.getMetrics();
        this.slideInstructions.forEach(inst => {
            inst['metrics'] = metrics;
        });
        //Re-select the current slide to refresh
        this.setActiveSlide(this.slideEls.indexOf(this.selectedEl));

        //Looks through the keys of an object to
        //find deleted references.
        function removeDeletedKeys(deleteIn: object) {
            Object.keys(deleteIn).forEach(key => {
                let val = deleteIn[key];
                if (key.charAt(0) === ref.charAt(0)) {
                    //Same content type
                    let keyIndex = parseFloat(key.substring(1, key.length));
                    if (keyIndex === index) {
                        //Reference to deleted content, delete it
                        delete deleteIn[key]
                    } else if (keyIndex > index) {
                        //Deletion affected array, shift this key index down
                        let newKey = key.charAt(0) + (keyIndex - 1);
                        delete deleteIn[key];
                        deleteIn[newKey] = val;
                    }
                }
            });
        }

        //Looks through an objects properties to
        //remove a certain index.
        function recursiveRemove(lookIn: Object) {
            Object.keys(lookIn).forEach(key => {
                let value = lookIn[key];
                if (typeof value === 'object') {
                    recursiveRemove(value);
                    if (Array.isArray(value)) {
                        /* Treating the array like an object
                           leaves empty values. Clear these
                           out. */
                        lookIn[key] = value.filter(el => el !== null);
                    }
                } else if (typeof value === 'string') {
                    //If > index, decrement to account for
                    //shifting in array, otherwise remove
                    if (value.charAt(0) === ref.charAt(0)) {
                        //Value refers to same content type
                        let valIndex: number = parseFloat(value.substring(1, value.length));
                        if (valIndex === index) {
                            delete lookIn[key];
                        } else if (valIndex > index) {
                            lookIn[key] = value.charAt(0) + (valIndex - 1);
                        }
                    }
                }
            });
        }
    }

    /**
     * Delete the current slide.
     */
    delete() {
        if (this.slideEls.length === 1) {
            return; //Not allowed to be empty
        }

        //Remove from arrays
        let index = this.slideEls.indexOf(this.selectedEl);
        this.slideInstructions.splice(index, 1);
        this.slideEls.splice(index, 1);
        this.selectedEl = undefined;
        this.setSlideEls();

        //Select the next one over
        if (index < this.slideEls.length) {
            this.setActiveSlide(index);
        } else if (index - 1 >= 0) {
            this.setActiveSlide(index - 1);
        }
    }

    /**
     * Add step information to a JSON
     * object for saving.
     * 
     * @param toJSON The jSON object.
     */
    addJSON(toJSON: Object): void {
        toJSON['steps'] = this.slideInstructions
            .map(i => this.instructionsToStep(i));
    }

    /**
     * Load the slides from an instructions
     * object.
     * 
     * @param instructions The instructions object.
     */
    fromJSON(instructions: Object): void {

        this.selectedEl = undefined;
        this.slideInstructions = [];

        for (let i = 0; i < instructions['steps'].length; i++) {
            let currStep = instructions['steps'][i];
            this.slideInstructions.push(this.controller.instructionsFromStep(currStep));
        }

        this.setSlideEls();
    }
}
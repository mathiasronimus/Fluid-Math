import Controller from "./main";
import StepOptionsCanvasController from "./StepOptionsCanvasController";
import { OneOnlySelectionStrategy } from './SelectionStrategy';
import CanvasController from "../main/CanvasController";
import C from '../main/consts';

/**
 * Controls the window for editing the
 * options for a transition.
 */
export default class StepOptionsEditor {

    static editStep(step1: number, stepOptions: Object, step2: number, controller: Controller) {
        new StepOptionsEditor(step1, stepOptions, step2, controller);
    }

    private controller: Controller;
    private step1Idx: number;
    private options: Object;
    private step2Idx: number;
    private el: HTMLElement;

    private constructor(step1: number, options: Object, step2: number, controller: Controller) {
        this.controller = controller;
        this.options = options;
        this.step1Idx = step1;
        this.step2Idx = step2;
        this.el = document.createElement('div');
        this.el.className = 'stepOptContainer';
        this.render();
        this.controller.modal(this.el);
    }

    /**
     * Erase the contents of the element
     * and replace with the appropriate
     * content.
     */
    private render() {
        let lastScrollY = this.el.scrollTop;
        this.el.innerHTML = "";

        let previewTitle = document.createElement('div');
        previewTitle.className = 'stepOptTitle';
        previewTitle.innerHTML = 'Preview this transition.';
        this.el.appendChild(previewTitle);

        let previewContainer = document.createElement('div');
        previewContainer.className = 'eqContainer';
        this.el.appendChild(previewContainer);
        
        //Splice step 1 and 2 together to create the preview.
        let inst = this.controller.instructionsFromStep(this.controller.slideManager.getSlide(this.step1Idx));
        inst['steps'].push(this.controller.slideManager.getSlide(this.step2Idx));
        inst['stepOpts'] = {};
        inst['stepOpts']['0'] = this.controller.slideManager.getOptions(this.step1Idx);
        setTimeout(() => {
            new CanvasController(previewContainer, inst);
        }, C.creatorCanvasInitDelay);

        let addAnim = document.createElement('div');
        addAnim.className = 'stepOptTitle';
        addAnim.innerHTML = 'Add a custom animation.';
        this.el.appendChild(addAnim);

        let addClone = document.createElement('div');
        addClone.className = 'customAnimationOption';
        addClone.innerHTML = 'Clone';
        addClone.addEventListener('click', this.addClone.bind(this));
        this.el.appendChild(addClone);

        this.renderClone();
        setTimeout(() => {
            this.el.scrollTop = lastScrollY;
        }, C.creatorCanvasInitDelay + 100);
    }

    /**
     * Insert the appropriate cloning controls
     * into the element.
     */
    private renderClone() {
        if (this.options['clones']) {
            let title = document.createElement('div');
            title.className = 'stepOptTitle';
            title.innerHTML = 'Clones.';
            this.el.appendChild(title);

            Object.keys(this.options['clones']).forEach((cloneTo: string) => {
                let cloneFrom = this.options['clones'][cloneTo];

                //Create an element for each clone
                let cloneEl = document.createElement('div');
                cloneEl.className = 'customAnimationContainer';
                this.el.appendChild(cloneEl);

                let upper = document.createElement('div');
                upper.className = 'customAnimationUpper';
                cloneEl.appendChild(upper);

                let fromEl = document.createElement('p');
                fromEl.innerHTML = 'FROM';
                upper.appendChild(fromEl);
                
                let removeEl = document.createElement('span');
                removeEl.className = 'removeCustomAnim material-icons';
                removeEl.innerHTML = 'clear';
                //Remove custom animation by deleting the key in the object
                removeEl.addEventListener('click', function() {
                    delete this.options['clones'][cloneTo];
                    this.render();
                }.bind(this));
                upper.appendChild(removeEl);

                //Show canvas for step1, aka 'from'.
                let fromChange = function(refs: string[]) {
                    this.options['clones'][cloneTo] = refs[0];
                    this.render();
                }.bind(this);

                let step1Cont = document.createElement('div');
                step1Cont.className = 'eqContainer';
                cloneEl.appendChild(step1Cont);
                setTimeout(() => {
                    new StepOptionsCanvasController(step1Cont,
                        this.controller.instructionsFromStep(this.controller.slideManager.getSlide(this.step1Idx)),
                        fromChange,
                        new OneOnlySelectionStrategy(),
                        //Empty string used to mean nothing selected.
                        cloneFrom === '' ? [] : [cloneFrom]);
                }, C.creatorCanvasInitDelay);

                let toEl = document.createElement('p');
                toEl.innerHTML = 'TO';
                cloneEl.appendChild(toEl);

                //Show canvas for step2, aka 'to'.
                let toChange = function(refs: string[]) {
                    delete this.options['clones'][cloneTo];
                    this.options['clones'][refs[0]] = cloneFrom;
                    this.render();
                }.bind(this);

                let step2Cont = document.createElement('div');
                step2Cont.className = 'eqContainer';
                cloneEl.appendChild(step2Cont);
                setTimeout(() => {
                    new StepOptionsCanvasController(step2Cont,
                        this.controller.instructionsFromStep(this.controller.slideManager.getSlide(this.step2Idx)),
                        toChange,
                        new OneOnlySelectionStrategy(),
                        //Empty string used to mean nothing selected.
                        cloneTo === '' ? [] : [cloneTo]);
                }, C.creatorCanvasInitDelay);
            });
        }
    }

    /**
     * Add a clone animation to this
     * step.
     */
    private addClone() {
        if (!this.options['clones']) {
            this.options['clones'] = {};
        }
        if (!this.options['clones']['']) {
            this.options['clones'][''] = '';
        }
        this.render();
    }
}
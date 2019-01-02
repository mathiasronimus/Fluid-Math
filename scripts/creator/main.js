define(["require", "exports", "./ToolBar", "./CreatorCanvasController", "./ContentPane", "./Slides", "../main/CanvasController", "../main/helpers"], function (require, exports, ToolBar_1, CreatorCanvasController_1, ContentPane_1, Slides_1, CanvasController_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor() {
            this.centreEl = document.getElementById('central-area');
            this.load = this.load.bind(this);
            this.save = this.save.bind(this);
            this.play = this.play.bind(this);
            this.deleteSlide = this.deleteSlide.bind(this);
            this.deleteContent = this.deleteContent.bind(this);
            this.setDisplayCanvas = this.setDisplayCanvas.bind(this);
            this.toolBar = new ToolBar_1.default(this);
            this.contentManager = new ContentPane_1.default(this);
            this.slideManager = new Slides_1.default(this);
            this.slideManager.addNewSlide();
            helpers_1.addStyleSheet();
        }
        /**
         * Get the instructions object
         * representing the entire
         * slideshow.
         */
        getFinalInstructions() {
            let toJSON = {};
            this.contentManager.addJSON(toJSON);
            this.slideManager.addJSON(toJSON);
            return toJSON;
        }
        /**
         * Selects a component on the current
         * canvas. Changes the toolbar to allow
         * editing.
         *
         * @param comp
         */
        select(comp) {
            this.toolBar.select(comp);
        }
        /**
         * Sets the central canvas to have
         * a particular layout.
         *
         * @param stepLayout The layout.
         */
        setDisplayCanvas(stepLayout) {
            this.centreEl.innerHTML = "";
            this.slideManager.stepChanged(stepLayout);
            let oldCanvas = this.currCanvas;
            this.currCanvas = new CreatorCanvasController_1.default(this.centreEl, stepLayout, this.setDisplayCanvas, this);
            if (oldCanvas) {
                CreatorCanvasController_1.default.transferState(oldCanvas, this.currCanvas);
            }
        }
        /**
         * Creates and returns a full
         * instructions object with
         * a single step layout.
         *
         * @param step The step layout.
         */
        instructionsFromStep(step) {
            let instructions = {};
            instructions.terms = this.contentManager.getTerms();
            instructions.metrics = this.contentManager.getMetrics();
            instructions.steps = [
                step
            ];
            return instructions;
        }
        /**
         * Empty an element and fill it with
         * new chldren.
         *
         * @param elToFill The element to empty.
         * @param innerEls The new children.
         */
        fillEl(elToFill, innerEls) {
            elToFill.innerHTML = "";
            for (var i = 0; i < innerEls.length; i++) {
                elToFill.appendChild(innerEls[i]);
            }
        }
        /**
         * Load a new slideshow to edit.
         */
        load() {
            //Create a modal for JSON entry
            let modalRoot = document.createElement('div');
            let textArea = document.createElement('textarea');
            textArea.rows = 10;
            textArea.cols = 100;
            modalRoot.appendChild(textArea);
            let ok = this.getOkButton(function () {
                //To run when text entered
                let instructions = JSON.parse(textArea.value);
                this.contentManager.fromJSON(instructions);
                this.currCanvas = undefined;
                this.slideManager.fromJSON(instructions);
                this.removeModal();
            }.bind(this));
            modalRoot.appendChild(ok);
            this.modal(modalRoot);
        }
        /**
         * Save the current slideshow.
         */
        save() {
            let toJSON = this.getFinalInstructions();
            let modalRoot = document.createElement('div');
            let textArea = document.createElement('textarea');
            textArea.rows = 10;
            textArea.cols = 100;
            textArea.value = JSON.stringify(toJSON);
            modalRoot.appendChild(textArea);
            this.modal(modalRoot);
            textArea.focus();
        }
        /**
         * Play a preview of the current
         * slideshow.
         */
        play() {
            let instructions = this.getFinalInstructions();
            let modalRoot = document.createElement('div');
            this.modal(modalRoot);
            new CanvasController_1.default(modalRoot, instructions);
        }
        /**
         * Delete the current slide.
         */
        deleteSlide() {
            this.slideManager.delete();
        }
        /**
         * Delete the selected content.
         */
        deleteContent() {
            this.contentManager.delete();
        }
        /**
         * Returns an OK button element.
         *
         * @param onClick The action to take upon a button click.
         */
        getOkButton(onClick) {
            let ok = document.createElement('div');
            ok.innerHTML = 'OK';
            ok.className = 'okButton';
            ok.addEventListener('click', onClick);
            return ok;
        }
        /**
         * Brings up a modal dialog.
         *
         * @param rootEl The element to display inside the dialog.
         */
        modal(rootEl) {
            //Container for background and dialog
            this.modalEl = document.createElement('div');
            this.modalEl.style.position = 'fixed';
            //Background
            let background = document.createElement('div');
            background.addEventListener('click', this.removeModal.bind(this));
            this.modalEl.appendChild(background);
            background.className = 'background';
            //Dialog
            let dialog = document.createElement('div');
            this.modalEl.appendChild(dialog);
            dialog.className = 'dialog';
            dialog.appendChild(rootEl);
            document.body.appendChild(this.modalEl);
        }
        /**
         * Hide the modal dialog.
         */
        removeModal() {
            document.body.removeChild(this.modalEl);
        }
    }
    exports.default = Controller;
    new Controller();
});

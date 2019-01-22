define(["require", "exports", "./ToolBar", "./CreatorCanvasController", "../main/consts", "./ContentPane", "./Slides", "../main/CanvasController", "../main/helpers"], function (require, exports, ToolBar_1, CreatorCanvasController_1, consts_1, ContentPane_1, Slides_1, CanvasController_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    var Controller = (function () {
        function Controller() {
            this.centreEl = document.getElementById('central-area');
            this.errorEl = document.getElementById('error');
            this.errorTextEl = document.getElementById('error-text');
            this.errorCloseEl = document.getElementById('close-error');
            this.timeoutID = 0;
            this.load = this.load.bind(this);
            this.save = this.save.bind(this);
            this.play = this.play.bind(this);
            this.deleteSlide = this.deleteSlide.bind(this);
            this.deleteContent = this.deleteContent.bind(this);
            this.setDisplayCanvas = this.setDisplayCanvas.bind(this);
            this.toolBar = new ToolBar_1["default"](this);
            this.contentManager = new ContentPane_1["default"](this);
            this.slideManager = new Slides_1["default"](this);
            this.slideManager.addNewSlide();
            this.errorCloseEl.addEventListener('click', this.hideError.bind(this));
            helpers_1.addStyleSheet();
        }
        /**
         * Get the instructions object
         * representing the entire
         * slideshow.
         */
        Controller.prototype.getFinalInstructions = function () {
            var toJSON = {};
            this.contentManager.addJSON(toJSON);
            this.slideManager.addJSON(toJSON);
            return toJSON;
        };
        /**
         * Selects a component on the current
         * canvas. Changes the toolbar to allow
         * editing.
         *
         * @param comp
         */
        Controller.prototype.select = function (comp) {
            this.toolBar.select(comp);
        };
        /**
         * Sets the central canvas to have
         * a particular layout.
         *
         * @param stepLayout The layout.
         */
        Controller.prototype.setDisplayCanvas = function (stepLayout) {
            this.centreEl.innerHTML = "";
            this.slideManager.stepChanged(stepLayout);
            var oldCanvas = this.currCanvas;
            this.currCanvas = new CreatorCanvasController_1["default"](this.centreEl, stepLayout, this.setDisplayCanvas, this);
            if (oldCanvas) {
                CreatorCanvasController_1["default"].transferState(oldCanvas, this.currCanvas);
            }
        };
        /**
         * Creates and returns a full
         * instructions object with
         * a single step layout.
         *
         * @param step The step layout.
         */
        Controller.prototype.instructionsFromStep = function (step) {
            var instructions = {};
            instructions.terms = this.contentManager.getTerms();
            instructions.metrics = this.contentManager.getMetrics();
            instructions.hDividers = this.contentManager.getDividers();
            instructions.steps = [
                step
            ];
            return instructions;
        };
        /**
         * Empty an element and fill it with
         * new chldren.
         *
         * @param elToFill The element to empty.
         * @param innerEls The new children.
         */
        Controller.prototype.fillEl = function (elToFill, innerEls) {
            elToFill.innerHTML = "";
            for (var i = 0; i < innerEls.length; i++) {
                elToFill.appendChild(innerEls[i]);
            }
        };
        /**
         * Load a new slideshow to edit.
         */
        Controller.prototype.load = function () {
            //Create a modal for JSON entry
            var modalRoot = document.createElement('div');
            var textArea = document.createElement('textarea');
            textArea.rows = 10;
            textArea.cols = 100;
            modalRoot.appendChild(textArea);
            var ok = this.getOkButton(function () {
                //To run when text entered
                var instructions = JSON.parse(textArea.value);
                this.contentManager.fromJSON(instructions);
                this.slideManager.fromJSON(instructions);
                this.slideManager.setActiveSlide(0);
                this.removeModal();
            }.bind(this));
            modalRoot.appendChild(ok);
            this.modal(modalRoot);
        };
        /**
         * Save the current slideshow.
         */
        Controller.prototype.save = function () {
            var toJSON = this.getFinalInstructions();
            var modalRoot = document.createElement('div');
            var textArea = document.createElement('textarea');
            textArea.rows = 10;
            textArea.cols = 100;
            textArea.value = JSON.stringify(toJSON);
            modalRoot.appendChild(textArea);
            this.modal(modalRoot);
            textArea.focus();
        };
        /**
         * Play a preview of the current
         * slideshow.
         */
        Controller.prototype.play = function () {
            var instructions = this.getFinalInstructions();
            var modalRoot = document.createElement('div');
            this.modal(modalRoot);
            new CanvasController_1["default"](modalRoot, instructions);
        };
        /**
         * Delete the current slide.
         */
        Controller.prototype.deleteSlide = function () {
            this.slideManager["delete"]();
        };
        /**
         * Delete the selected content.
         */
        Controller.prototype.deleteContent = function () {
            this.contentManager["delete"]();
        };
        /**
         * Returns an OK button element.
         *
         * @param onClick The action to take upon a button click.
         */
        Controller.prototype.getOkButton = function (onClick) {
            var ok = document.createElement('div');
            ok.innerHTML = 'OK';
            ok.className = 'okButton';
            ok.addEventListener('click', onClick);
            return ok;
        };
        /**
         * Brings up a modal dialog.
         *
         * @param rootEl The element to display inside the dialog.
         */
        Controller.prototype.modal = function (rootEl) {
            //Container for background and dialog
            this.modalEl = document.createElement('div');
            this.modalEl.style.position = 'fixed';
            //Background
            var background = document.createElement('div');
            background.addEventListener('click', this.removeModal.bind(this));
            this.modalEl.appendChild(background);
            background.className = 'background';
            //Dialog
            var dialog = document.createElement('div');
            this.modalEl.appendChild(dialog);
            dialog.className = 'dialog';
            dialog.appendChild(rootEl);
            document.body.appendChild(this.modalEl);
        };
        /**
         * Hide the modal dialog.
         */
        Controller.prototype.removeModal = function () {
            document.body.removeChild(this.modalEl);
        };
        /**
         * Inform the user of an error.
         *
         * @param message The error message.
         */
        Controller.prototype.error = function (message) {
            this.errorTextEl.innerHTML = message;
            this.errorEl.style.display = 'flex';
            if (this.timeoutID) {
                clearInterval(this.timeoutID);
            }
            this.timeoutID = setInterval(this.hideError.bind(this), consts_1["default"].creatorErrorTimeout);
        };
        /**
         * Hide the error box.
         */
        Controller.prototype.hideError = function () {
            this.errorEl.style.display = 'none';
        };
        return Controller;
    }());
    exports["default"] = Controller;
    new Controller();
});

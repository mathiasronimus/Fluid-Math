define(["require", "exports", "../main/helpers", "./StepOptionsEditor"], function (require, exports, helpers_1, StepOptionsEditor_1) {
    "use strict";
    exports.__esModule = true;
    var Slides = (function () {
        function Slides(controller) {
            this.element = document.getElementById('bottom-row');
            this.slideEls = [];
            this.slideInstructions = [];
            this.slideOptions = [];
            this.controller = controller;
            this.slidesEl = document.createElement('div');
            this.slidesEl.className = 'slides';
            this.element.appendChild(this.slidesEl);
            var addEl = document.createElement('div');
            addEl.innerHTML = 'add';
            addEl.className = "slide material-icons";
            addEl.addEventListener('click', this.addNewSlide.bind(this));
            this.element.appendChild(addEl);
        }
        /**
         * Add a new slide.
         */
        Slides.prototype.addNewSlide = function () {
            //Create the instructions
            var index = this.selectedEl ?
                (this.slideEls.indexOf(this.selectedEl) / 2) + 1 :
                this.slideInstructions.length;
            var instructions;
            if (index > 0) {
                //Copy from previous slide
                instructions = helpers_1.deepClone(this.slideInstructions[index - 1]);
            }
            else {
                //Create new
                instructions = {
                    root: {
                        type: "vbox",
                        children: []
                    }
                };
            }
            this.slideInstructions.splice(index, 0, instructions);
            if (index > 0) {
                this.slideOptions.splice(index - 1, 0, {});
            }
            this.setSlideEls();
            this.setActiveSlide(index);
        };
        Slides.prototype.setSlideEls = function () {
            this.slideEls = [];
            for (var i = 0; i < this.slideInstructions.length; i++) {
                this.slideEls.push(this.newSlideEl(i));
                if (i < this.slideInstructions.length - 1) {
                    this.slideEls.push(this.newOptionsEl(i));
                }
            }
            this.controller.fillEl(this.slidesEl, this.slideEls);
        };
        /**
         * Get a new element for selecting
         * a slide with a specific index.
         *
         * @param index The index to select.
         */
        Slides.prototype.newSlideEl = function (index) {
            var newSlide = document.createElement('div');
            newSlide.className = "slide";
            newSlide.innerHTML = "" + index;
            newSlide.addEventListener('click', this.setActiveSlide.bind(this, index));
            return newSlide;
        };
        /**
         * Get a new element for editing
         * step options for a transition.
         *
         * @param index The index of step options.
         */
        Slides.prototype.newOptionsEl = function (index) {
            var el = document.createElement('div');
            el.className = 'stepOption material-icons';
            el.innerHTML = "linear_scale";
            el.addEventListener('click', StepOptionsEditor_1["default"].editStep.bind(undefined, index, this.slideOptions[index], index + 1, this.controller));
            return el;
        };
        /**
         * Select a slide and display its editor
         * on the screen.
         *
         * @param index The index of the slide.
         */
        Slides.prototype.setActiveSlide = function (index) {
            if (this.selectedEl) {
                this.selectedEl.classList.remove('selected');
            }
            this.selectedEl = this.slideEls[index * 2];
            this.selectedEl.classList.add('selected');
            var instructions = this.controller.instructionsFromStep(this.slideInstructions[index]);
            this.controller.setDisplayCanvas(instructions);
        };
        /**
         * Lets the slides object know that the
         * step information has updated for the
         * current slide. Unless this is called,
         * changes are not saved.
         *
         * @param step The step reflecting new changes.
         */
        Slides.prototype.stepChanged = function (step) {
            var index = this.slideEls.indexOf(this.selectedEl) / 2;
            this.slideInstructions[index] = step['steps'][0];
        };
        /**
         * Return the instructions for a particular
         * index.
         *
         * @param idx The index.
         */
        Slides.prototype.getSlide = function (idx) {
            return this.slideInstructions[idx];
        };
        /**
         * Return the slide options for a particular
         * index.
         *
         * @param idx The index.
         */
        Slides.prototype.getOptions = function (idx) {
            return this.slideOptions[idx];
        };
        /**
         * When content is removed,
         * remove it from all the steps.
         *
         * @param ref The reference of the content removed.
         */
        Slides.prototype.removeContent = function (ref) {
            var index = parseFloat(ref.substring(1, ref.length));
            //Recursively look for any numbers in the step hierarchy
            this.slideInstructions.forEach(function (inst) {
                recursiveRemove(inst['root']);
            });
            //Re-calculate the color/opacity references
            this.slideInstructions.forEach(function (inst) {
                if (inst['color']) {
                    removeDeletedKeys(inst['color']);
                }
                if (inst['opacity']) {
                    removeDeletedKeys(inst['opacity']);
                }
            });
            //Re-select the current slide to refresh
            this.setActiveSlide(this.slideEls.indexOf(this.selectedEl) / 2);
            //Looks through the keys of an object to
            //find deleted references.
            function removeDeletedKeys(deleteIn) {
                Object.keys(deleteIn).forEach(function (key) {
                    var val = deleteIn[key];
                    if (key.charAt(0) === ref.charAt(0)) {
                        //Same content type
                        var keyIndex = parseFloat(key.substring(1, key.length));
                        if (keyIndex === index) {
                            //Reference to deleted content, delete it
                            delete deleteIn[key];
                        }
                        else if (keyIndex > index) {
                            //Deletion affected array, shift this key index down
                            var newKey = key.charAt(0) + (keyIndex - 1);
                            delete deleteIn[key];
                            deleteIn[newKey] = val;
                        }
                    }
                });
            }
            //Looks through an objects properties to
            //remove a certain index.
            function recursiveRemove(lookIn) {
                Object.keys(lookIn).forEach(function (key) {
                    var value = lookIn[key];
                    if (typeof value === 'object') {
                        recursiveRemove(value);
                        if (Array.isArray(value)) {
                            /* Treating the array like an object
                               leaves empty values. Clear these
                               out. */
                            lookIn[key] = value.filter(function (el) { return el !== null; });
                        }
                    }
                    else if (typeof value === 'string') {
                        //If > index, decrement to account for
                        //shifting in array, otherwise remove
                        if (value.charAt(0) === ref.charAt(0)) {
                            //Value refers to same content type
                            var valIndex = parseFloat(value.substring(1, value.length));
                            if (valIndex === index) {
                                delete lookIn[key];
                            }
                            else if (valIndex > index) {
                                lookIn[key] = value.charAt(0) + (valIndex - 1);
                            }
                        }
                    }
                });
            }
        };
        /**
         * Delete the current slide.
         */
        Slides.prototype["delete"] = function () {
            if (this.slideEls.length === 1) {
                return; //Not allowed to be empty
            }
            //Remove from arrays
            var index = this.slideEls.indexOf(this.selectedEl) / 2;
            //Remove step options
            if (index === 0) {
                this.slideOptions.splice(0, 1);
            }
            else {
                this.slideOptions.splice(index - 1, 1);
                if (index !== this.slideInstructions.length - 1) {
                    //Surrounded by options on both sides, both are invalid
                    this.slideOptions[index - 1] = {};
                }
            }
            this.slideInstructions.splice(index, 1);
            this.selectedEl = undefined;
            this.setSlideEls();
            //Select the next one over
            if (index < this.slideEls.length) {
                this.setActiveSlide(index);
            }
            else if (index - 1 >= 0) {
                this.setActiveSlide(index - 1);
            }
        };
        /**
         * Add step information to a JSON
         * object for saving.
         *
         * @param toJSON The jSON object.
         */
        Slides.prototype.addJSON = function (toJSON) {
            toJSON['steps'] = this.slideInstructions;
            //Add step options, removing empty objects and strings
            var stepOptions = {};
            for (var i = 0; i < this.slideOptions.length; i++) {
                var stepOpt = this.slideOptions[i];
                removeEmptyString(stepOpt);
                if (Object.keys(stepOpt).length > 0) {
                    stepOptions[i] = stepOpt;
                }
            }
            function removeEmptyString(obj) {
                Object.keys(obj).forEach(function (key) {
                    if (typeof obj[key] === 'object') {
                        removeEmptyString(obj[key]);
                    }
                    if (key === '' || obj[key] === '') {
                        delete obj[key];
                    }
                });
            }
            toJSON['stepOpts'] = stepOptions;
        };
        /**
         * Load the slides from an instructions
         * object.
         *
         * @param instructions The instructions object.
         */
        Slides.prototype.fromJSON = function (instructions) {
            this.selectedEl = undefined;
            this.slideInstructions = [];
            this.slideOptions = [];
            for (var i = 0; i < instructions['steps'].length; i++) {
                var currStep = instructions['steps'][i];
                this.slideInstructions.push(currStep);
                if (i < instructions['steps'].length - 1) {
                    //A step option is valid for this index
                    if (instructions['stepOpts'] && instructions['stepOpts'][i]) {
                        this.slideOptions.push(instructions['stepOpts'][i]);
                    }
                    else {
                        this.slideOptions.push({});
                    }
                }
            }
            this.setSlideEls();
        };
        return Slides;
    }());
    exports["default"] = Slides;
});

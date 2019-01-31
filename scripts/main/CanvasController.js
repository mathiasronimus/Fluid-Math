define(["require", "exports", "../layout/Term", "../layout/HBox", "../layout/Padding", "../layout/VBox", "../animation/AnimationSet", "../animation/MoveAnimation", "../animation/RemoveAnimation", "../animation/AddAnimation", "./consts", "../layout/EqContent", "../animation/ProgressAnimation", "../layout/HDivider", "../layout/TightHBox", "../layout/SubSuper", "./helpers"], function (require, exports, Term_1, HBox_1, Padding_1, VBox_1, AnimationSet_1, MoveAnimation_1, RemoveAnimation_1, AddAnimation_1, consts_1, EqContent_1, ProgressAnimation_1, HDivider_1, TightHBox_1, SubSuper_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Responsible for managing a single canvas,
     * playing through the set of instructions
     * and animating.
     */
    var CanvasController = (function () {
        /**
         * Create a new Canvas Controller,
         * setting up equation playback in the
         * given container.
         * @param container The container.
         * @param instructions The instructions.
         */
        function CanvasController(container, instructions) {
            this.currStep = 0;
            this.animating = false;
            this.lastHeight = 0;
            this.lastWidth = 0;
            this.container = container;
            this.steps = instructions['steps'];
            this.stepOptions = instructions['stepOpts'];
            this.terms = [];
            this.hDividers = [];
            this.setSize = this.setSize.bind(this);
            this.progressLine = document.createElement('div');
            this.progressLine.className = "progressLine";
            this.container.appendChild(this.progressLine);
            this.progressLine.style.left = consts_1["default"].borderRadius + 'px';
            //Create area above canvas
            var upperArea = document.createElement("div");
            upperArea.className = "eqUpper";
            this.container.appendChild(upperArea);
            //Create back button, if needed
            if (this.steps.length > 1) {
                var backButton = document.createElement("div");
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
                var restButton = document.createElement("div");
                restButton.className = "material-icons eqIcon";
                restButton.innerHTML = "replay";
                upperArea.appendChild(restButton);
                this.restart = this.restart.bind(this);
                restButton.addEventListener("click", this.restart);
            }
            //Create canvas
            var canvasContainer = document.createElement('div');
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
        CanvasController.prototype.updateFontSize = function () {
            this.fontSize = helpers_1.getFontSizeForTier(window['currentWidthTier']);
        };
        /**
         * Redraw the current step without animating.
         * Does not recalculate layout.
         */
        CanvasController.prototype.redraw = function () {
            var _this = this;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.currStates.forEach(function (f) {
                _this.ctx.save();
                if (f.component instanceof EqContent_1["default"]) {
                    f.component.interpColorOff();
                    f.component.draw(f, f, 0, _this.ctx);
                }
                _this.ctx.restore();
            });
            //Redraw the progress line
            var widthPerSegment = (this.container.clientWidth - consts_1["default"].borderRadius * 2) / (this.steps.length - 1);
            this.progressLine.style.width = (this.currStep * widthPerSegment) + "px";
        };
        /**
         * Recalculates and redraws the current step.
         */
        CanvasController.prototype.recalc = function () {
            var rootLayout;
            _a = this.calcLayout(this.currStep), this.currStates = _a[0], rootLayout = _a[1];
            var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
            this.setSize(width, height);
            this.redraw();
            var _a;
        };
        /**
         * If possible, animate to the next step
         * in the sequence.
         */
        CanvasController.prototype.nextStep = function () {
            if (this.currStep + 1 >= this.steps.length || this.animating) {
                //Can't go to next step
                return;
            }
            this.currStep++;
            var oldStates = this.currStates;
            var rootLayout;
            _a = this.calcLayout(this.currStep), this.currStates = _a[0], rootLayout = _a[1];
            var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
            var anims = this.diff(oldStates, width, height, this.currStep - 1, this.currStep);
            this.animating = true;
            anims.start();
            var _a;
        };
        /**
         * If possible, animate to the previous step.
         */
        CanvasController.prototype.prevStep = function () {
            if (this.currStep - 1 < 0 || this.animating) {
                //Can't go to next step
                return;
            }
            this.currStep--;
            var oldStates = this.currStates;
            var rootLayout;
            _a = this.calcLayout(this.currStep), this.currStates = _a[0], rootLayout = _a[1];
            var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
            var anims = this.diff(oldStates, width, height, this.currStep + 1, this.currStep);
            this.animating = true;
            anims.start();
            var _a;
        };
        /**
         * Return to the first step.
         */
        CanvasController.prototype.restart = function () {
            if (this.animating) {
                //Can't go to next step
                return;
            }
            var oldStep = this.currStep;
            this.currStep = 0;
            var oldStates = this.currStates;
            var rootLayout;
            _a = this.calcLayout(this.currStep), this.currStates = _a[0], rootLayout = _a[1];
            var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
            var anims = this.diff(oldStates, width, height, oldStep, 0);
            this.animating = true;
            anims.start();
            var _a;
        };
        /**
         * Returns the total amount of content
         * in this slideshow.
         */
        CanvasController.prototype.getNumContent = function () {
            return this.terms.length + this.hDividers.length;
        };
        /**
         * Returns whether the concatenated
         * index belongs to a term.
         *
         * @param i The index.
         */
        CanvasController.prototype.inTermRange = function (i) {
            return i >= 0 && i < this.terms.length;
        };
        /**
         * Returns whether the concatenated
         * index belongs to an h divider.
         *
         * @param i The index.
         */
        CanvasController.prototype.inHDividerRange = function (i) {
            return i >= this.terms.length && i < this.terms.length + this.hDividers.length;
        };
        /**
         * Returns the content for a particular
         * index. This is used when looping through
         * all content. The order goes Terms,
         *
         * @param i The index of the content to get.
         */
        CanvasController.prototype.getContent = function (i) {
            if (this.inTermRange(i)) {
                return this.terms[i];
            }
            else if (this.inHDividerRange(i)) {
                return this.hDividers[i - this.terms.length];
            }
            else {
                throw "content out of bounds";
            }
        };
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
        CanvasController.prototype.diff = function (oldStates, canvasWidth, canvasHeight, stepBefore, stepAfter) {
            var _this = this;
            var updateDimenAfter = canvasHeight < this.lastHeight;
            if (!updateDimenAfter) {
                this.setSize(canvasWidth, canvasHeight);
            }
            var set = new AnimationSet_1["default"](function () {
                //When done
                if (updateDimenAfter) {
                    _this.setSize(canvasWidth, canvasHeight);
                    _this.redraw();
                }
                _this.animating = false;
            }, this.ctx, this.lastWidth, this.lastHeight);
            //Get the step options for this transition
            var stepOptions;
            var reverseStep;
            if (stepBefore < stepAfter) {
                //Going forward
                stepOptions = this.getStepOptions(stepBefore, stepAfter);
                reverseStep = false;
            }
            else {
                //Going backwards
                stepOptions = this.getStepOptions(stepAfter, stepBefore);
                reverseStep = true;
            }
            //Animate the progress bar
            set.addAnimation(new ProgressAnimation_1["default"](stepBefore, stepAfter, this.steps.length, this.container.clientWidth, this.progressLine, set));
            //Look through content to see what has happened to it (avoiding containers)
            for (var i = 0; i < this.getNumContent(); i++) {
                var content = this.getContent(i);
                var stateBefore = undefined;
                //We may be initilizing, where there are no old frames and everything is added
                if (oldStates !== undefined)
                    stateBefore = oldStates.get(content);
                var stateAfter = this.currStates.get(content);
                var contentRef = this.getContentRefFromIndex(i);
                if (stateBefore && stateAfter) {
                    //Content has just moved
                    set.addAnimation(new MoveAnimation_1["default"](stateBefore, stateAfter, set, this.ctx));
                }
                else if (stateBefore) {
                    //Doesn't exist after, has been removed
                    if (stepOptions && stepOptions['merges'] && stepOptions['merges'][contentRef]) {
                        //Do a merge animation
                        var mergeToRef = stepOptions['merges'][contentRef];
                        var mergeTo = this.getContentFromRef(mergeToRef);
                        var mergeToNewState = this.currStates.get(mergeTo);
                        set.addAnimation(new MoveAnimation_1["default"](stateBefore, mergeToNewState, set, this.ctx));
                    }
                    else if (reverseStep && stepOptions && stepOptions['clones'] && stepOptions['clones'][contentRef]) {
                        //Do a reverse clone, aka merge.
                        //Cloning is "to": "from", need to work backwards
                        var mergeToRef = stepOptions['clones'][contentRef];
                        var mergeTo = this.getContentFromRef(mergeToRef);
                        var mergeToNewState = this.currStates.get(mergeTo);
                        set.addAnimation(new MoveAnimation_1["default"](stateBefore, mergeToNewState, set, this.ctx));
                    }
                    else {
                        //Do a regular remove animation
                        set.addAnimation(new RemoveAnimation_1["default"](stateBefore, set, this.ctx));
                    }
                }
                else if (stateAfter) {
                    //Doesn't exist before, has been added
                    if (stepOptions && stepOptions['clones'] && stepOptions['clones'][contentRef]) {
                        //Do a clone animation
                        var cloneFromRef = stepOptions['clones'][contentRef];
                        var cloneFrom = this.getContentFromRef(cloneFromRef);
                        var cloneFromOldState = oldStates.get(cloneFrom);
                        set.addAnimation(new MoveAnimation_1["default"](cloneFromOldState, stateAfter, set, this.ctx));
                    }
                    else if (reverseStep && stepOptions && stepOptions['merges'] && stepOptions['merges'][contentRef]) {
                        //Do a reverse merge, aka clone.
                        //Merging is "from": "to", need to work backwards.
                        var cloneFromRef = stepOptions['merges'][contentRef];
                        var cloneFrom = this.getContentFromRef(cloneFromRef);
                        var cloneFromOldState = oldStates.get(cloneFrom);
                        set.addAnimation(new MoveAnimation_1["default"](cloneFromOldState, stateAfter, set, this.ctx));
                    }
                    else {
                        set.addAnimation(new AddAnimation_1["default"](stateAfter, set, this.ctx));
                    }
                }
            }
            return set;
        };
        /**
         * Gets the dimensions of the canvas based on
         * the root layout state.
         *
         * @param root The layout state of the root container.
         */
        CanvasController.prototype.getSize = function (root) {
            var rootHeight = root.height;
            var rootWidth = root.width;
            var currWidth = this.container.clientWidth;
            var newWidth = rootWidth > currWidth ? rootWidth : currWidth;
            return [newWidth, rootHeight];
        };
        /**
         * Sets the dimensions of the canvas.
         *
         * @param newWidth The new width.
         * @param newHeight The new height.
         */
        CanvasController.prototype.setSize = function (newWidth, newHeight) {
            if (newWidth === this.lastWidth && newHeight === this.lastHeight) {
                //Early return, no need to change size
                return;
            }
            //Update canvas css size
            this.canvas.style.width = newWidth + "px";
            this.canvas.style.height = newHeight + "px";
            //Update canvas pixel size for HDPI
            var pixelRatio = window.devicePixelRatio || 1;
            this.canvas.width = newWidth * pixelRatio;
            this.canvas.height = newHeight * pixelRatio;
            this.ctx.scale(pixelRatio, pixelRatio);
            this.ctx.font = consts_1["default"].fontWeight + " " + this.fontSize + "px " + consts_1["default"].fontFamily;
            this.lastHeight = newHeight;
            this.lastWidth = newWidth;
        };
        /**
         * Uses the instructions to initialize all
         * content that will be used in the
         * animation. Does not initialize the container
         * layout.
         *
         * @param instructions The instructions JSON Object.
         */
        CanvasController.prototype.initContent = function (instructions) {
            var heights = [];
            var ascents = [];
            if (instructions.terms.length > 0) {
                //Get the heights and ascents from each tier
                for (var w = 0; w < consts_1["default"].widthTiers.length; w++) {
                    heights.push(instructions.metrics[w].height);
                    ascents.push(instructions.metrics[w].ascent);
                }
            }
            //Initialize all terms
            for (var t = 0; t < instructions.terms.length; t++) {
                var widths = [];
                //Get the widths for each tier
                for (var w = 0; w < consts_1["default"].widthTiers.length; w++) {
                    widths.push(instructions.metrics[w].widths[t]);
                }
                var text = instructions.terms[t];
                var term = new Term_1["default"](text, widths, heights, ascents, 't' + t);
                this.terms.push(term);
            }
            //Initialize h dividers
            for (var i = 0; i < instructions.hDividers; i++) {
                this.hDividers.push(new HDivider_1["default"](consts_1["default"].hDividerPadding, 'h' + i));
            }
        };
        /**
         * Given a piece of content, get the
         * string used to reference it in the
         * JSON instructions.
         *
         * @param content The content to find a reference for.
         */
        CanvasController.prototype.getContentReference = function (content) {
            if (content instanceof Term_1["default"]) {
                return 't' + this.terms.indexOf(content);
            }
            else if (content instanceof HDivider_1["default"]) {
                return 'h' + this.hDividers.indexOf(content);
            }
            else {
                throw "unrecognized content type";
            }
        };
        /**
         * Given the concatenated index of
         * some content, get the reference
         * for it. Preferred to the above method.
         *
         * @param index The concatenated index of the content.
         */
        CanvasController.prototype.getContentRefFromIndex = function (index) {
            if (this.inTermRange(index)) {
                return 't' + index;
            }
            else if (this.inHDividerRange(index)) {
                return 'h' + (index - this.terms.length);
            }
            else {
                throw "unrecognized content type";
            }
        };
        /**
         * Returns the content for a particular
         * content reference as used in the JSON
         * format.
         *
         * @param ref The content reference.
         */
        CanvasController.prototype.getContentFromRef = function (ref) {
            var contentType = ref.substring(0, 1);
            var contentIndex = parseFloat(ref.substring(1, ref.length));
            if (contentType === 't') {
                return this.terms[contentIndex];
            }
            else if (contentType === 'h') {
                return this.hDividers[contentIndex];
            }
            else {
                throw "unrecognized content type";
            }
        };
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
        CanvasController.prototype.getStepOptions = function (step1, step2) {
            if (!this.stepOptions) {
                //No step options defined
                return undefined;
            }
            if (step2 - step1 !== 1) {
                //Steps are seperated or in the wrong order
                return undefined;
            }
            return this.stepOptions[step2 - 1];
        };
        /**
         * Calculate and return the layout for
         * a particular step. Returns [all layouts, root layout].
         *
         *
         * @param idx The step number.
         */
        CanvasController.prototype.calcLayout = function (idx) {
            //First create the structure of containers in memory
            var rootObj = this.steps[idx].root;
            var root = this.parseContainer(rootObj);
            //If content doesn't take up full width, center it
            var width = this.container.clientWidth;
            if (root.getWidth() < width) {
                root.setWidth(width);
            }
            //Set the text
            if (this.textArea) {
                this.textArea.innerHTML = this.steps[idx].text;
            }
            //Get the color info
            var colorsObj = this.steps[idx]['color'];
            var opacityObj = this.steps[idx]['opacity'];
            var allLayouts = helpers_1.newMap();
            var rootLayout = root.addLayout(undefined, allLayouts, 0, 0, 1, opacityObj, colorsObj);
            return [allLayouts, rootLayout];
        };
        /**
         * Parse a container from the JSON Object.
         *
         * @param containerObj The JSON Object representing the container.
         */
        CanvasController.prototype.parseContainer = function (containerObj) {
            var type = containerObj.type;
            if (type === "vbox") {
                return new VBox_1["default"](this.parseContainerChildren(containerObj.children), Padding_1["default"].even(consts_1["default"].defaultVBoxPadding));
            }
            else if (type === "hbox") {
                return new HBox_1["default"](this.parseContainerChildren(containerObj.children), Padding_1["default"].even(consts_1["default"].defaultHBoxPadding));
            }
            else if (type === "tightHBox") {
                return new TightHBox_1["default"](this.parseContainerChildren(containerObj.children), Padding_1["default"].even(consts_1["default"].defaultTightHBoxPadding));
            }
            else if (type === 'subSuper') {
                var top_1 = new HBox_1["default"](this.parseContainerChildren(containerObj.top), Padding_1["default"].even(0));
                var middle = new TightHBox_1["default"](this.parseContainerChildren(containerObj.middle), Padding_1["default"].even(0));
                var bottom = new HBox_1["default"](this.parseContainerChildren(containerObj.bottom), Padding_1["default"].even(0));
                var portrusion = containerObj['portrusion'] ? containerObj['portrusion'] : consts_1["default"].defaultExpPortrusion;
                return new SubSuper_1["default"](top_1, middle, bottom, portrusion, consts_1["default"].defaultSubSuperPadding);
            }
            else if (type === undefined) {
                throw "Invalid JSON File: Missing type attribute on container descriptor.";
            }
            else {
                throw "Invalid JSON File: Unrecognized type: " + type;
            }
        };
        /**
         * Parse the children attribute of a container
         * JSON Object.
         *
         * @param children The children array.
         */
        CanvasController.prototype.parseContainerChildren = function (children) {
            var _this = this;
            var toReturn = [];
            children.forEach(function (child) {
                if (typeof child === 'object') {
                    toReturn.push(_this.parseContainer(child));
                }
                else if (typeof child === 'string') {
                    toReturn.push(_this.getContentFromRef(child));
                }
                else {
                    throw "Invalid type of child in JSON file.";
                }
            });
            return toReturn;
        };
        return CanvasController;
    }());
    exports["default"] = CanvasController;
});

define(["require", "exports", "./StepOptionsCanvasController", "./SelectionStrategy", "../main/CanvasController", "../main/consts"], function (require, exports, StepOptionsCanvasController_1, SelectionStrategy_1, CanvasController_1, consts_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Controls the window for editing the
     * options for a transition.
     */
    var StepOptionsEditor = (function () {
        function StepOptionsEditor(step1, options, step2, controller) {
            this.controller = controller;
            this.options = options;
            this.step1Idx = step1;
            this.step2Idx = step2;
            this.el = document.createElement('div');
            this.el.className = 'stepOptContainer';
            this.render();
            this.controller.modal(this.el);
        }
        StepOptionsEditor.editStep = function (step1, stepOptions, step2, controller) {
            new StepOptionsEditor(step1, stepOptions, step2, controller);
        };
        /**
         * Erase the contents of the element
         * and replace with the appropriate
         * content.
         */
        StepOptionsEditor.prototype.render = function () {
            var _this = this;
            var lastScrollY = this.el.scrollTop;
            this.el.innerHTML = "";
            var previewTitle = document.createElement('div');
            previewTitle.className = 'stepOptTitle';
            previewTitle.innerHTML = 'Preview this transition.';
            this.el.appendChild(previewTitle);
            var previewContainer = document.createElement('div');
            previewContainer.className = 'eqContainer';
            this.el.appendChild(previewContainer);
            //Splice step 1 and 2 together to create the preview.
            var inst = this.controller.instructionsFromStep(this.controller.slideManager.getSlide(this.step1Idx));
            inst['steps'].push(this.controller.slideManager.getSlide(this.step2Idx));
            inst['stepOpts'] = {};
            inst['stepOpts']['0'] = this.controller.slideManager.getOptions(this.step1Idx);
            setTimeout(function () {
                new CanvasController_1["default"](previewContainer, inst);
            }, consts_1["default"].creatorCanvasInitDelay);
            var addAnim = document.createElement('div');
            addAnim.className = 'stepOptTitle';
            addAnim.innerHTML = 'Add a custom animation.';
            this.el.appendChild(addAnim);
            var addClone = document.createElement('div');
            addClone.className = 'customAnimationOption';
            addClone.innerHTML = 'Clone';
            addClone.addEventListener('click', this.addClone.bind(this));
            this.el.appendChild(addClone);
            var addMerge = document.createElement('div');
            addMerge.className = 'customAnimationOption';
            addMerge.innerHTML = 'Merge';
            addMerge.addEventListener('click', this.addMerge.bind(this));
            this.el.appendChild(addMerge);
            this.renderClone();
            this.renderMerge();
            setTimeout(function () {
                _this.el.scrollTop = lastScrollY;
            }, consts_1["default"].creatorCanvasInitDelay + 100);
        };
        /**
         * Insert the appropriate cloning controls
         * into the element. For a clone to valid,
         * the cloned element must be present in the
         * later step AND not present in the previous
         * step.
         */
        StepOptionsEditor.prototype.renderClone = function () {
            var _this = this;
            if (this.options['clones']) {
                var title = document.createElement('div');
                title.className = 'stepOptTitle';
                title.innerHTML = 'Clones.';
                this.el.appendChild(title);
                Object.keys(this.options['clones']).forEach(function (cloneTo) {
                    var cloneFrom = _this.options['clones'][cloneTo];
                    //Create an element for each clone
                    var cloneEl = document.createElement('div');
                    cloneEl.className = 'customAnimationContainer';
                    _this.el.appendChild(cloneEl);
                    var upper = document.createElement('div');
                    upper.className = 'customAnimationUpper';
                    cloneEl.appendChild(upper);
                    var fromEl = document.createElement('p');
                    fromEl.innerHTML = 'FROM';
                    upper.appendChild(fromEl);
                    var removeEl = document.createElement('span');
                    removeEl.className = 'removeCustomAnim material-icons';
                    removeEl.innerHTML = 'clear';
                    //Remove custom animation by deleting the key in the object
                    removeEl.addEventListener('click', function () {
                        delete this.options['clones'][cloneTo];
                        this.render();
                    }.bind(_this));
                    upper.appendChild(removeEl);
                    //Show canvas for step1, aka 'from'.
                    var fromChange = function (refs) {
                        this.options['clones'][cloneTo] = refs[0];
                        this.render();
                    }.bind(_this);
                    var step1Cont = document.createElement('div');
                    step1Cont.className = 'eqContainer';
                    cloneEl.appendChild(step1Cont);
                    setTimeout(function () {
                        new StepOptionsCanvasController_1["default"](step1Cont, _this.controller.instructionsFromStep(_this.controller.slideManager.getSlide(_this.step1Idx)), fromChange, new SelectionStrategy_1.OneOnlySelectionStrategy(), 
                        //Empty string used to mean nothing selected.
                        cloneFrom === '' ? [] : [cloneFrom]);
                    }, consts_1["default"].creatorCanvasInitDelay);
                    var toEl = document.createElement('p');
                    toEl.innerHTML = 'TO';
                    cloneEl.appendChild(toEl);
                    //Show canvas for step2, aka 'to'.
                    var toChange = function (refs) {
                        if (this.layoutContainsRef(this.controller.slideManager.getSlide(this.step1Idx), refs[0])) {
                            this.controller.error("Cloned item must not already exist.");
                            this.render();
                            return;
                        }
                        delete this.options['clones'][cloneTo];
                        this.options['clones'][refs[0]] = cloneFrom;
                        this.render();
                    }.bind(_this);
                    var step2Cont = document.createElement('div');
                    step2Cont.className = 'eqContainer';
                    cloneEl.appendChild(step2Cont);
                    setTimeout(function () {
                        new StepOptionsCanvasController_1["default"](step2Cont, _this.controller.instructionsFromStep(_this.controller.slideManager.getSlide(_this.step2Idx)), toChange, new SelectionStrategy_1.OneOnlySelectionStrategy(), 
                        //Empty string used to mean nothing selected.
                        cloneTo === '' ? [] : [cloneTo]);
                    }, consts_1["default"].creatorCanvasInitDelay);
                });
            }
        };
        /**
         * Whether a layout contains a
         * particular content reference.
         *
         * @param layout The layout to search in.
         * @param ref The reference to search for.
         */
        StepOptionsEditor.prototype.layoutContainsRef = function (layout, ref) {
            var keys = Object.keys(layout);
            for (var i = 0; i < keys.length; i++) {
                var val = layout[keys[i]];
                var found = false;
                if (typeof val === 'object') {
                    found = this.layoutContainsRef(val, ref);
                }
                else if (typeof val === 'string') {
                    found = val === ref;
                }
                if (found) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Insert the appropriate merging controls
         * into the element.
         */
        StepOptionsEditor.prototype.renderMerge = function () {
            var _this = this;
            if (this.options['merges']) {
                var title = document.createElement('div');
                title.className = 'stepOptTitle';
                title.innerHTML = 'Merges.';
                this.el.appendChild(title);
                Object.keys(this.options['merges']).forEach(function (mergeFrom) {
                    var mergeTo = _this.options['merges'][mergeFrom];
                    //Create an element for each merge
                    var mergeEl = document.createElement('div');
                    mergeEl.className = 'customAnimationContainer';
                    _this.el.appendChild(mergeEl);
                    var upper = document.createElement('div');
                    upper.className = 'customAnimationUpper';
                    mergeEl.appendChild(upper);
                    var fromEl = document.createElement('p');
                    fromEl.innerHTML = 'FROM';
                    upper.appendChild(fromEl);
                    var removeEl = document.createElement('span');
                    removeEl.className = 'removeCustomAnim material-icons';
                    removeEl.innerHTML = 'clear';
                    //Remove custom animation by deleting the key in the object
                    removeEl.addEventListener('click', function () {
                        delete this.options['merges'][mergeFrom];
                        this.render();
                    }.bind(_this));
                    upper.appendChild(removeEl);
                    //Show canvas for step1, aka 'from'.
                    var fromChange = function (refs) {
                        if (this.layoutContainsRef(this.controller.slideManager.getSlide(this.step2Idx), refs[0])) {
                            this.controller.error("Merging item musn't exist after the transition.");
                            this.render();
                            return;
                        }
                        delete this.options['merges'][mergeFrom];
                        this.options['merges'][refs[0]] = mergeTo;
                        this.render();
                    }.bind(_this);
                    var step1Cont = document.createElement('div');
                    step1Cont.className = 'eqContainer';
                    mergeEl.appendChild(step1Cont);
                    setTimeout(function () {
                        new StepOptionsCanvasController_1["default"](step1Cont, _this.controller.instructionsFromStep(_this.controller.slideManager.getSlide(_this.step1Idx)), fromChange, new SelectionStrategy_1.OneOnlySelectionStrategy(), 
                        //Empty string used to mean nothing selected.
                        mergeFrom === '' ? [] : [mergeFrom]);
                    }, consts_1["default"].creatorCanvasInitDelay);
                    var toEl = document.createElement('p');
                    toEl.innerHTML = 'TO';
                    mergeEl.appendChild(toEl);
                    //Show canvas for step2, aka 'to'.
                    var toChange = function (refs) {
                        this.options['merges'][mergeFrom] = refs[0];
                        this.render();
                    }.bind(_this);
                    var step2Cont = document.createElement('div');
                    step2Cont.className = 'eqContainer';
                    mergeEl.appendChild(step2Cont);
                    setTimeout(function () {
                        new StepOptionsCanvasController_1["default"](step2Cont, _this.controller.instructionsFromStep(_this.controller.slideManager.getSlide(_this.step2Idx)), toChange, new SelectionStrategy_1.OneOnlySelectionStrategy(), 
                        //Empty string used to mean nothing selected.
                        mergeTo === '' ? [] : [mergeTo]);
                    }, consts_1["default"].creatorCanvasInitDelay);
                });
            }
        };
        /**
         * Add a clone animation to this
         * step.
         */
        StepOptionsEditor.prototype.addClone = function () {
            if (!this.options['clones']) {
                this.options['clones'] = {};
            }
            if (!this.options['clones']['']) {
                this.options['clones'][''] = '';
            }
            this.render();
        };
        /**
         * Add a merge animation to this
         * step.
         */
        StepOptionsEditor.prototype.addMerge = function () {
            if (!this.options['merges']) {
                this.options['merges'] = {};
            }
            if (!this.options['merges']['']) {
                this.options['merges'][''] = '';
            }
            this.render();
        };
        return StepOptionsEditor;
    }());
    exports["default"] = StepOptionsEditor;
});

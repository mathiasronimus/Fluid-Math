define(["require", "exports", "../main/consts", "../main/helpers"], function (require, exports, consts_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    var ContentPane = (function () {
        function ContentPane(controller) {
            this.element = document.getElementById('right-centre');
            this.terms = [];
            this.controller = controller;
            //Selection
            this.selectEl = document.createElement('div');
            this.selectEl.innerHTML = 'Select';
            this.selectEl.className = 'content';
            this.selectEl.addEventListener('click', this.startSelecting.bind(this));
            this.element.appendChild(this.selectEl);
            //Containers
            var containerTitle = document.createElement('div');
            containerTitle.className = 'title';
            containerTitle.innerHTML = 'CONTAINER';
            this.element.appendChild(containerTitle);
            this.containerEl = document.createElement('div');
            this.element.appendChild(this.containerEl);
            this.addContainers();
            //Terms
            var termTitle = document.createElement('div');
            termTitle.className = 'title';
            termTitle.innerHTML = 'TERM';
            this.element.appendChild(termTitle);
            this.termEl = document.createElement('div');
            this.element.appendChild(this.termEl);
            var addTerm = document.createElement('div');
            addTerm.innerHTML = "add";
            addTerm.className = "content material-icons";
            addTerm.addEventListener('click', this.addTerm.bind(this));
            this.element.appendChild(addTerm);
            //H dividers
            this.hDividers = 0;
            var dividerTitle = document.createElement('div');
            dividerTitle.className = 'title';
            dividerTitle.innerHTML = "HORIZONTAL DIVIDER";
            this.element.appendChild(dividerTitle);
            this.hDividerEl = document.createElement('div');
            this.element.appendChild(this.hDividerEl);
            var addDivider = document.createElement('div');
            addDivider.innerHTML = 'add';
            addDivider.className = 'content material-icons';
            addDivider.addEventListener('click', this.addDivider.bind(this));
            this.element.appendChild(addDivider);
        }
        /**
         * Tells the current canvas to start
         * selecting.s
         */
        ContentPane.prototype.startSelecting = function () {
            //Select the clicked selection element
            this.select(this.selectEl);
            //Tell the canvas to start selecting
            this.controller.currCanvas.select();
            this.controller.currCanvas.emptySelected();
        };
        /**
         * Bring up a dialog to add a term.
         */
        ContentPane.prototype.addTerm = function () {
            var termCont = document.createElement('div');
            var textBox = document.createElement('textarea');
            textBox.rows = 1;
            textBox.cols = 50;
            termCont.appendChild(textBox);
            function close() {
                var termText = textBox.value.trim();
                if (termText === '') {
                    this.controller.error("Empty terms are not allowed.");
                }
                else {
                    this.newTerm(termText);
                }
                this.controller.removeModal();
                document.removeEventListener('keydown', onKey);
            }
            ;
            //Make enter mean OK too
            function onKey_(event) {
                if (event.key === 'Enter') {
                    close.call(this);
                }
            }
            ;
            var onKey = onKey_.bind(this);
            document.addEventListener('keydown', onKey);
            var ok = this.controller.getOkButton(close.bind(this));
            termCont.appendChild(ok);
            this.controller.modal(termCont);
            textBox.focus();
        };
        //Add a new term
        ContentPane.prototype.newTerm = function (text) {
            var index = this.terms.length;
            this.terms[index] = text;
            var el = this.newTermEl(index);
            this.termEl.appendChild(el);
            this.select(el);
            this.controller.currCanvas.setAdding('t' + index);
            this.controller.setDisplayCanvas(this.controller.currCanvas.getStepAsInstructions());
        };
        /**
         * Return a new term element
         * representing content with a
         * particular index.
         *
         * @param index The index.
         */
        ContentPane.prototype.newTermEl = function (index) {
            var el = document.createElement('div');
            el.innerHTML = this.terms[index];
            el.className = 'content';
            el.addEventListener('click', function () {
                this.deselect();
                this.select(el);
                this.controller.currCanvas.setAdding('t' + index);
                this.controller.currCanvas.emptySelected();
                this.controller.currCanvas.showAsSelected('t' + index);
            }.bind(this));
            return el;
        };
        /**
         * Add a new divider.
         */
        ContentPane.prototype.addDivider = function () {
            this.hDividers++;
            this.refreshDividers();
            this.select(this.hDividerEl.children[this.hDividerEl.childElementCount - 1]);
            this.controller.currCanvas.setAdding('h' + (this.hDividers - 1));
            this.controller.setDisplayCanvas(this.controller.currCanvas.getStepAsInstructions());
        };
        /**
         * Reset the divider selection elements
         * to match the content pane's model.
         */
        ContentPane.prototype.refreshDividers = function () {
            var els = [];
            for (var i = 0; i < this.hDividers; i++) {
                var el = document.createElement('div');
                el.innerHTML = "" + i;
                el.className = 'content';
                el.addEventListener('click', function (select, index) {
                    this.deselect();
                    this.select(select);
                    this.controller.currCanvas.setAdding('h' + index);
                    this.controller.currCanvas.emptySelected();
                    this.controller.currCanvas.showAsSelected('h' + index);
                }.bind(this, el, i));
                els.push(el);
            }
            this.controller.fillEl(this.hDividerEl, els);
        };
        /**
         * Unhighlight selectable content.
         */
        ContentPane.prototype.deselect = function () {
            if (this.selected) {
                this.selected.classList.remove('selected');
                this.selected = undefined;
            }
        };
        /**
         * Select an element.
         *
         * @param el The element to select.
         */
        ContentPane.prototype.select = function (el) {
            this.deselect();
            this.selected = el;
            this.selected.classList.add('selected');
        };
        /**
         * Add elements to select the available
         * containers.
         */
        ContentPane.prototype.addContainers = function () {
            var vbox = document.createElement('div');
            vbox.innerHTML = 'vbox';
            vbox.className = 'content';
            var addVbox = function () {
                this.controller.currCanvas.setAdding({
                    type: 'vbox',
                    children: []
                });
                this.deselect();
                this.select(vbox);
                vbox.classList.add('selected');
                this.controller.currCanvas.emptySelected();
            }.bind(this);
            vbox.addEventListener('click', addVbox.bind(this));
            this.containerEl.appendChild(vbox);
            var hbox = document.createElement('div');
            hbox.innerHTML = 'hbox';
            hbox.className = 'content';
            var addHbox = function () {
                this.controller.currCanvas.setAdding({
                    type: 'hbox',
                    children: []
                });
                this.deselect();
                this.select(hbox);
                this.controller.currCanvas.emptySelected();
            }.bind(this);
            hbox.addEventListener('click', addHbox);
            this.containerEl.appendChild(hbox);
            var tightHbox = document.createElement('div');
            tightHbox.innerHTML = 'tight hbox';
            tightHbox.className = 'content';
            var addTightHbox = function () {
                this.controller.currCanvas.setAdding({
                    type: 'tightHBox',
                    children: []
                });
                this.deselect();
                this.select(tightHbox);
                this.controller.currCanvas.emptySelected();
            }.bind(this);
            tightHbox.addEventListener('click', addTightHbox);
            this.containerEl.appendChild(tightHbox);
            var subSuper = document.createElement('div');
            subSuper.innerHTML = 'Pow/Subscript';
            subSuper.className = 'content';
            var addSubSuper = function () {
                this.controller.currCanvas.setAdding({
                    type: 'subSuper',
                    top: [],
                    middle: [],
                    bottom: []
                });
                this.deselect();
                this.select(subSuper);
                this.controller.currCanvas.emptySelected();
            }.bind(this);
            subSuper.addEventListener('click', addSubSuper);
            this.containerEl.appendChild(subSuper);
        };
        /**
         * Update the elements to cause
         * adding of the correct content.
         * Called after removal of a piece
         * of content.
         */
        ContentPane.prototype.refreshTerms = function () {
            this.termEl.innerHTML = "";
            for (var i = 0; i < this.terms.length; i++) {
                this.termEl.appendChild(this.newTermEl(i));
            }
        };
        /**
         * Show some content on the current
         * canvas.
         *
         * @param toShow The reference of the content to show.
         */
        ContentPane.prototype.showOnCanvas = function (toShow) {
            this.controller.currCanvas.emptySelected();
            this.controller.currCanvas.showAsSelected(toShow);
        };
        /**
         * Get the font metrics object for the
         * terms in this slideshow.
         */
        ContentPane.prototype.getMetrics = function () {
            var _this = this;
            var metricsArr = [];
            var _loop_1 = function (i) {
                var metrics = {};
                metricsArr.push(metrics);
                metrics['widths'] = [];
                /* Look for the max ascent and
                   descent, which all terms will use. */
                var maxAscent = 0;
                var maxDescent = 0;
                this_1.terms.forEach(function (term) {
                    var termMetrics = _this.measureTerm(term, i);
                    if (termMetrics['ascent'] > maxAscent) {
                        maxAscent = termMetrics['ascent'];
                    }
                    if (termMetrics['descent'] > maxDescent) {
                        maxDescent = termMetrics['descent'];
                    }
                    //All terms have their own width
                    metrics['widths'].push(termMetrics['width']);
                });
                metrics['ascent'] = maxAscent;
                metrics['height'] = maxAscent + maxDescent;
            };
            var this_1 = this;
            //Calculate a metrics object for each width tier
            for (var i = 0; i < consts_1["default"].widthTiers.length; i++) {
                _loop_1(i);
            }
            return metricsArr;
        };
        /**
         * Measure the metrics for a term.
         *
         * @param term The term to measure.
         * @param tier The width tier to measure this term for.
         */
        ContentPane.prototype.measureTerm = function (term, tier) {
            var toReturn = {};
            var fontSize = helpers_1.getFontSizeForTier(tier);
            //Create a canvas to measure with
            var testCanvas = document.createElement("canvas");
            testCanvas.width = consts_1["default"].testCanvasWidth;
            testCanvas.height = fontSize * consts_1["default"].testCanvasFontSizeMultiple;
            var testCtx = testCanvas.getContext("2d");
            testCtx.font = fontSize + "px " + consts_1["default"].fontFamily;
            //Get the width
            toReturn['width'] = testCtx.measureText(term).width;
            //Draw the text on the canvas to measure ascent and descent
            testCtx.fillStyle = "white";
            testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
            testCtx.fillStyle = "black";
            testCtx.fillText(term, 0, testCanvas.height / 2);
            var image = testCtx.getImageData(0, 0, toReturn['width'], testCanvas.height);
            var imageData = image.data;
            //Go down until we find text
            var i = 0;
            while (++i < imageData.length && imageData[i] === 255)
                ;
            var ascent = i / (image.width * 4);
            //Go up until we find text
            i = imageData.length - 1;
            while (--i > 0 && imageData[i] === 255)
                ;
            var descent = i / (image.width * 4);
            toReturn['ascent'] = testCanvas.height / 2 - ascent;
            toReturn['descent'] = descent - testCanvas.height / 2;
            return toReturn;
        };
        /**
         * Returns the reference of the
         * selected content. If nothing is
         * selected, returns undefined.
         */
        ContentPane.prototype.findRefOfSelected = function () {
            //Search terms
            for (var i = 0; i < this.termEl.childElementCount; i++) {
                var currEl = this.termEl.children[i];
                if (currEl === this.selected) {
                    return 't' + i;
                }
            }
            //Search h dividers
            for (var i = 0; i < this.hDividerEl.childElementCount; i++) {
                var currEl = this.hDividerEl.children[i];
                if (currEl === this.selected) {
                    return 'h' + i;
                }
            }
        };
        /**
         * Given a reference to content,
         * delete the content pane's copy
         * of the content from its arrays.
         *
         * @param ref The reference of the content to delete.
         */
        ContentPane.prototype.deleteContent = function (ref) {
            var type = ref.charAt(0);
            var index = parseFloat(ref.substring(1, ref.length));
            if (type === 't') {
                this.terms.splice(index, 1);
                this.refreshTerms();
            }
            else if (type === 'h') {
                this.hDividers--;
                this.refreshDividers();
            }
            else {
                throw "unrecognized content type";
            }
        };
        /**
         * Delete the currently selected content.
         */
        ContentPane.prototype["delete"] = function () {
            if (this.selected === undefined) {
                this.controller.error("Select content to delete");
                throw "Select content to delete";
            }
            if (this.selected.parentElement === this.containerEl) {
                this.controller.error("Can't delete containers.");
                throw "can't delete that";
            }
            //Look through content to see if selected is there
            var ref = this.findRefOfSelected();
            //Remove element representing the content
            this.selected.parentElement.removeChild(this.selected);
            this.deselect();
            //Remove from array
            this.deleteContent(ref);
            //Remove the content from all steps
            this.controller.slideManager.removeContent(ref);
        };
        /**
         * Emphasize the component that is
         * currently selected on the canvas.
         *
         * @param ref The reference string of the selected component.
         */
        ContentPane.prototype.showSelected = function (ref) {
            var type = ref.substring(0, 1);
            var index = ref.substring(1, ref.length);
            switch (type) {
                case 't':
                    this.emphasize(this.termEl.children[index]);
                    break;
                case 'h':
                    this.emphasize(this.hDividerEl.children[index]);
                    break;
                default:
                    throw "unrecognized content type";
            }
        };
        /**
         * Emphasize an Element by adding a
         * border to it.
         *
         * @param el The element to emphasize.
         */
        ContentPane.prototype.emphasize = function (el) {
            this.deEmphasize();
            this.emphasized = el;
            this.emphasized.classList.add('border');
        };
        /**
         * Remove emphasis from the currently
         * emphasized element.
         */
        ContentPane.prototype.deEmphasize = function () {
            if (this.emphasized) {
                this.emphasized.classList.remove('border');
            }
        };
        ContentPane.prototype.getTerms = function () {
            return this.terms;
        };
        ContentPane.prototype.getDividers = function () {
            return this.hDividers;
        };
        /**
         * Add content information to
         * a JSON object for saving.
         *
         * @param toJSON The JSON object.
         */
        ContentPane.prototype.addJSON = function (toJSON) {
            toJSON['metrics'] = this.getMetrics();
            toJSON['hDividers'] = this.hDividers;
            toJSON['terms'] = this.terms;
        };
        /**
         * Load the content pane from an
         * instructions object.
         *
         * @param instructions The instructions object.
         */
        ContentPane.prototype.fromJSON = function (instructions) {
            this.selected = undefined;
            this.terms = instructions['terms'];
            this.refreshTerms();
            this.hDividers = instructions['hDividers'];
            this.refreshDividers();
        };
        return ContentPane;
    }());
    exports["default"] = ContentPane;
});

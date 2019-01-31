var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../layout/VBox", "../layout/HBox", "../layout/TightHBox", "../layout/EqContainer", "../layout/EqContent", "../main/consts", "../layout/SubSuper", "./SelectableCanvasController"], function (require, exports, VBox_1, HBox_1, TightHBox_1, EqContainer_1, EqContent_1, consts_1, SubSuper_1, SelectableCanvasController_1) {
    "use strict";
    exports.__esModule = true;
    var State;
    (function (State) {
        State[State["Adding"] = 0] = "Adding";
        State[State["Selecting"] = 1] = "Selecting";
        State[State["Idle"] = 2] = "Idle";
    })(State || (State = {}));
    /**
     * Overrides methods of the canvas controller to
     * provide editing functionality.
     */
    var CreatorCanvasController = (function (_super) {
        __extends(CreatorCanvasController, _super);
        function CreatorCanvasController(container, instructions, onLayoutModified, controller) {
            var _this = _super.call(this, container, instructions) || this;
            _this.state = State.Idle;
            _this.controller = controller;
            _this.onLayoutModified = onLayoutModified;
            _this.canvas.removeEventListener('click', _this.nextStep);
            _this.canvas.addEventListener('click', _this.editClick.bind(_this));
            //Add text area
            _this.textField = document.createElement('textarea');
            _this.textField.rows = 1;
            _this.textField.cols = 70;
            _this.textField.value = _this.steps[0].text;
            _this.container.appendChild(_this.textField);
            var confirm = _this.controller.getOkButton(function () {
                this.steps[0].text = this.textField.value;
                this.refresh();
            }.bind(_this));
            confirm.innerHTML = "Set Text";
            _this.container.appendChild(confirm);
            return _this;
        }
        CreatorCanvasController.prototype.redraw = function () {
            var _this = this;
            _super.prototype.redraw.call(this);
            this.currStates.forEach(function (f) {
                if (f.component instanceof EqContainer_1["default"]) {
                    f.component.creatorDraw(f, _this.ctx);
                }
            });
        };
        /**
         * Recalculates and redraws the current step.
         * Override to store the root layout for later.
         */
        CreatorCanvasController.prototype.recalc = function () {
            var rootLayout;
            _a = this.calcLayout(this.currStep), this.currStates = _a[0], rootLayout = _a[1];
            this.rootContainer = rootLayout.component;
            var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
            this.setSize(width, height);
            this.redraw();
            var _a;
        };
        CreatorCanvasController.prototype.nextStep = function () {
            //Override to not animate
            this.currStates = this.calcLayout(++this.currStep)[0];
        };
        //Override to change padding
        CreatorCanvasController.prototype.parseContainer = function (containerObj) {
            var type = containerObj.type;
            if (type === "vbox") {
                return new VBox_1["default"](this.parseContainerChildren(containerObj.children), consts_1["default"].creatorVBoxPadding);
            }
            else if (type === "hbox") {
                return new HBox_1["default"](this.parseContainerChildren(containerObj.children), consts_1["default"].creatorHBoxPadding);
            }
            else if (type === "tightHBox") {
                return new TightHBox_1["default"](this.parseContainerChildren(containerObj.children), consts_1["default"].creatorTightHBoxPadding);
            }
            else if (type === 'subSuper') {
                var top_1 = new HBox_1["default"](this.parseContainerChildren(containerObj.top), consts_1["default"].creatorHBoxPadding);
                var middle = new TightHBox_1["default"](this.parseContainerChildren(containerObj.middle), consts_1["default"].creatorTightHBoxPadding);
                var bottom = new HBox_1["default"](this.parseContainerChildren(containerObj.bottom), consts_1["default"].creatorHBoxPadding);
                var portrusion = containerObj['portrusion'] ? containerObj['portrusion'] : consts_1["default"].defaultExpPortrusion;
                return new SubSuper_1["default"](top_1, middle, bottom, portrusion, consts_1["default"].creatorSubSuperPadding);
            }
            else if (type === undefined) {
                this.controller.error("Invalid JSON File");
                throw "Invalid JSON File: Missing type attribute on container descriptor.";
            }
            else {
                this.controller.error("Invalid JSON File");
                throw "Invalid JSON File: Unrecognized type: " + type;
            }
        };
        /**
         * Returns the thing to add as a component.
         */
        CreatorCanvasController.prototype.getAddComponent = function () {
            if (typeof this.adding === 'object') {
                //Adding a container
                return this.parseContainer(this.adding);
            }
            else if (typeof this.adding === 'string') {
                return this.getContentFromRef(this.adding);
            }
            else {
                throw 'bad add type';
            }
        };
        /**
         * Given a click on the canvas,
         * performs the appropriate action.
         *
         * @param e Event detailing the mouse click.
         */
        CreatorCanvasController.prototype.editClick = function (e) {
            var canvasX = e.offsetX;
            var canvasY = e.offsetY;
            switch (this.state) {
                case State.Adding:
                    this.addClick(canvasX, canvasY);
                    break;
                case State.Selecting:
                    this.selectClick(canvasX, canvasY);
                    break;
                case State.Idle:
                    break;
            }
        };
        /**
         * Selects the content at the
         * specified position.
         *
         * @param x The x-ordinate clicked.
         * @param y The y-ordinate clicked.
         */
        CreatorCanvasController.prototype.selectClick = function (x, y) {
            var clickedLayout = this.getClickedLayout(x, y);
            if (clickedLayout === undefined) {
                throw "click wasn't on any frame";
            }
            else {
                this.controller.select(clickedLayout);
                this.selected = [];
                this.selected.push(clickedLayout);
                this.controller.contentManager.deEmphasize();
                if (clickedLayout.component instanceof EqContent_1["default"]) {
                    //Highlight clicked content in the content pane
                    this.controller.contentManager.showSelected(this.getContentReference(clickedLayout.component));
                }
                this.redraw();
            }
        };
        /**
         * Whether the component to be added
         * is already on the canvas.
         */
        CreatorCanvasController.prototype.onCanvas = function () {
            //Duplicate containers allowed
            if (typeof this.adding === 'object') {
                return false;
            }
            return this.recursiveOnCanvas(this.steps[0].root);
        };
        /**
         * Recursively checks if the
         * component to add already
         * exists on the canvas.
         *
         * @param toCheck The object to check.
         */
        CreatorCanvasController.prototype.recursiveOnCanvas = function (toCheck) {
            var _this = this;
            var found = false;
            Object.keys(toCheck).forEach(function (key) {
                var value = toCheck[key];
                if (typeof value === 'object') {
                    if (_this.recursiveOnCanvas(value)) {
                        found = true;
                    }
                }
                else if (typeof value === 'string') {
                    if (value === _this.adding) {
                        found = true;
                    }
                }
            });
            return found;
        };
        /**
         * Adds a container/content at the
         * clicked position.
         *
         * @param x X-ordinate on the canvas.
         * @param y Y-orindate on the canvas.
         */
        CreatorCanvasController.prototype.addClick = function (x, y) {
            //Check if the content is already on the canvas
            if (this.onCanvas()) {
                this.controller.error("Can't add duplicate content.");
                throw "duplicate content not allowed";
            }
            var clickedLayout = this.getClickedLayout(x, y);
            if (clickedLayout === undefined) {
                //Didn't click on anything
                throw "click wasn't on any frame";
            }
            else if (clickedLayout.component instanceof EqContent_1["default"]) {
                this.addClickOnComponent(clickedLayout, x, y);
            }
            else if (clickedLayout.component instanceof EqContainer_1["default"]) {
                clickedLayout.component.addClick(clickedLayout, x, y, this.getAddComponent());
            }
            else {
                throw "unrecognized frame type";
            }
            this.refresh();
            this.controller.contentManager.startSelecting();
        };
        /**
         * Adds content when the click was on a
         * component. This adds the content
         * adjacent to the component.
         *
         * @param clickedLayout The Layout state of the clicked component.
         * @param x The x-ordinate clicked.
         * @param y The y-ordinate clicked.
         */
        CreatorCanvasController.prototype.addClickOnComponent = function (clickedLayout, x, y) {
            //Add adjacent to content
            var container = clickedLayout.layoutParent.component;
            container.addClickOnChild(clickedLayout, x, y, this.getAddComponent());
        };
        /**
         * Start the conversion to a step
         * layout object.
         *
         * @param root The root container.
         */
        CreatorCanvasController.prototype.toStepLayout = function (root) {
            return {
                color: this.steps[0].color,
                opacity: this.steps[0].opacity,
                text: this.steps[0].text,
                root: root.toStepLayout(this)
            };
        };
        /**
         * Show some content piece as
         * selected.
         *
         * @param ref Reference of the content to be selected.
         */
        CreatorCanvasController.prototype.showAsSelected = function (ref) {
            var content = this.getContentFromRef(ref);
            //Find the layout state for that content
            var state = this.currStates.get(content);
            if (state) {
                this.selected.push(state);
            }
            this.redraw();
        };
        /**
         * Updates the controller to
         * reflect the changes made.
         */
        CreatorCanvasController.prototype.refresh = function () {
            var newLayout = this.toStepLayout(this.rootContainer);
            this.onLayoutModified(this.controller.instructionsFromStep(newLayout));
        };
        /**
         * Select a component on the next click.
         */
        CreatorCanvasController.prototype.select = function () {
            this.state = State.Selecting;
        };
        /**
         * Set the component to be added
         * upon a click.
         *
         * @param newAdd The to-be-added component.
         */
        CreatorCanvasController.prototype.setAdding = function (newAdd) {
            this.state = State.Adding;
            this.adding = newAdd;
        };
        /**
         * Return the to-be-added component.
         */
        CreatorCanvasController.prototype.getAdding = function () {
            return this.adding;
        };
        /**
         * Returns the current step layout
         * as an instructions object that
         * can be used to re-initialize the
         * canvas.
         */
        CreatorCanvasController.prototype.getStepAsInstructions = function () {
            return this.controller.instructionsFromStep(this.steps[0]);
        };
        /**
         * Delete the component that generated
         * a layout state.
         *
         * @param state The layout state generated by a component.
         */
        CreatorCanvasController.prototype["delete"] = function (state) {
            var parent = state.layoutParent.component;
            parent["delete"](state.component);
            this.refresh();
        };
        /**
         * Changes the color of components. If the selected
         * component is a container, changes the color of all
         * components within it. If it is content, just changes
         * that content.
         *
         * @param selected The component to apply color to.
         * @param colorName The name of the color (defined by the keys in C.colors)
         */
        CreatorCanvasController.prototype.changeColor = function (selected, colorName) {
            if (selected instanceof EqContent_1["default"]) {
                this.applyColor(selected, colorName);
            }
            else if (selected instanceof EqContainer_1["default"]) {
                //Apply to all inside container
                selected.forEachUnder(function (content) {
                    this.applyColor(content, colorName);
                }.bind(this));
            }
            this.refresh();
        };
        /**
         * Changes the opacity of components. If the selected
         * component is a container, changes the color of all
         * components within it. If it is content, just changes
         * that content.
         *
         * @param selected The component to apply opacity to.
         * @param opacity The new opacity level.
         */
        CreatorCanvasController.prototype.changeOpacity = function (selected, opacity) {
            if (selected instanceof EqContent_1["default"]) {
                this.applyOpacity(selected, opacity);
            }
            else if (selected instanceof EqContainer_1["default"]) {
                //Apply to all inside the container
                selected.forEachUnder(function (content) {
                    this.applyOpacity(content, opacity);
                }.bind(this));
            }
            this.refresh();
        };
        /**
         * Applies color to a particular piece of content.
         *
         * @param applyTo The content to apply color to.
         * @param colorName The name of the color.
         */
        CreatorCanvasController.prototype.applyColor = function (applyTo, colorName) {
            var step = this.steps[0];
            if (step['color'] === undefined) {
                step.color = {};
            }
            var ref = this.getContentReference(applyTo);
            if (colorName === 'default') {
                //Remove any color already set for this content
                delete step.color[ref];
                if (Object.keys(step.color).length === 0) {
                    //Empty colors, delete as well
                    delete step.color;
                }
            }
            else {
                step.color[ref] = colorName;
            }
        };
        /**
         * Applies opacity to a particular piece of content.
         *
         * @param applyTo The content to apply opacity to.
         * @param opacity The opacity to apply.
         */
        CreatorCanvasController.prototype.applyOpacity = function (applyTo, opacity) {
            var step = this.steps[0];
            if (step['opacity'] === undefined) {
                step.opacity = {};
            }
            var ref = this.getContentReference(applyTo);
            if (opacity === consts_1["default"].normalOpacity) {
                //Remove any opacity already set for this content
                delete step.opacity[ref];
                if (Object.keys(step.opacity).length === 0) {
                    //Empty opacity, delete as well
                    delete step.opacity;
                }
            }
            else {
                step.opacity[ref] = opacity;
            }
        };
        /**
         * Sets the state of a new canvas to be
         * the same as of an old one.
         *
         * @param oldCanvas The old canvas.
         * @param newCanvas The new canvas.
         */
        CreatorCanvasController.transferState = function (oldCanvas, newCanvas) {
            switch (oldCanvas.state) {
                case State.Adding:
                    newCanvas.setAdding(oldCanvas.getAdding());
                    break;
                case State.Selecting:
                    newCanvas.select();
                    break;
            }
        };
        return CreatorCanvasController;
    }(SelectableCanvasController_1["default"]));
    exports["default"] = CreatorCanvasController;
});

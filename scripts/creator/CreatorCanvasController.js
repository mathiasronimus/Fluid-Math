define(["require", "exports", "../main/CanvasController", "../layout/VBox", "../layout/HBox", "../layout/TightHBox", "../layout/EqContainer", "../layout/EqContent", "../main/consts", "../layout/SubSuper", "../layout/HDivider"], function (require, exports, CanvasController_1, VBox_1, HBox_1, TightHBox_1, EqContainer_1, EqContent_1, consts_1, SubSuper_1, HDivider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    class CreatorCanvasController extends CanvasController_1.default {
        constructor(container, instructions, onLayoutModified, controller) {
            super(container, instructions);
            this.state = State.Idle;
            this.controller = controller;
            this.recalc();
            this.onLayoutModified = onLayoutModified;
            this.canvas.removeEventListener('click', this.nextStep);
            this.canvas.addEventListener('click', this.editClick.bind(this));
            //Add text area
            this.textField = document.createElement('textarea');
            this.textField.rows = 1;
            this.textField.cols = 70;
            this.textField.value = this.steps[0].text;
            this.container.appendChild(this.textField);
            let confirm = this.controller.getOkButton(function () {
                this.steps[0].text = this.textField.value;
                this.refresh();
            }.bind(this));
            confirm.innerHTML = "Set Text";
            this.container.appendChild(confirm);
        }
        redraw() {
            super.redraw();
            this.currStates.forEach(f => {
                if (f.component instanceof EqContainer_1.default) {
                    f.component.creatorDraw(f, this.ctx);
                }
            });
        }
        nextStep() {
            //Override to not animate
            this.currStates = this.calcLayout(++this.currStep);
        }
        //Override to change padding
        parseContainer(containerObj) {
            let type = containerObj.type;
            if (type === "vbox") {
                return new VBox_1.default(this.parseContainerChildren(containerObj.children), consts_1.default.creatorVBoxPadding);
            }
            else if (type === "hbox") {
                return new HBox_1.default(this.parseContainerChildren(containerObj.children), consts_1.default.creatorHBoxPadding);
            }
            else if (type === "tightHBox") {
                return new TightHBox_1.default(this.parseContainerChildren(containerObj.children), consts_1.default.creatorTightHBoxPadding);
            }
            else if (type === 'subSuper') {
                let top = new HBox_1.default(this.parseContainerChildren(containerObj.top), consts_1.default.creatorHBoxPadding);
                let middle = new TightHBox_1.default(this.parseContainerChildren(containerObj.middle), consts_1.default.creatorTightHBoxPadding);
                let bottom = new HBox_1.default(this.parseContainerChildren(containerObj.bottom), consts_1.default.creatorHBoxPadding);
                return new SubSuper_1.default(top, middle, bottom, consts_1.default.creatorSubSuperPadding);
            }
            else if (type === undefined) {
                throw "Invalid JSON File: Missing type attribute on container descriptor.";
            }
            else {
                throw "Invalid JSON File: Unrecognized type: " + type;
            }
        }
        //Override to give h dividers some padding
        initContent(instructions) {
            super.initContent(instructions);
            this.hDividers = [];
            for (let i = 0; i < instructions['hDividers']; i++) {
                this.hDividers.push(new HDivider_1.default(consts_1.default.creatorHDividerPadding));
            }
        }
        /**
         * Returns the thing to add as a component.
         */
        getAddComponent() {
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
        }
        /**
         * Given a click on the canvas,
         * performs the appropriate action.
         *
         * @param e Event detailing the mouse click.
         */
        editClick(e) {
            let canvasX = e.pageX - this.canvas.offsetLeft;
            let canvasY = e.pageY - this.canvas.offsetTop + this.container.scrollTop;
            switch (this.state) {
                case State.Adding:
                    this.addClick(canvasX, canvasY);
                    this.refresh();
                    break;
                case State.Selecting:
                    this.selectClick(canvasX, canvasY);
                    break;
                case State.Idle:
                    break;
            }
        }
        /**
         * Selects the content at the
         * specified position.
         *
         * @param x The x-ordinate clicked.
         * @param y The y-ordinate clicked.
         */
        selectClick(x, y) {
            let clickedLayout = this.getClickedLayout(x, y);
            if (clickedLayout === undefined) {
                throw "click wasn't on any frame";
            }
            else {
                this.controller.select(clickedLayout);
            }
        }
        /**
         * Whether the component to be added
         * is already on the canvas.
         */
        onCanvas() {
            //Duplicate containers allowed
            if (typeof this.adding === 'object') {
                return false;
            }
            return this.recursiveOnCanvas(this.steps[0].root);
        }
        /**
         * Recursively checks if the
         * component to add already
         * exists on the canvas.
         *
         * @param toCheck The object to check.
         */
        recursiveOnCanvas(toCheck) {
            let found = false;
            Object.keys(toCheck).forEach(key => {
                let value = toCheck[key];
                if (typeof value === 'object') {
                    if (this.recursiveOnCanvas(value)) {
                        found = true;
                    }
                }
                else if (typeof value === 'string') {
                    if (value === this.adding) {
                        found = true;
                    }
                }
            });
            return found;
        }
        /**
         * Adds a container/content at the
         * clicked position.
         *
         * @param x X-ordinate on the canvas.
         * @param y Y-orindate on the canvas.
         */
        addClick(x, y) {
            //Check if the content is already on the canvas
            if (this.onCanvas()) {
                throw "duplicate content not allowed";
            }
            let clickedLayout = this.getClickedLayout(x, y);
            if (clickedLayout === undefined) {
                //Didn't click on anything
                throw "click wasn't on any frame";
            }
            else if (clickedLayout.component instanceof EqContent_1.default) {
                this.addClickOnComponent(clickedLayout, x, y);
            }
            else if (clickedLayout.component instanceof EqContainer_1.default) {
                clickedLayout.component.addClick(clickedLayout, x, y, this.getAddComponent());
            }
            else {
                throw "unrecognized frame type";
            }
        }
        /**
         * Adds content when the click was on a
         * component. This adds the content
         * adjacent to the component.
         *
         * @param clickedLayout The Layout state of the clicked component.
         * @param x The x-ordinate clicked.
         * @param y The y-ordinate clicked.
         */
        addClickOnComponent(clickedLayout, x, y) {
            //Add adjacent to content
            let container = clickedLayout.layoutParent.component;
            container.addClickOnChild(clickedLayout, x, y, this.getAddComponent());
        }
        /**
         * Given clicked coordinates, find
         * the frame that was clicked. If not
         * found, returns undefined.
         *
         * @param x X-ordinate on the canvas.
         * @param y Y-ordinate on the canvas.
         */
        getClickedLayout(x, y) {
            for (let i = 0; i < this.currStates.length; i++) {
                let currState = this.currStates[i];
                if (currState.contains(x, y)) {
                    return currState;
                }
            }
            return undefined;
        }
        /**
         * Start the conversion to a step
         * layout object.
         *
         * @param root The root container.
         */
        toStepLayout(root) {
            return {
                color: this.steps[0].color,
                opacity: this.steps[0].opacity,
                text: this.steps[0].text,
                root: root.toStepLayout(this)
            };
        }
        /**
         * Updates the controller to
         * reflect the changes made.
         */
        refresh() {
            let root = this.currStates[this.currStates.length - 1].component;
            let newLayout = this.toStepLayout(root);
            this.onLayoutModified(this.controller.instructionsFromStep(newLayout));
        }
        /**
         * Select a component on the next click.
         */
        select() {
            this.state = State.Selecting;
        }
        /**
         * Set the component to be added
         * upon a click.
         *
         * @param newAdd The to-be-added component.
         */
        setAdding(newAdd) {
            this.state = State.Adding;
            this.adding = newAdd;
        }
        /**
         * Return the to-be-added component.
         */
        getAdding() {
            return this.adding;
        }
        /**
         * Returns the current step layout
         * as an instructions object that
         * can be used to re-initialize the
         * canvas.
         */
        getStepAsInstructions() {
            return this.controller.instructionsFromStep(this.steps[0]);
        }
        /**
         * Delete the component that generated
         * a layout state.
         *
         * @param state The layout state generated by a component.
         */
        delete(state) {
            let parent = state.layoutParent.component;
            parent.delete(state.component);
            this.refresh();
        }
        /**
         * Changes the color of components. If the selected
         * component is a container, changes the color of all
         * components within it. If it is content, just changes
         * that content.
         *
         * @param selected The component to apply color to.
         * @param colorName The name of the color (defined by the keys in C.colors)
         */
        changeColor(selected, colorName) {
            if (selected instanceof EqContent_1.default) {
                this.applyColor(selected, colorName);
            }
            else if (selected instanceof EqContainer_1.default) {
                //Apply to all inside container
                selected.forEachUnder(function (content) {
                    this.applyColor(content, colorName);
                }.bind(this));
            }
            this.refresh();
        }
        /**
         * Changes the opacity of components. If the selected
         * component is a container, changes the color of all
         * components within it. If it is content, just changes
         * that content.
         *
         * @param selected The component to apply opacity to.
         * @param opacity The new opacity level.
         */
        changeOpacity(selected, opacity) {
            if (selected instanceof EqContent_1.default) {
                this.applyOpacity(selected, opacity);
            }
            else if (selected instanceof EqContainer_1.default) {
                //Apply to all inside the container
                selected.forEachUnder(function (content) {
                    this.applyOpacity(content, opacity);
                }.bind(this));
            }
            this.refresh();
        }
        /**
         * Applies color to a particular piece of content.
         *
         * @param applyTo The content to apply color to.
         * @param colorName The name of the color.
         */
        applyColor(applyTo, colorName) {
            let step = this.steps[0];
            if (step['color'] === undefined) {
                step.color = {};
            }
            let ref = this.getContentReference(applyTo);
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
        }
        /**
         * Applies opacity to a particular piece of content.
         *
         * @param applyTo The content to apply opacity to.
         * @param opacity The opacity to apply.
         */
        applyOpacity(applyTo, opacity) {
            let step = this.steps[0];
            if (step['opacity'] === undefined) {
                step.opacity = {};
            }
            let ref = this.getContentReference(applyTo);
            if (opacity === consts_1.default.normalOpacity) {
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
        }
        /**
         * Sets the state of a new canvas to be
         * the same as of an old one.
         *
         * @param oldCanvas The old canvas.
         * @param newCanvas The new canvas.
         */
        static transferState(oldCanvas, newCanvas) {
            switch (oldCanvas.state) {
                case State.Adding:
                    newCanvas.setAdding(oldCanvas.getAdding());
                    break;
                case State.Selecting:
                    newCanvas.select();
                    break;
            }
        }
    }
    exports.default = CreatorCanvasController;
});

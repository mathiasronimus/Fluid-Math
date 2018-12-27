define(["require", "exports", "../main/CanvasController", "../layout/VBox", "../layout/HBox", "../layout/EqContainer", "../layout/EqContent", "../layout/Padding", "../main/consts"], function (require, exports, CanvasController_1, VBox_1, HBox_1, EqContainer_1, EqContent_1, Padding_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State;
    (function (State) {
        State[State["Adding"] = 0] = "Adding";
        State[State["Selecting"] = 1] = "Selecting";
        State[State["Idle"] = 2] = "Idle";
    })(State || (State = {}));
    class CreatorCanvasController extends CanvasController_1.default {
        constructor(container, instructions, fontFamily, fontWeight, onLayoutModified, controller) {
            super(container, instructions, fontFamily, fontWeight);
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
            this.container.appendChild(this.controller.getOkButton(function () {
                this.newText = this.textField.value;
                this.refresh();
            }.bind(this)));
        }
        redraw() {
            super.redraw();
            this.currStates.forEach(f => {
                //Draw borders
                if (f.component instanceof VBox_1.default) {
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                    //Outer border
                    this.ctx.rect(f.tlx, f.tly, f.width, f.height);
                    this.ctx.stroke();
                    let pad = consts_1.default.creatorVBoxPadding;
                    //Middle border, top and bottom
                    this.ctx.setLineDash([5]);
                    line(f.tlx, f.tly + pad / 2, f.tlx + f.width, f.tly + pad / 2, this.ctx);
                    line(f.tlx, f.tly + f.height - pad / 2, f.tlx + f.width, f.tly + f.height - pad / 2, this.ctx);
                    //Inner border, top and bottom
                    this.ctx.setLineDash([]);
                    line(f.tlx, f.tly + pad, f.tlx + f.width, f.tly + pad, this.ctx);
                    line(f.tlx, f.tly + f.height - pad, f.tlx + f.width, f.tly + f.height - pad, this.ctx);
                    this.ctx.strokeStyle = "#000";
                }
                else if (f.component instanceof HBox_1.default) {
                    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                    //Outer border
                    this.ctx.rect(f.tlx, f.tly, f.width, f.height);
                    this.ctx.stroke();
                    let pad = consts_1.default.creatorHBoxPadding;
                    //Middle border, top and bottom
                    this.ctx.setLineDash([5]);
                    line(f.tlx + pad / 2, f.tly, f.tlx + pad / 2, f.tly + f.height, this.ctx);
                    line(f.tlx + f.width - pad / 2, f.tly, f.tlx + f.width - pad / 2, f.tly + f.height, this.ctx);
                    //Inner border, top and bottom
                    this.ctx.setLineDash([]);
                    line(f.tlx + pad, f.tly, f.tlx + pad, f.tly + f.height, this.ctx);
                    line(f.tlx + f.width - pad, f.tly, f.tlx + f.width - pad, f.tly + f.height, this.ctx);
                    this.ctx.strokeStyle = "#000";
                }
            });
            function line(x1, y1, x2, y2, ctx) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
        nextStep() {
            //Override to not animate
            this.currStates = this.calcLayout(++this.currStep);
        }
        //Override to change padding
        parseContainer(containerObj) {
            let type = containerObj.type;
            if (type === "vbox") {
                return new VBox_1.default(this.parseContainerChildren(containerObj.children), Padding_1.default.even(consts_1.default.creatorVBoxPadding));
            }
            else if (type === "hbox") {
                return new HBox_1.default(this.parseContainerChildren(containerObj.children), Padding_1.default.even(consts_1.default.creatorHBoxPadding));
            }
            else if (type === undefined) {
                throw "Invalid JSON File: Missing type attribute on container descriptor.";
            }
            else {
                throw "Invalid JSON File: Unrecognized type: " + type;
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
            else if (typeof this.adding === 'number') {
                return this.content[this.adding];
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
            Object.keys(toCheck).forEach(key => {
                let value = toCheck[key];
                if (typeof value === 'object') {
                    if (this.recursiveOnCanvas(value)) {
                        return true;
                    }
                }
                else if (typeof value === 'number') {
                    if (value === this.adding) {
                        return true;
                    }
                }
            });
            return false;
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
            let clickedFrame = this.getClickedLayout(x, y);
            if (clickedFrame === undefined) {
                //Didn't click on anything
                throw "click wasn't on any frame";
            }
            else if (clickedFrame.component instanceof EqContent_1.default) {
                this.addClickOnComponent(clickedFrame, x, y);
            }
            else if (clickedFrame.component instanceof EqContainer_1.default) {
                //Add inside if in inside inner border, adjacent otherwise
                if (clickedFrame.component instanceof VBox_1.default) {
                    this.addClickOnVbox(clickedFrame, y);
                }
                else if (clickedFrame.component instanceof HBox_1.default) {
                    this.addClickOnHbox(clickedFrame, x);
                }
                else {
                    throw 'unrecognized container type';
                }
            }
            else {
                throw "unrecognized frame type";
            }
        }
        /**
         * Adds content when an Hbox was clicked.
         * Adds adjacent to or inside the HBox,
         * depending on click.
         *
         * @param clickedLayout The layout state of the clicked HBox.
         * @param x The x-ordinate of the click.
         */
        addClickOnHbox(clickedLayout, x) {
            if (clickedLayout.onLeft(x)) {
                if (x - clickedLayout.tlx <= consts_1.default.creatorHBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        this.addBefore(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                    }
                }
                else {
                    //Inner border, add inside
                    clickedLayout.component.getChildren().unshift(this.getAddComponent());
                }
            }
            else {
                //On right
                if (clickedLayout.tlx + clickedLayout.width - x <= consts_1.default.creatorHBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        this.addAfter(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                    }
                }
                else {
                    //Inner border, add inside
                    clickedLayout.component.getChildren().push(this.getAddComponent());
                }
            }
        }
        /**
         * Adds content when a VBox was clicked.
         * This adds adjacent to or inside the Vbox
         * depending on which part was clicked.
         *
         * @param clickedLayout The Layout state of the clicked Vbox.
         * @param y The y-ordinate of the click.
         */
        addClickOnVbox(clickedLayout, y) {
            if (clickedLayout.onTop(y)) {
                if (y - clickedLayout.tly <= consts_1.default.creatorVBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        this.addBefore(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                    }
                }
                else {
                    //Inside border, add inside
                    clickedLayout.component.getChildren().unshift(this.getAddComponent());
                }
            }
            else {
                //On bottom
                if (clickedLayout.tly + clickedLayout.height - y <= consts_1.default.creatorVBoxPadding / 2) {
                    //Outer border, add adjacent
                    let containerLayout = clickedLayout.layoutParent;
                    if (containerLayout === undefined) {
                        throw "no containing frame";
                    }
                    else {
                        let container = containerLayout.component;
                        this.addAfter(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                    }
                }
                else {
                    //Inner border, add inside
                    clickedLayout.component.getChildren().push(this.getAddComponent());
                }
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
            if (container instanceof VBox_1.default) {
                //Add top/bottom
                if (clickedLayout.onTop(y)) {
                    //Add top
                    this.addBefore(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                }
                else {
                    //Add bottom
                    this.addAfter(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                }
            }
            else if (container instanceof HBox_1.default) {
                //Add left/right
                if (clickedLayout.onLeft(x)) {
                    //Add left
                    this.addBefore(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                }
                else {
                    //Add right
                    this.addAfter(container.getChildren(), this.getAddComponent(), clickedLayout.component);
                }
            }
            else {
                throw "unrecognized container type";
            }
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
         * ENSURE THIS DOES NOT RETURN REFERENCES
         * TO THE ORIGINAL INSTRUCTIONS OBJECT.
         *
         * @param root The root container.
         */
        toStepLayout(root) {
            return {
                text: this.newText ?
                    this.newText :
                    this.steps[0].text,
                root: this.containerToStepLayout(root)
            };
        }
        /**
         * Given the root Component of a layout,
         * return the JSON-ifyable representation
         * as used by the steps array.
         *
         * @param comp The component to start with.
         */
        containerToStepLayout(comp) {
            let toReturn = {};
            if (comp instanceof VBox_1.default) {
                toReturn.type = "vbox";
            }
            else if (comp instanceof HBox_1.default) {
                toReturn.type = "hbox";
            }
            else {
                throw 'unrecognized container type';
            }
            toReturn.children = this.childrenToStepLayout(comp.getChildren());
            return toReturn;
        }
        /**
         * Given a list of components,
         * converts them all to the JSON-ifyable
         * format.
         *
         * @param children A list of components.
         */
        childrenToStepLayout(children) {
            let toReturn = [];
            children.forEach(comp => {
                if (comp instanceof EqContent_1.default) {
                    toReturn.push(this.content.indexOf(comp));
                }
                else if (comp instanceof EqContainer_1.default) {
                    toReturn.push(this.containerToStepLayout(comp));
                }
                else {
                    throw "unrecognized type";
                }
            });
            return toReturn;
        }
        /**
         * Add an element before another in
         * an array.
         *
         * @param arr The array.
         * @param toAdd The element to add.
         * @param before The element after the new one.
         */
        addBefore(arr, toAdd, before) {
            let index = arr.indexOf(before);
            console.log(index);
            arr.splice(index, 0, toAdd);
        }
        /**
         * Add an element after another in an
         * array.
         *
         * @param arr The array.
         * @param toAdd The element to add.
         * @param after The element before the new one.
         */
        addAfter(arr, toAdd, after) {
            let index = arr.indexOf(after);
            arr.splice(index + 1, 0, toAdd);
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
         * Delete the component that generated
         * a layout state.
         *
         * @param state The layout state generated by a component.
         */
        delete(state) {
            let parentChildren = state.layoutParent.component.getChildren();
            parentChildren.splice(parentChildren.indexOf(state.component), 1);
            this.refresh();
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

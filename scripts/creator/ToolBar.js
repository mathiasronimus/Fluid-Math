define(["require", "exports", "../main/consts", "../layout/SubSuper", "../main/CanvasController"], function (require, exports, consts_1, SubSuper_1, CanvasController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ToolBar {
        constructor(controller) {
            this.selected = false;
            this.controller = controller;
            this.element = document.getElementById('top-row');
            this.setDefaultContent();
        }
        /**
         * Displays the default content on
         * the toolbar.
         */
        setDefaultContent() {
            var toAdd = [];
            var loadEl = document.createElement("span");
            loadEl.innerHTML = "get_app";
            loadEl.className = "tool-bar-icon material-icons";
            loadEl.addEventListener('click', this.controller.load);
            toAdd.push(loadEl);
            var saveEl = document.createElement("span");
            saveEl.innerHTML = "save";
            saveEl.className = "tool-bar-icon material-icons";
            saveEl.addEventListener('click', this.controller.save);
            toAdd.push(saveEl);
            let playEl = document.createElement('span');
            playEl.innerHTML = "play_arrow";
            playEl.className = 'tool-bar-icon material-icons';
            playEl.addEventListener('click', this.controller.play);
            toAdd.push(playEl);
            let deleteSlideEl = document.createElement('span');
            deleteSlideEl.className = "tool-bar-icon";
            deleteSlideEl.addEventListener('click', this.controller.deleteSlide);
            let deleteSlideIcon = document.createElement('span');
            deleteSlideIcon.innerHTML = 'delete';
            deleteSlideIcon.className = 'material-icons';
            deleteSlideEl.appendChild(deleteSlideIcon);
            let deleteSlideText = document.createElement('span');
            deleteSlideText.innerHTML = "SLIDE";
            deleteSlideEl.appendChild(deleteSlideText);
            toAdd.push(deleteSlideEl);
            let deleteContentEl = document.createElement('span');
            deleteContentEl.className = "tool-bar-icon";
            deleteContentEl.addEventListener('click', this.controller.deleteContent);
            let deleteContentIcon = document.createElement('span');
            deleteContentIcon.innerHTML = 'delete';
            deleteContentIcon.className = 'material-icons';
            deleteContentEl.appendChild(deleteContentIcon);
            let deleteContentText = document.createElement('span');
            deleteContentText.innerHTML = "CONTENT";
            deleteContentEl.appendChild(deleteContentText);
            toAdd.push(deleteContentEl);
            this.controller.fillEl(this.element, toAdd);
        }
        /**
         * Delete the currently selected
         * component.
         */
        delete() {
            this.controller.currCanvas.delete(this.selectedLayout);
            this.unselect();
        }
        /**
         * Select a component and display editable
         * aspects of it on the toolbar.
         *
         * @param frame The frame to select.
         */
        select(frame) {
            this.selected = true;
            this.selectedLayout = frame;
            //Clear current content
            this.element.innerHTML = "";
            this.element.classList.add('selected');
            //Add an option to unselect, regardless of component
            let unselectEl = document.createElement('span');
            unselectEl.innerHTML = 'clear';
            unselectEl.className = 'tool-bar-icon material-icons';
            unselectEl.addEventListener('click', this.unselect.bind(this));
            this.element.appendChild(unselectEl);
            //Add an option to delete, regardless of component
            let deleteEl = document.createElement('span');
            deleteEl.innerHTML = 'delete';
            deleteEl.className = 'tool-bar-icon material-icons';
            deleteEl.addEventListener('click', this.delete.bind(this));
            this.element.appendChild(deleteEl);
            //Add option to change color
            let colorEl = document.createElement('span');
            colorEl.innerHTML = 'palette';
            colorEl.className = 'tool-bar-icon material-icons';
            colorEl.addEventListener('click', this.changeColor.bind(this));
            this.element.appendChild(colorEl);
            //Add option to change opacity
            let opacityEl = document.createElement('span');
            opacityEl.innerHTML = 'texture';
            opacityEl.className = 'tool-bar-icon material-icons';
            opacityEl.addEventListener('click', this.changeOpacity.bind(this));
            this.element.appendChild(opacityEl);
            //For the subsuper container, add an option to change the alignment
            if (this.selectedLayout.component instanceof SubSuper_1.default) {
                let alignEl = document.createElement('span');
                alignEl.innerHTML = 'vertical_align_top';
                alignEl.className = 'tool-bar-icon material-icons';
                alignEl.addEventListener('click', this.topAlign.bind(this));
                this.element.appendChild(alignEl);
            }
        }
        /**
         * Bring up a dialog to change the top
         * alignment of the selected SubSuper
         * layout.
         */
        topAlign() {
            let container = this.selectedLayout.component;
            let canvas = this.controller.currCanvas;
            let controller = this.controller;
            let modalRoot = document.createElement('div');
            modalRoot.style.padding = "10px";
            let explainer = document.createElement('p');
            explainer.innerHTML = "Use the tool below to change the vertical alignment of the exponent.";
            modalRoot.appendChild(explainer);
            let defaultPreset = document.createElement('div');
            defaultPreset.innerHTML = "Reset";
            defaultPreset.className = 'subsuper-reset-button';
            let col = consts_1.default.colors.blue;
            defaultPreset.style.backgroundColor = 'rgb(' + col[0] + "," + col[1] + ',' + col[2] + ')';
            defaultPreset.addEventListener('click', function () {
                setAlign(consts_1.default.defaultExpPortrusion + "");
            });
            modalRoot.appendChild(defaultPreset);
            let slider = document.createElement('input');
            slider.setAttribute("type", "range");
            slider.setAttribute("min", "0");
            slider.setAttribute("max", "1");
            slider.setAttribute("step", "0.025");
            slider.className = "slider";
            modalRoot.appendChild(slider);
            let previewContainer = document.createElement('div');
            previewContainer.style.width = '600px';
            modalRoot.appendChild(previewContainer);
            let previewCanvas = new CanvasController_1.default(previewContainer, this.controller.currCanvas.getStepAsInstructions());
            slider.oninput = function () {
                setAlign(slider.value);
            };
            this.controller.modal(modalRoot);
            function setAlign(newAlign) {
                slider.value = newAlign;
                container.setPortrusion(parseFloat(newAlign));
                canvas.refresh();
                previewContainer.innerHTML = "";
                previewCanvas = new CanvasController_1.default(previewContainer, controller.currCanvas.getStepAsInstructions());
            }
        }
        changeColor() {
            //Bring up a dialog to change color
            let modalRoot = document.createElement('div');
            //Add elements representing each color
            Object.keys(consts_1.default.colors).forEach(colorName => {
                let colorEl = document.createElement('div');
                let color = consts_1.default.colors[colorName];
                colorEl.innerHTML = colorName;
                colorEl.style.backgroundColor = 'rgb(' + color[0] + ", " + color[1] + "," + color[2] + ")";
                colorEl.className = 'color-selector';
                colorEl.addEventListener('click', function (colorName) {
                    this.controller.removeModal();
                    this.controller.currCanvas.changeColor(this.selectedLayout.component, colorName);
                    this.unselect();
                }.bind(this, colorName));
                modalRoot.appendChild(colorEl);
            });
            this.controller.modal(modalRoot);
        }
        changeOpacity() {
            //Bring up a dialog to change opacity
            let modalRoot = document.createElement('div');
            let addEl = function (opacityName, opacity) {
                let el = document.createElement('div');
                el.className = 'opacity-selector';
                el.innerHTML = opacityName;
                el.style.opacity = "" + opacity;
                el.addEventListener('click', function (opacity) {
                    this.controller.removeModal();
                    this.controller.currCanvas.changeOpacity(this.selectedLayout.component, opacity);
                    this.unselect();
                }.bind(this, opacity));
                modalRoot.appendChild(el);
            }.bind(this);
            addEl('faded', consts_1.default.fadedOpacity);
            addEl('normal', consts_1.default.normalOpacity);
            addEl('focused', consts_1.default.focusedOpacity);
            this.controller.modal(modalRoot);
        }
        /**
         * Unselect and display default content.
         */
        unselect() {
            this.selected = false;
            this.selectedLayout = undefined;
            this.element.classList.remove('selected');
            this.element.innerHTML = "";
            this.setDefaultContent();
        }
        /**
         * Whether the toolbar is displaying
         * content for a selected component.
         */
        isSelected() {
            return this.selected;
        }
    }
    exports.default = ToolBar;
});

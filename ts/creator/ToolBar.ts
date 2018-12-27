import Controller from "./main";
import LayoutState from '../animation/Frame';

export default class ToolBar {

    private element: HTMLElement;
    private controller: Controller;

    private selected: boolean = false;
    private selectedLayout: LayoutState;

    constructor(controller: Controller) {
        this.controller = controller;
        this.element = document.getElementById('top-row');
        this.setDefaultContent();
    }

    /**
     * Displays the default content on
     * the toolbar.
     */
    private setDefaultContent(): void {
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
    private delete(): void {
        this.controller.currCanvas.delete(this.selectedLayout);
        this.unselect();
    }

    /**
     * Select a component and display editable
     * aspects of it on the toolbar.
     * 
     * @param frame The frame to select.
     */
    select(frame: LayoutState) {
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
    }

    /**
     * Unselect and display default content.
     */
    unselect(): void {
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
    isSelected(): boolean {
        return this.selected;
    }
}
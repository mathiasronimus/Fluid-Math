import Controller from "./main";

export default class ContentPane {

    private controller: Controller;

    private element: HTMLElement = document.getElementById('right-centre');
    private containerEl: HTMLElement;

    private termEl: HTMLElement;
    private terms: string[] = [];

    private selected: HTMLElement;

    constructor(controller: Controller) {
        this.controller = controller;

        //Selection
        let select = document.createElement('div');
        select.innerHTML = 'Select';
        select.className = 'content';
        select.addEventListener('click', function() {
            //Select the clicked selection element
            this.select(select);
            //Tell the canvas to start selecting
            this.controller.currCanvas.select();
        }.bind(this));
        this.element.appendChild(select);

        //Containers
        let containerTitle = document.createElement('div');
        containerTitle.className = 'title';
        containerTitle.innerHTML = 'CONTENT';
        this.element.appendChild(containerTitle);

        this.containerEl = document.createElement('div');
        this.element.appendChild(this.containerEl);
        this.addContainers();

        //Terms
        let termTitle = document.createElement('div');
        termTitle.className = 'title';
        termTitle.innerHTML = 'TERM';
        this.element.appendChild(termTitle);

        this.termEl = document.createElement('div');
        this.element.appendChild(this.termEl);

        let addTerm = document.createElement('div');
        addTerm.innerHTML = "add";
        addTerm.className = "content material-icons";
        addTerm.addEventListener('click', this.addTerm.bind(this));
        this.element.appendChild(addTerm);
    }

    /**
     * Bring up a dialog to add a term.
     */
    private addTerm() {
        let termCont = document.createElement('div');

        let textBox: HTMLTextAreaElement = document.createElement('textarea');
        textBox.rows = 1;
        textBox.cols = 50;
        termCont.appendChild(textBox);
        
        function close() {
            this.newTerm(textBox.value);
            this.controller.removeModal();
            document.removeEventListener('keydown', onKey);
        };
        
        //Make enter mean OK too
        function onKey_(event) {
            if (event.key === 'Enter') {
                close.call(this);
            }
        };
        let onKey = onKey_.bind(this);
        document.addEventListener('keydown', onKey);
        
        let ok = this.controller.getOkButton(close.bind(this));
        termCont.appendChild(ok);
        
        this.controller.modal(termCont);
        textBox.focus();
    }
    
    //Add a new term
    private newTerm(text: string): void {
        let index = this.terms.length;
        this.terms[index] = text;

        let el = this.newTermEl(index);
        this.termEl.appendChild(el);
        this.select(el);
        this.controller.currCanvas.setAdding(index);
        this.controller.setDisplayCanvas(this.controller.currCanvas.getStepAsInstructions());
    }

    /**
     * Return a new term element
     * representing content with a 
     * particular index.
     * 
     * @param index The index.
     */
    private newTermEl(index: number): HTMLElement {
        let el = document.createElement('div');
        el.innerHTML = this.terms[index];
        el.className = 'content';
        el.addEventListener('click', function () {
            this.deselect();
            this.select(el);
            this.controller.currCanvas.setAdding(index);
        }.bind(this));
        return el;
    }

    /**
     * Unhighlight selectable content.
     */
    private deselect(): void {
        if (this.selected) {
            this.selected.classList.remove('selected');
            this.selected = undefined;
        }
    }

    /**
     * Select an element.
     * 
     * @param el The element to select.
     */
    private select(el: HTMLElement): void {
        this.deselect();
        this.selected = el;
        this.selected.classList.add('selected');
    }

    /**
     * Add elements to select the available
     * containers.
     */
    private addContainers(): void {

        let vbox = document.createElement('div');
        vbox.innerHTML = 'vbox';
        vbox.className = 'content';
        let addVbox = function () {
            this.controller.currCanvas.setAdding({
                type: 'vbox',
                children: [

                ]
            });
            this.deselect();
            this.select(vbox);
            vbox.classList.add('selected');
        }.bind(this);
        vbox.addEventListener('click', addVbox.bind(this));
        this.containerEl.appendChild(vbox);

        let hbox = document.createElement('div');
        hbox.innerHTML = 'hbox';
        hbox.className = 'content';
        let addHbox = function () {
            this.controller.currCanvas.setAdding({
                type: 'hbox',
                children: [

                ]
            });
            this.deselect();
            this.select(hbox)
        }.bind(this);
        hbox.addEventListener('click', addHbox);
        this.containerEl.appendChild(hbox);
    }

    /**
     * Update the elements to cause
     * adding of the correct content.
     * Called after removal of a piece
     * of content.
     */
    private refreshTerms() {
        this.termEl.innerHTML = "";
        for (let i = 0; i < this.terms.length; i++) {
            this.termEl.appendChild(this.newTermEl(i));
        }
    }

    /**
     * Delete the currently selected content.
     */
    delete() {
        if (this.selected === undefined) {
            throw "select content to delete";
        }
        if (this.selected.parentElement === this.element) {
            throw "can't delete that";
        }
        if (this.selected.parentElement === this.containerEl) {
            throw "can't delete that";
        }
        //Look through terms to see if selected is there
        let index = undefined;
        for (let i = 0; i < this.termEl.childElementCount; i++) {
            let currEl = this.termEl.children[i];
            if (currEl === this.selected) {
                index = i;
                break;
            }
        }

        //Remove element representing the content
        this.selected.parentElement.removeChild(this.selected);
        this.deselect();

        //Remove from array
        this.terms.splice(index, 1);
        this.refreshTerms();

        //Remove the content from all steps
        this.controller.slideManager.removeContent(index);
    }

    getTerms(): string[] {
        return this.terms;
    }

    /**
     * Add content information to
     * a JSON object for saving.
     * 
     * @param toJSON The JSON object.
     */
    addJSON(toJSON: Object): void {
        toJSON['terms'] = this.terms;
    }

    /**
     * Load the content pane from an
     * instructions object.
     * 
     * @param instructions The instructions object.
     */
    fromJSON(instructions: Object): void {
        this.selected = undefined;
        this.termEl.innerHTML = "";
        this.terms = instructions['terms'];
        
        let termEls = [];
        for (let i = 0; i < this.terms.length; i++) {
            termEls.push(this.newTermEl(i));
        }
        this.controller.fillEl(this.termEl, termEls);
    }
}
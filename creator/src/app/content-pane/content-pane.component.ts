import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { QueryList } from '@angular/core';

@Component({
  selector: 'app-content-pane',
  templateUrl: './content-pane.component.html',
  styleUrls: ['./content-pane.component.css']
})
export class ContentPaneComponent implements OnInit, AfterViewInit {

  containers: ContainerSelector[];

  addingTerm: boolean;
  lastTermAddText = '';
  terms: string[];
  @ViewChildren('termInput') termInputEl: QueryList<any>;

  hDividers = 0;

  selectedRef = '';

  constructor(private undoRedo: UndoRedoService) {
    this.containers = [
      new ContainerSelector('Horizontal'),
      new ContainerSelector('Vertical'),
      new ContainerSelector('Tight Horizontal'),
      new ContainerSelector('Exponent/Subscript')
    ];
    this.updateState = this.updateState.bind(this);
    undoRedo.subscribe(this.updateState);
    this.updateState(undoRedo.getState());
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Focus the term input whenever it appears
    this.termInputEl.changes.subscribe({
      next(ql) {
        if (ql.first) {
          ql.first.nativeElement.focus();
        }
      }
    });
  }

  /**
   * Turn the 'add term' button into
   * a text box to add a term.
   */
  addTerm() {
    this.addingTerm = true;
  }

  /**
   * Called when the keyboard is typed when adding a term.
   * @param e The event.
   */
  addTermTyped(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.finishAddingTerm();
      return;
    }
    this.lastTermAddText = (e.target as HTMLInputElement).value;
  }

  /**
   * Typing the term is finished, add it to the state.
   */
  finishAddingTerm() {
    if (!this.addingTerm) {
      // Caused by input being removed activating blur
      return;
    }
    const termText = this.lastTermAddText.trim();
    if (termText === '') {
      throw new Error('blank text not allowed');
    }
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.terms) {
      newState.terms = [];
    }
    newState.terms.push(termText);
    this.undoRedo.publishChange(newState);
    this.lastTermAddText = '';
    this.addingTerm = false;
  }

  /**
   * Get a string array for each hDivider. Used by the template.
   */
  getHDividerArray(): string[] {
    const toReturn: string[] = [];
    for (let i = 0; i < this.hDividers; i++) {
      toReturn.push('' + i);
    }
    return toReturn;
  }

  /**
   * Add a new hDivider.
   */
  addHDivider() {
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.hDividers) {
      newState.hDividers = 0;
    }
    newState.hDividers++;
    this.undoRedo.publishChange(newState);
  }

  /**
   * Select a container or some content.
   * @param ref The reference of the content.
   *            Here a 'c' prefix is used for containers, which isn't valid in the context of a canvas controller.
   * @param e The mouse event.
   */
  select(ref: string, e: MouseEvent) {
    this.selectedRef = ref;
    e.stopPropagation();
  }

  /**
   * Deselect whatever is selected.
   */
  deselect() {
    this.selectedRef = '';
  }

  /**
   * Delete the currently selected content.
   */
  delete() {
    console.log(this.selectedRef);
  }

  /**
   * Update the view when the state changes.
   * @param newState The new state.
   */
  updateState(newState: any) {
    this.terms = newState.terms ? newState.terms : [];
    this.hDividers = newState.hDividers ? newState.hDividers : 0;
  }
}

class ContainerSelector {
  name: string;
  constructor(name) {
    this.name = name;
  }
}

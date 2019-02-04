import { Component, OnInit, ViewChildren, AfterViewChecked, AfterViewInit } from '@angular/core';
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
  terms: TermSelector[];
  @ViewChildren('termInput') termInputEl: QueryList<any>;

  constructor(private undoRedo: UndoRedoService) {
    this.containers = [
      new ContainerSelector('Horizontal'),
      new ContainerSelector('Vertical'),
      new ContainerSelector('Tight Horizontal'),
      new ContainerSelector('Exponent/Subscript')
    ];
    this.terms = [];
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
    const termText = this.lastTermAddText.trim();
    if (termText === '') {
      throw new Error('blank text not allowed');
    }
    this.terms.push(new TermSelector(termText));
    this.lastTermAddText = '';
    this.addingTerm = false;
  }
}

class ContainerSelector {
  name: string;
  constructor(name) {
    this.name = name;
  }
}

class TermSelector {
  name: string;
  constructor(name) {
    this.name = name;
  }
}

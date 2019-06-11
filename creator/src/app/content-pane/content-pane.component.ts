import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { QueryList } from '@angular/core';
import { ContentSelectionService } from '../content-selection.service';
import { ErrorService } from '../error.service';
import { getMetrics } from '@shared/main/helpers';
import { ModalService } from '../modal.service';
import { TermTemplateComponent } from '../term-template/term-template.component';
import { TransitionOptionsFormat } from '@shared/main/FileFormat';

@Component({
  selector: 'app-content-pane',
  templateUrl: './content-pane.component.html',
  styleUrls: ['./content-pane.component.css']
})
export class ContentPaneComponent implements AfterViewInit {

  containers: string[];

  addingTerm: boolean;
  lastTermAddText = '';
  terms: string[];
  @ViewChildren('termInput') termInputEl: QueryList<any>;

  hDividers = 0;

  radicals = 0;

  dragging = false;

  constructor(private undoRedo: UndoRedoService,
              private selection: ContentSelectionService,
              private error: ErrorService,
              private modal: ModalService) {
    this.containers = [
      'Horizontal',
      'Vertical',
      'Tight Horizontal',
      'Root',
      'Exponent/Subscript'
    ];
    this.updateState = this.updateState.bind(this);
    undoRedo.subscribe(this.updateState);
    this.updateState(undoRedo.getState());
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
   * Get the help text that is displayed
   * on the top of the content pane.
   */
  getHelpText(): string {
    if (this.addingTerm) {
      return 'Press Enter to Add.';
    } else if (this.dragging) {
      return 'Drag to the Left to Add.';
    } else if (this.selection.adding !== undefined) {
      return 'Click on the Left to Add.';
    } else {
      return 'Click to Select.';
    }
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
      this.finishAddingTerm(true);
      return;
    }
    this.lastTermAddText = (e.target as HTMLInputElement).value;
  }

  /**
   * Typing the term is finished, add it to the state.
   * @param fromKey Whether this function is called as a result of a key press.
   */
  finishAddingTerm(fromKey: boolean) {
    if (!this.addingTerm) {
      // Caused by input being removed activating blur
      return;
    }
    const termText = this.lastTermAddText.trim();
    if (termText === '') {
      if (fromKey) {
        // User pressed enter to add, let them know invalid
        this.error.text = 'Blank terms are not allowed.';
        return;
      } else {
        // User pressed somewhere else, just cancel the adding.
        this.addingTerm = false;
        return;
      }
    }
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.terms) {
      newState.terms = [];
    }
    const newIndex = newState.terms.length;
    newState.terms.push(termText);
    newState.metrics = getMetrics(newState);
    this.undoRedo.publishChange(newState);
    this.lastTermAddText = '';
    this.addingTerm = false;
    this.select('t' + newIndex, undefined);
  }

  /**
   * Get a string array representing counting from 1
   * to a number.
   * @param countTo The number to count to.
   */
  getCountArray(countTo: number): string[] {
    const toReturn: string[] = [];
    for (let i = 0; i < countTo; i++) {
      toReturn.push('' + (i + 1));
    }
    return toReturn;
  }

  /**
   * Add a new hDivider.
   * @param e The mouse event.
   */
  addHDivider(e: MouseEvent) {
    e.stopPropagation();
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.hDividers) {
      newState.hDividers = 0;
    }
    const newIndex = newState.hDividers;
    this.select('h' + newIndex, undefined);
    newState.hDividers++;
    this.undoRedo.publishChange(newState);
  }

  /**
   * Add a new radical.
   * @param e The mouse event.
   */
  addRadical(e: MouseEvent) {
    e.stopPropagation();
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.radicals) {
      newState.radicals = 0;
    }
    const newIndex = newState.radicals;
    this.select('r' + newIndex, undefined);
    newState.radicals++;
    this.undoRedo.publishChange(newState);
  }

  /**
   * Select a container or some content.
   * @param ref The reference of the content.
   *            Here a 'c' prefix is used for containers, which isn't valid in the context of a canvas controller.
   * @param e The mouse event.
   */
  select(ref: string, e: MouseEvent) {
    this.setAdding(ref);
    if (e) {
      e.stopPropagation();
    }
  }

  /**
   * Deselect whatever is selected.
   */
  deselect() {
    this.selection.adding = undefined;
    this.selection.selectedOnCanvas = undefined;
  }

  setAdding(toAdd: string) {
    this.selection.adding = toAdd;
  }

  /**
   * Delete the currently selected content.
   * @param e The Mouse event.
   */
  delete(e: MouseEvent) {
    e.stopPropagation();
    const newState = this.undoRedo.getStateClone();
    // We know it's a string, delete button only shows up for content
    const ref = this.selection.adding as string;
    const type = ref.charAt(0);
    const index = parseInt(ref.substring(1, ref.length), 10);
    switch (type) {
      case 't':
        newState.terms.splice(index, 1);
        break;
      case 'h':
        newState.hDividers--;
        break;
      case 'r':
        newState.radicals--;
        break;
      default:
        throw new Error('Undefined content type.');
    }

    // We've just removed the content from the arrays,
    // so now any reference to content later in the
    // array will be incorrect.

    // Recursively look for any numbers in the step hierarchy
    if (newState.steps) {
      newState.steps.forEach(step => {
        recursiveRemove(step.root);
        if (step.color) {
          removeDeletedKeys(step.color);
        }
        if (step.opacity) {
          removeDeletedKeys(step.opacity);
        }
      });
    }

    // Remove the object from step options
    if (newState.stepOpts) {
      Object.keys(newState.stepOpts).forEach(stepNum => {
        const stepOpts: TransitionOptionsFormat = newState.stepOpts[stepNum];
        if (stepOpts.clones) {
          stepOpts.clones = removeDeletedKeysOrValues(stepOpts.clones) as { [ref: string]: string};
        }
        if (stepOpts.evals) {
          stepOpts.evals = removeDeletedKeysOrValues(stepOpts.evals) as { [ref: string]: string};
        }
        if (stepOpts.merges) {
          stepOpts.merges = removeDeletedKeysOrValues(stepOpts.merges) as { [ref: string]: string};
        }
      });
    }

    this.deselect();
    newState.metrics = getMetrics(newState);
    this.undoRedo.publishChange(newState);

    // Looks through the keys of an object to
    // find deleted references.
    function removeDeletedKeys(deleteIn: object) {
      Object.keys(deleteIn).forEach(key => {
        const val = deleteIn[key];
        if (key.charAt(0) === type) {
          // Same content type
          const keyIndex = parseFloat(key.substring(1, key.length));
          if (keyIndex === index) {
            // Reference to deleted content, delete it
            delete deleteIn[key];
          } else if (keyIndex > index) {
            // Deletion affected array, shift this key index down
            const newKey = key.charAt(0) + (keyIndex - 1);
            delete deleteIn[key];
            deleteIn[newKey] = val;
          }
        }
      });
    }

    // Look through an object, removing the deleted reference
    // whether it's in a key or value, moving others down into
    // the removed space. Return the new object.
    function removeDeletedKeysOrValues(deleteIn: object): object {
      const toReturn = {};
      // Transform to an array of arrays for easier processing
      const asArray: [string, any][] = Object.keys(deleteIn).map(key => [key, deleteIn[key]]);
      // Find deleted values or ones that need to be shifted
      asArray.forEach(keyValuePair => {
        // Seperate key and value into their parts
        let key = keyValuePair[0];
        let value = keyValuePair[1];
        const keyType = key.charAt(0);
        const valType = key.charAt(0);
        const keyIndex = parseInt(key.substring(1, key.length), 10);
        const valIndex = parseInt(value.substring(1, value.length), 10);
        if (key === ref || value === ref) {
          // Do nothing, doesn't get transferred to new object
          return;
        }
        // Check if key needs to be moved down
        if (keyType === type && keyIndex > index) {
          key = keyType + (keyIndex - 1);
        }
        // Check if value needs to be moved down
        if (valType === type && valIndex > index) {
          value = valType + (valIndex - 1);
        }
        // Add to the new object
        toReturn[key] = value;
      });
      return toReturn;
    }

    // Looks through an objects properties to
    // remove a certain index.
    function recursiveRemove(lookIn: object) {
      Object.keys(lookIn).forEach(key => {
        const value = lookIn[key];
        if (typeof value === 'object') {
          recursiveRemove(value);
          if (Array.isArray(value)) {
            /* Treating the array like an object
               leaves empty values. Clear these
               out. */
            lookIn[key] = value.filter(el => el !== null);
          }
        } else if (typeof value === 'string') {
          // If > index, decrement to account for
          // shifting in array, otherwise remove
          if (value.charAt(0) === type) {
            // Value refers to same content type
            const valIndex: number = parseFloat(value.substring(1, value.length));
            if (valIndex === index) {
              delete lookIn[key];
            } else if (valIndex > index) {
              lookIn[key] = value.charAt(0) + (valIndex - 1);
            }
          }
        }
      });
    }

  }

  /**
   * Show the term template with commonly used
   * text.
   */
  showTermTemplate() {
    this.modal.show(TermTemplateComponent);
  }

  /**
   * Update the view when the state changes.
   * @param newState The new state.
   */
  updateState(newState: any) {
    this.terms = newState.terms ? newState.terms : [];
    this.hDividers = newState.hDividers ? newState.hDividers : 0;
    this.radicals = newState.radicals ? newState.radicals : 0;
    this.addingTerm = false;
  }
}

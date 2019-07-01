import { Component, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { QueryList } from '@angular/core';
import { ContentSelectionService } from '../content-selection.service';
import { ErrorService } from '../error.service';
import { getMetrics } from '@shared/main/helpers';
import { ModalService } from '../modal.service';
import { TermTemplateComponent } from '../term-template/term-template.component';
import {
  TransitionOptionsFormat,
  ContainerFormat,
  LinearContainerFormat,
  SubSuperContainerFormat,
  QuizFormat,
  RootContainerFormat,
  TableFormat
} from '@shared/main/FileFormat';
import { deepClone } from '../helpers';

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
  vDividers = 0;

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
      'Exponent/Subscript',
      'Quiz',
      'Table'
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
   * Add a new vDivider.
   * @param e The mouse event.
   */
  addVDivider(e: MouseEvent) {
    e.stopPropagation();
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.vDividers) {
      newState.vDividers = 0;
    }
    const newIndex = newState.vDividers;
    this.select('v' + newIndex, undefined);
    newState.vDividers++;
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
      case 'v':
        newState.vDividers--;
        break;
      default:
        throw new Error('Undefined content type.');
    }

    // We've just removed the content from the arrays,
    // so now any reference to content later in the
    // array will be incorrect.
    if (newState.steps) {
      newState.steps.forEach(step => {
        removeAndShiftContent(step.root);
        // Color info also invalidated
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

    // For a container/content hierarchy, remove any reference
    // to the content being removed, and shift other content
    // so it still refers to the same thing.
    function removeAndShiftContent(container: ContainerFormat) {
      if (container.type === 'hbox' || container.type === 'vbox' || container.type === 'tightHBox') {
        const cont = container as LinearContainerFormat;
        removeOrShiftValues(cont.children, false);
        // Doing this leaves 'holes' in the array, get rid of them:
        cont.children = cont.children.filter(child => child !== null);

      } else if (container.type === 'subSuper') {
        const cont = container as SubSuperContainerFormat;
        // Just recursively check the three components
        removeAndShiftContent({type: 'hbox', children: cont.top} as ContainerFormat);
        removeAndShiftContent({type: 'hbox', children: cont.middle} as ContainerFormat);
        removeAndShiftContent({type: 'hbox', children: cont.bottom} as ContainerFormat);

      } else if (container.type === 'quiz') {
        const cont = container as QuizFormat;
        // Just like a vbox, but answers is no longer valid:
        cont.answers = [];
        removeAndShiftContent({type: 'hbox', children: cont.children} as ContainerFormat);

      } else if (container.type === 'root') {
        const cont = container as RootContainerFormat;
        // Check radical
        if (ref === cont.rad) {
          delete cont.rad;
        } else if (type === 'r') {
          // Check if need to shift radical down
          const radIndex = parseInt(cont.rad.substring(1, cont.rad.length), 10);
          if (radIndex > index) {
            cont.rad = 'r' + (radIndex - 1);
          }
        }

      } else if (container.type === 'table') {
        const cont = container as TableFormat;
        // Remove/shift lines
        removeOrShiftValues(cont.hLines, false);
        removeOrShiftValues(cont.vLines, false);
        // Remove/shift child array
        // tslint:disable-next-line:prefer-for-of
        for (let r = 0; r < cont.children.length; r++) {
          removeOrShiftValues(cont.children[r], true);
        }
      }
    }

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

    // Delete the ref or shift down when necessary,
    // looking in the keys of an object.
    function removeOrShiftValues(lookIn: object, leaveNull: boolean) {
      // Treat array as key/val pair
      Object.keys(lookIn).forEach(childNum => {
        const child = lookIn[childNum];
        if (typeof child === 'string') {
          // Is content, could be what we deleted
          const childType = child.charAt(0);
          const childIndex = parseInt(child.substring(1, child.length), 10);
          if (child === ref) {
            // Is what we deleted
            if (leaveNull) {
              lookIn[childNum] = null;
            } else {
              delete lookIn[childNum];
            }
          } else if (childType === type) {
            // Is same type of content
            if (childIndex > index) {
              // Is above in array, need to shift down
              lookIn[childNum] = childType + (childIndex - 1);
            }
          }
        } else if (typeof child === 'object' && child !== null) {
          // Is object, recursively check
          removeAndShiftContent(child as ContainerFormat);
        }
      });
    }

    // Look through an object, removing the deleted reference
    // whether it's in a key or value, moving others down into
    // the removed space. Return the new object.
    function removeDeletedKeysOrValues(deleteIn: object): object {
      const toReturn = {};
      // Transform to an array of arrays for easier processing
      const asArray = Object.keys(deleteIn).map(key => [key, deleteIn[key]]);
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
    this.vDividers = newState.vDividers ? newState.vDividers : 0;
    this.radicals = newState.radicals ? newState.radicals : 0;
    this.addingTerm = false;
  }
}

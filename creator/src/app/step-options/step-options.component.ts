import { Component, OnInit, Directive, AfterViewInit, Input, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';
import { deepClone, inLayout } from '../helpers';
import { QueryList } from '@angular/core';
import SelectableCanvasController from './SelectableCanvasController';
import CanvasController from '@shared/main/CanvasController';
import { ErrorService } from '../error.service';
import { ModalService } from '../modal.service';

@Directive({
  selector: '[appCloneContainer]'
})
export class CloneContainerDirective {
  @Input() index: number;
  constructor(public el: ElementRef) {}
}

@Directive({
  selector: '[appMergeContainer]'
})
export class MergeContainerDirective {
  @Input() index: number;
  constructor(public el: ElementRef) {}
}

@Directive({
  selector: '[appEvalContainer]'
})
export class EvalContainerDirective {
  @Input() index: number;
  constructor(public el: ElementRef) {}
}

@Component({
  selector: 'app-step-options',
  templateUrl: './step-options.component.html',
  styleUrls: ['./step-options.component.css']
})
export class StepOptionsComponent implements AfterViewInit {

  cloneToFrom: [string, string][] = [];
  @ViewChildren(CloneContainerDirective)
  cloneContainers: QueryList<CloneContainerDirective>;
  showingClones = false;

  mergeFromTo: [string, string][] = [];
  @ViewChildren(MergeContainerDirective)
  mergeContainers: QueryList<MergeContainerDirective>;
  showingMerges = false;

  evalFromTo: [string, string][] = [];
  @ViewChildren(EvalContainerDirective)
  evalContainers: QueryList<EvalContainerDirective>;
  showingEvals = false;

  // Instructions objects used to load the
  // selection canvases. These contain the
  // layout for just one step.
  currStepContentInstructions;
  currStepText: string;
  nextStepContentInstructions;
  nextStepText: string;

  @ViewChild('previewContainer')
  previewEl: ElementRef;

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private error: ErrorService,
              private modal: ModalService) {
    // Bindings
    this.updateCloneFrom = this.updateCloneFrom.bind(this);
    this.updateCloneTo = this.updateCloneTo.bind(this);
    this.cloneToValid = this.cloneToValid.bind(this);
    this.updateMergeFrom = this.updateMergeFrom.bind(this);
    this.mergeFromValid = this.mergeFromValid.bind(this);
    this.updateMergeTo = this.updateMergeTo.bind(this);
    this.updateEvalFrom = this.updateEvalFrom.bind(this);
    this.evalFromValid = this.evalFromValid.bind(this);
    this.updateEvalTo = this.updateEvalTo.bind(this);

    const currState: any = undoRedo.getState();
    if (currState.stepOpts && currState.stepOpts[step.selected]) {
      // Options already exist for this transition, load them.
      const stepOpts = currState.stepOpts[step.selected];
      // Load clones
      if (stepOpts.clones) {
        Object.keys(stepOpts.clones).forEach((toRef: string) => {
          const fromRef: string = stepOpts.clones[toRef];
          this.cloneToFrom.push([toRef, fromRef]);
        });
      }
      // Load merges
      if (stepOpts.merges) {
        Object.keys(stepOpts.merges).forEach((fromRef: string) => {
          const toRef = stepOpts.merges[fromRef];
          this.mergeFromTo.push([fromRef, toRef]);
        });
      }
      // Load evals
      if (stepOpts.evals) {
        Object.keys(stepOpts.evals).forEach((fromRef: string) => {
          const toRef = stepOpts.evals[fromRef];
          this.evalFromTo.push([fromRef, toRef]);
        });
      }
    }

    // Extract current and next steps
    const currStep = deepClone(currState.steps[step.selected]);
    this.currStepContentInstructions = deepClone(currState);
    this.currStepContentInstructions.steps = [currStep];
    this.currStepText = this.currStepContentInstructions.steps[0].text;
    delete this.currStepContentInstructions.steps[0].text;

    const nextStep = deepClone(currState.steps[step.selected + 1]);
    this.nextStepContentInstructions = deepClone(currState);
    this.nextStepContentInstructions.steps = [nextStep];
    this.nextStepText = this.nextStepContentInstructions.steps[0].text;
    delete this.nextStepContentInstructions.steps[0].text;
  }

  /**
   * Fills the eq containers with the right
   * content to display.
   */
  updateContainers() {
    this.updateCloneContainers();
    this.updateMergeContainers();
    this.updateEvalContainers();
    this.updatePreview();
  }

  /**
   * Fill clone containers with content.
   */
  updateCloneContainers() {
    // Create clone containers
    let i = 0;
    this.cloneContainers.forEach(cloneContainer => {
      cloneContainer.el.nativeElement.innerHTML = '';
      const cloneToFromIndex = Math.floor(i / 2);
      const from = i % 2 === 0;
      if (from) {
        // Show current step
        const canv = new SelectableCanvasController(
          cloneContainer.el.nativeElement,
          this.currStepContentInstructions,
          this.cloneToFrom[cloneToFromIndex][1],
          cloneToFromIndex,
          this.updateCloneFrom,
          () => {}
        );
      } else {
        // Show next step
        const canv = new SelectableCanvasController(
          cloneContainer.el.nativeElement,
          this.nextStepContentInstructions,
          this.cloneToFrom[cloneToFromIndex][0],
          cloneToFromIndex,
          this.updateCloneTo,
          this.cloneToValid
        );
      }
      i++;
    });
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the clone.
   */
  updateCloneFrom(newRef: string, index: number) {
    this.cloneToFrom[index][1] = newRef;
    this.updatePreview();
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the clone.
   */
  updateCloneTo(newRef: string, index: number) {
    this.cloneToFrom[index][0] = newRef;
    this.updatePreview();
  }

  /**
   * Throws if a ref can't be selected.
   * @param newRef The reference of the new selection.
   * @param index The index of the clone.
   */
  cloneToValid(newRef: string, index: number) {
    // A clone to is valid if:
    // 1. It does not exist on the first step.
    // 2. There isn't already a transition defined.
    if (newRef === '') {
      // Blank always valid
      return;
    }
    if (inLayout(this.currStepContentInstructions.steps[0].root, newRef)) {
      this.error.text = 'Content to clone to must not exist beforehand.';
      throw new Error();
    }
    this.cloneToFrom.forEach(cloneToFrom => {
      if (cloneToFrom[0] === newRef) {
        this.error.text = 'Content can only be cloned from one place.';
        throw new Error();
      }
    });
  }

  /**
   * Add a new clone.
   */
  addClone(e: MouseEvent) {
    e.stopPropagation();
    this.cloneToFrom.unshift(['', '']);
    this.showingClones = true;
  }

  /**
   * Remove a clone.
   * @param idx The index of the clone to remove.
   */
  removeClone(idx: number) {
    this.cloneToFrom.splice(idx, 1);
  }

  /**
   * Fill merge containers with content.
   */
  updateMergeContainers() {
    // Create merge containers
    let i = 0;
    this.mergeContainers.forEach(mergeContainer => {
      mergeContainer.el.nativeElement.innerHTML = '';
      const mergeFromToIndex = Math.floor(i / 2);
      const from = i % 2 === 0;
      if (from) {
        // Show current step
        const canv = new SelectableCanvasController(
          mergeContainer.el.nativeElement,
          this.currStepContentInstructions,
          this.mergeFromTo[mergeFromToIndex][0],
          mergeFromToIndex,
          this.updateMergeFrom,
          this.mergeFromValid
        );
      } else {
        // Show next step
        const canv = new SelectableCanvasController(
          mergeContainer.el.nativeElement,
          this.nextStepContentInstructions,
          this.mergeFromTo[mergeFromToIndex][1],
          mergeFromToIndex,
          this.updateMergeTo,
          () => {}
        );
      }
      i++;
    });
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the merge.
   */
  updateMergeFrom(newRef: string, index: number) {
    this.mergeFromTo[index][0] = newRef;
    this.updatePreview();
  }

  /**
   * Throws if a ref can't be selected.
   * @param newRef The new ref.
   * @param index The index of the merge.
   */
  mergeFromValid(newRef: string, index: number) {
    // A merge from is valid if:
    // 1. It does not exist afterward.
    // 2. There isn't already a transition defined for it.
    if (newRef === '') {
      // Blank always valid
      return;
    }
    if (inLayout(this.nextStepContentInstructions.steps[0].root, newRef)) {
      this.error.text = 'Content to merge from must not exist afterward.';
      throw new Error();
    }
    this.mergeFromTo.forEach(mergeFromTo => {
      if (mergeFromTo[0] === newRef) {
        this.error.text = 'Content can only be merged to one place.';
        throw new Error();
      }
    });
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the merge.
   */
  updateMergeTo(newRef: string, index: number) {
    this.mergeFromTo[index][1] = newRef;
    this.updatePreview();
  }

  /**
   * Add a new merge.
   */
  addMerge(e: MouseEvent) {
    e.stopPropagation();
    this.mergeFromTo.unshift(['', '']);
    this.showingMerges = true;
  }

  /**
   * Remove a merge.
   * @param idx The index of the merge.
   */
  removeMerge(idx: number) {
    this.mergeFromTo.splice(idx, 1);
  }

  /**
   * Fill eval containers with content.
   */
  updateEvalContainers() {
    // Create eval containers
    let i = 0;
    this.evalContainers.forEach(evalContainer => {
      evalContainer.el.nativeElement.innerHTML = '';
      const evalFromToIndex = Math.floor(i / 2);
      const from = i % 2 === 0;
      if (from) {
        // Show current step
        const canv = new SelectableCanvasController(
          evalContainer.el.nativeElement,
          this.currStepContentInstructions,
          this.evalFromTo[evalFromToIndex][0],
          evalFromToIndex,
          this.updateEvalFrom,
          this.evalFromValid
        );
      } else {
        // Show next step
        const canv = new SelectableCanvasController(
          evalContainer.el.nativeElement,
          this.nextStepContentInstructions,
          this.evalFromTo[evalFromToIndex][1],
          evalFromToIndex,
          this.updateEvalTo,
          () => {}
        );
      }
      i++;
    });
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the eval.
   */
  updateEvalFrom(newRef: string, index: number) {
    this.evalFromTo[index][0] = newRef;
    this.updatePreview();
  }

  /**
   * Throws if a ref can't be selected.
   * @param newRef The new ref.
   * @param index The index of the eval.
   */
  evalFromValid(newRef: string, index: number) {
    // An eval from is valid if:
    // 1. It does not exist afterward.
    // 2. There isn't already a transition defined for it.
    if (newRef === '') {
      // Blank always valid
      return;
    }
    if (inLayout(this.nextStepContentInstructions.steps[0].root, newRef)) {
      this.error.text = 'Content to evaluate must not exist afterward.';
      throw new Error();
    }
    this.evalFromTo.forEach(evalFromTo => {
      if (evalFromTo[0] === newRef) {
        this.error.text = 'Content can only evaluate to one thing.';
        throw new Error();
      }
    });
  }

  /**
   * Update the model with a new selection.
   * @param newRef The reference of the new selection.
   * @param index The index of the eval.
   */
  updateEvalTo(newRef: string, index: number) {
    this.evalFromTo[index][1] = newRef;
    this.updatePreview();
  }

  /**
   * Add a new evaluation.
   */
  addEval(e: MouseEvent) {
    e.stopPropagation();
    this.evalFromTo.unshift(['', '']);
    this.showingEvals = true;
  }

  /**
   * Remove an eval.
   * @param idx The index of the eval.
   */
  removeEval(idx: number) {
    this.evalFromTo.splice(idx, 1);
  }

  /**
   * Update the preview of the step transition.
   */
  updatePreview() {
    this.previewEl.nativeElement.innerHTML = '';
    const instructions: any = this.undoRedo.getStateClone();

    const stepOne: any = deepClone(this.currStepContentInstructions.steps[0]);
    stepOne.text = this.currStepText;

    const stepTwo: any = deepClone(this.nextStepContentInstructions.steps[0]);
    stepTwo.text = this.nextStepText;

    instructions.steps = [stepOne, stepTwo];
    instructions.stepOpts = {
      0: this.getFinalStepOption()
    };

    const canv = new CanvasController(this.previewEl.nativeElement, instructions);
  }

  /**
   * Compile the clones, merges, and evals
   * into a step options object as used in
   * instructions.
   */
  getFinalStepOption(): any {
    const toReturn: any = {};
    // Add clones
    this.cloneToFrom.forEach(cloneToFrom => {
      const toRef = cloneToFrom[0];
      const fromRef = cloneToFrom[1];
      if (toRef === '' || fromRef === '') {
        // Ignore empty string representing unselected.
        return;
      }
      if (!toReturn.clones) {
        toReturn.clones = {};
      }
      toReturn.clones[toRef] = fromRef;
    });
    // Add merges
    this.mergeFromTo.forEach(mergeFromTo => {
      const toRef = mergeFromTo[1];
      const fromRef = mergeFromTo[0];
      if (toRef === '' || fromRef === '') {
        // Ignore empty string representing unselected.
        return;
      }
      if (!toReturn.merges) {
        toReturn.merges = {};
      }
      toReturn.merges[fromRef] = toRef;
    });
    // Add evals
    this.evalFromTo.forEach(evalFromTo => {
      const toRef = evalFromTo[1];
      const fromRef = evalFromTo[0];
      if (toRef === '' || fromRef === '') {
        // Ignore empty string representing unselected.
        return;
      }
      if (!toReturn.evals) {
        toReturn.evals = {};
      }
      toReturn.evals[fromRef] = toRef;
    });

    return toReturn;
  }

  /**
   * Apply the changes that have been made.
   */
  apply() {
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.stepOpts) {
      newState.stepOpts = {};
    }
    newState.stepOpts[this.step.selected] = this.getFinalStepOption();
    this.undoRedo.publishChange(newState);
    this.modal.remove();
  }

  ngAfterViewInit() {
    this.updateContainers();
    this.updatePreview();

    this.cloneContainers.changes.subscribe(() => {
      this.updateCloneContainers();
      this.updatePreview();
    });
    this.mergeContainers.changes.subscribe(() => {
      this.updateMergeContainers();
      this.updatePreview();
    });
    this.evalContainers.changes.subscribe(() => {
      this.updateEvalContainers();
      this.updatePreview();
    });
  }

}

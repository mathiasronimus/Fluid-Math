import { Component, ViewChildren, QueryList, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import RendererCanvasController from './RendererCanvasController';
import { deepClone } from '../helpers';
import { SelectedStepService } from '../selected-step.service';
import { ModalService } from '../modal.service';
import { StepOptionsComponent } from '../step-options/step-options.component';
import { FileFormat, StepFormat } from '@shared/main/FileFormat';

const scrollXAmount = 200;

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.css']
})
export class StepsComponent implements AfterViewInit {

  Arr = Array;

  numSteps = 0;
  thumbnails: HTMLCanvasElement[];
  showThumbnail: boolean[];

  readonly stepWidth = 100;
  readonly stepHeight = 100;

  @ViewChildren('canvas')
  canvasEls: QueryList<ElementRef>;

  @ViewChild('scrollContainer')
  scrollContainer: ElementRef;

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private modal: ModalService) {
    undoRedo.subscribe(this.stateChange.bind(this));
    setTimeout(() => {
      this.stateChange(this.undoRedo.getState());
    }, 1);
  }

  /**
   * Update the image data for the thumbnails
   * on steps.
   * @param instructions The full instructions object to render with.
   */
  private updateThumbnails(instructions) {
    const renderer = new RendererCanvasController(instructions, this.stepWidth, this.stepHeight);
    this.thumbnails = renderer.render();
  }

  /**
   * Called when the state changes.
   * @param newState The new full state.
   */
  stateChange(newState: FileFormat) {
    this.numSteps = newState.steps.length;
    this.showThumbnail = Array(this.numSteps).fill(false);
    this.updateThumbnails(newState);
    this.redrawThumbnails();
  }

  /**
   * Redraw the thumbnails.
   */
  redrawThumbnails() {
    if (!this.canvasEls) {
      return;
    }
    this.canvasEls
      .map(el => [el.nativeElement, el.nativeElement.getContext('2d')])
      .forEach((canv: [HTMLCanvasElement, CanvasRenderingContext2D], idx: number) => {
        // Workaround: thumbnails may refresh before the view,
        // in which case there will be canvases without corresponding
        // thumbnails. This happens when the amount of steps reduces.
        if (!this.thumbnails[idx]) {
          return;
        }
        this.setCtxScale(canv[0], canv[1]);
        canv[1].clearRect(0, 0, this.stepWidth, this.stepHeight);
        canv[1].drawImage(this.thumbnails[idx], 0, 0, this.stepWidth, this.stepHeight);
      });
  }

  /**
   * Set the scaling of a canvas to fit a
   * thumbnail.
   * @param canvas The canvas.
   * @param ctx The context of the canvas.
   */
  setCtxScale(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    canvas.style.width = this.stepWidth + 'px';
    canvas.style.height = this.stepHeight + 'px';
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = this.stepWidth * pixelRatio;
    canvas.height = this.stepHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
  }

  ngAfterViewInit() {
    this.canvasEls.changes.subscribe(() => {
      this.redrawThumbnails();
    });
  }

  /**
   * Add a new slide after the selected one.
   */
  add() {
    const newState = this.undoRedo.getStateClone();
    const addIndex = this.step.selected + 1;
    const newStep = deepClone(newState.steps[this.step.selected]) as StepFormat;
    newState.steps.splice(addIndex, 0, newStep);
    // Step options from current step to next now invalid,
    // others above this need to be moved up.
    if (newState.stepOpts) {
      delete newState.stepOpts[addIndex - 1];
      for (let i = newState.steps.length - 2; i >= addIndex + 1; i--) {
        newState.stepOpts[i] = newState.stepOpts[i - 1];
      }
    }
    // Delays need to be updated too. Copy the delay from
    // current to added step, move the others up one.
    if (newState.autoplay && newState.autoplay.delays) {
      for (let i = newState.steps.length - 1; i >= addIndex; i--) {
        newState.autoplay.delays[i] = newState.autoplay.delays[i - 1];
      }
    }
    this.undoRedo.publishChange(newState);
    this.step.selected = addIndex;
  }

  /**
   * Delete the currently selected step.
   */
  delete() {
    if (!this.deleteAvailable()) {
      return;
    }
    const newState = this.undoRedo.getStateClone();
    newState.steps.splice(this.step.selected, 1);
    // Remove associated step options
    if (newState.stepOpts) {
      delete newState.stepOpts[this.step.selected - 1];
      delete newState.stepOpts[this.step.selected];
    }
    // Step options for other steps are now invalid,
    // need to be moved down
    for (let i = this.step.selected + 1; i < newState.steps.length; i++) {
      newState.stepOpts[i - 1] = newState.stepOpts[i];
    }
    // If applicable, delays are invalid as well
    if (newState.autoplay && newState.autoplay.delays) {
      // Need different behavior for deleting last step:
      // need to preserve the delay of the deleted step,
      // as it is the delay before ending the animation.
      const startIndex = this.step.selected === newState.steps.length ? this.step.selected - 1 : this.step.selected;
      for (let i = startIndex; i <= newState.steps.length; i++) {
        newState.autoplay.delays[i] = newState.autoplay.delays[i + 1];
      }
    }
    if (this.step.selected !== 0) {
      this.step.selected--;
    }
    this.undoRedo.publishChange(newState);
  }

  /**
   * Select a step by its index.
   * @param newIdx The index of the step.
   */
  select(newIdx: number) {
    this.step.selected = newIdx;
  }

  /**
   * Whether the selected step can be deleted.
   */
  deleteAvailable(): boolean {
    return this.numSteps > 1;
  }

  /**
   * Whether step options can be edited for
   * the selected step.
   */
  stepOptionsAvailable(): boolean {
    return this.numSteps > 1 && this.step.selected < this.numSteps - 1;
  }

  /**
   * Show a step options modal.
   */
  showStepOptions(): void {
    if (!this.stepOptionsAvailable()) {
      return;
    }
    this.modal.show(StepOptionsComponent);
  }

  /**
   * Scroll the steps left some amount.
   */
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollLeft -= scrollXAmount;
  }

  /**
   * Scroll the steps right some amount.
   */
  scrollRight() {
    this.scrollContainer.nativeElement.scrollLeft += scrollXAmount;
  }
}

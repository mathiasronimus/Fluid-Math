import { Component, ViewChildren, QueryList, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import RendererCanvasController from './RendererCanvasController';
import { deepClone } from '../helpers';
import { SelectedStepService } from '../selected-step.service';

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

  constructor(private undoRedo: UndoRedoService, private step: SelectedStepService) {
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
  stateChange(newState) {
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
    const newState: any = this.undoRedo.getStateClone();
    const addIndex = this.step.selected + 1;
    const newStep = deepClone(newState.steps[this.step.selected]);
    newState.steps.splice(addIndex, 0, newStep);
    this.undoRedo.publishChange(newState);
    this.step.selected = addIndex;
  }

  /**
   * Delete the currently selected step.
   */
  delete() {
    const newState: any = this.undoRedo.getStateClone();
    newState.steps.splice(this.step.selected, 1);
    // Remove associated step options
    if (newState.stepOpts) {
      delete newState.stepOpts[this.step.selected - 1];
      delete newState.stepOpts[this.step.selected];
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
}

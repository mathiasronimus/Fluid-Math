import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import CreatorCanvasController from './CreatorCanvasController';
import { ContentSelectionService } from '../content-selection.service';
import { SelectedStepService } from '../selected-step.service';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-central-area',
  templateUrl: './central-area.component.html',
  styleUrls: ['./central-area.component.css']
})
export class CentralAreaComponent implements OnInit, AfterViewInit {

  @ViewChild('eqContainer')
  containerEl: ElementRef;

  controller: CreatorCanvasController;

  constructor(private undoRedo: UndoRedoService,
              private selection: ContentSelectionService,
              private step: SelectedStepService,
              private error: ErrorService) {
    this.undoRedo.subscribe(this.updateState.bind(this));
    this.step.subscribe(newStep => {
      this.controller.showStep(newStep);
    });
    this.selection.addAddListener(() => {
      this.controller.redraw();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.updateState(this.undoRedo.getState());
  }

  /**
   * Update the canvas when the state changes.
   * @param newState The new state to show.
   */
  updateState(newState: any) {
    const scrollBefore = this.containerEl.nativeElement.scrollTop;
    this.containerEl.nativeElement.innerHTML = '';
    this.selection.resetSelectedOnCanvasListeners();
    this.controller = new CreatorCanvasController(
      this.containerEl.nativeElement,
      newState,
      this.undoRedo,
      this.selection,
      this.step,
      this.error
    );
    this.containerEl.nativeElement.scrollTop = scrollBefore;
  }

}

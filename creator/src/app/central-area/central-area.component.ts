import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import CreatorCanvasController from './CreatorCanvasController';
import { ContentSelectionService } from '../content-selection.service';

@Component({
  selector: 'app-central-area',
  templateUrl: './central-area.component.html',
  styleUrls: ['./central-area.component.css']
})
export class CentralAreaComponent implements OnInit, AfterViewInit {

  @ViewChild('outer') containerEl: ElementRef;

  controller: CreatorCanvasController;

  constructor(private undoRedo: UndoRedoService, private selection: ContentSelectionService) {
    this.undoRedo.subscribe(this.updateState.bind(this));
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
    this.selection.resetAddListeners();
    this.controller = new CreatorCanvasController(this.containerEl.nativeElement, newState, 0, this.undoRedo, this.selection);
    this.containerEl.nativeElement.scrollTop = scrollBefore;
  }

}

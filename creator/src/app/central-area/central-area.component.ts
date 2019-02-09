import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import CreatorCanvasController from './CreatorCanvasController';

@Component({
  selector: 'app-central-area',
  templateUrl: './central-area.component.html',
  styleUrls: ['./central-area.component.css']
})
export class CentralAreaComponent implements OnInit, AfterViewInit {

  @ViewChild('outer') containerEl: ElementRef;

  controller: CreatorCanvasController;

  constructor(private undoRedo: UndoRedoService) {
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
    this.containerEl.nativeElement.innerHTML = '';
    this.controller = new CreatorCanvasController(this.containerEl.nativeElement, newState, 0, this.undoRedo);
  }

}

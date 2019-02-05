import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import CreatorCanvasController from './CreatorCanvasController';

@Component({
  selector: 'app-central-area',
  templateUrl: './central-area.component.html',
  styleUrls: ['./central-area.component.css']
})
export class CentralAreaComponent implements OnInit {

  @ViewChild('outer') containerEl: ElementRef;

  constructor(private undoRedo: UndoRedoService) {
    this.undoRedo.subscribe(this.updateState);
    this.updateState(undoRedo.getState());
  }

  ngOnInit() {
  }

  /**
   * Update the canvas when the state changes.
   * @param newState The new state to show.
   */
  updateState(newState: any) {
  }

}

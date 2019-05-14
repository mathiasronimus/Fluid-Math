import { Injectable } from '@angular/core';
import { UndoRedoService } from './undo-redo.service';
import { FileFormat } from '@shared/main/FileFormat';

@Injectable({
  providedIn: 'root'
})
export class SelectedStepService {

  private selectedVar = 0;

  private subscribers: ((newSelected: number) => void)[] = [];

  constructor(private undoRedo: UndoRedoService) {
    undoRedo.subscribe((newState: FileFormat) => {
      // If state changes, selected step may need to change.
      if (this.selected >= newState.steps.length) {
        this.selected = newState.steps.length - 1;
      }
    });
  }

  set selected(newSelected: number) {
    this.selectedVar = newSelected;
    this.subscribers.forEach(sub => sub(newSelected));
  }

  get selected() {
    return this.selectedVar;
  }

  subscribe(listener) {
    this.subscribers.push(listener);
  }

  resetSubscriptions() {
    this.subscribers = [];
  }
}

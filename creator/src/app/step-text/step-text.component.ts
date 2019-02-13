import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';

@Component({
  selector: 'app-step-text',
  templateUrl: './step-text.component.html',
  styleUrls: ['./step-text.component.css']
})
export class StepTextComponent implements OnInit {

  noText = true;
  text: string;

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService) {
    this.undoRedo.subscribe(this.stateChange.bind(this));
    this.step.subscribe(() => {
      this.stateChange(this.undoRedo.getState());
    });
  }

  ngOnInit() {
  }

  /**
   * Called when the global state changes.
   * @param newState The new state.
   */
  stateChange(newState) {
    this.text = newState.steps[this.step.selected].text;
    if (!this.text) {
      this.noText = true;
    } else {
      this.noText = false;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';
import { ModalService } from '../modal.service';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-step-text',
  templateUrl: './step-text.component.html',
  styleUrls: ['./step-text.component.css']
})
export class StepTextComponent {

  noText = true;
  text: SafeHtml;

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private modal: ModalService,
              private sanitizer: DomSanitizer) {
    this.undoRedo.subscribe(this.stateChange.bind(this));
    this.step.subscribe(() => {
      this.stateChange(this.undoRedo.getState());
    });
  }

  /**
   * Called when the global state changes.
   * @param newState The new state.
   */
  stateChange(newState) {
    // Bypass because the system for displaying colored text
    // relies on creating HTML inside the step text.
    this.text = this.sanitizer.bypassSecurityTrustHtml(newState.steps[this.step.selected].text);
    if (!this.text) {
      this.noText = true;
    } else {
      this.noText = false;
    }
  }

  /**
   * Edit the text for this step.
   * @param e The mouse event.
   */
  edit(e: MouseEvent) {
    e.stopPropagation();
    this.modal.show(TextEditorComponent);
  }

}

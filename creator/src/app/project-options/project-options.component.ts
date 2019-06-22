import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.css']
})
export class ProjectOptionsComponent implements OnInit {

  isAutoplay: boolean;
  endDelay: number;

  constructor(private undoRedo: UndoRedoService,
              private modal: ModalService) { }

  ngOnInit() {
    const currState = this.undoRedo.getState();
    this.isAutoplay = currState.autoplay !== undefined;
    if (currState.autoplay && currState.autoplay.delays && currState.autoplay.delays[currState.steps.length - 1] !== undefined) {
      // End delay already defined
      this.endDelay = currState.autoplay.delays[currState.steps.length - 1];
    } else {
      // Use default
      this.endDelay = 500;
    }
  }

  /**
   * Apply the changes.
   */
  apply() {
    const newState = this.undoRedo.getStateClone();
    if (newState.autoplay !== undefined && !this.isAutoplay) {
      // Remove autoplay
      delete newState.autoplay;
    } else if (newState.autoplay === undefined && this.isAutoplay) {
      // Add autoplay
      newState.autoplay = {};
      newState.autoplay.delays = {};
      if (this.endDelay !== 0) {
        newState.autoplay.delays[newState.steps.length - 1] = this.endDelay;
      }
    } else if (newState.autoplay !== undefined) {
      // Autoplay on before, and still on now.
      // Update delay
      if (!newState.autoplay.delays) {
        // No delays defined at all
        newState.autoplay.delays = {};
      }
      newState.autoplay.delays[newState.steps.length - 1] = this.endDelay;
    } // Other case is autoplay off before and after, in which case do nothing

    // Save change and close
    this.undoRedo.publishChange(newState);
    this.modal.remove();
  }

}

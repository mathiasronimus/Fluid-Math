import { Component, ViewChild } from '@angular/core';
import Icon from './Icon';
import { UndoRedoService } from './undo-redo.service';
import { CentralAreaComponent } from './central-area/central-area.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  icons: Icon[];

  @ViewChild(CentralAreaComponent)
  centre: CentralAreaComponent;

  constructor(private undoRedo: UndoRedoService) {
    this.icons = [
      new Icon('save', this.save, () => true),
      new Icon('get_app', this.load, () => true),
      new Icon('play_arrow', this.play, () => true),
      new Icon('undo', this.undoRedo.undo, this.undoRedo.canUndo),
      new Icon('redo', this.undoRedo.redo, this.undoRedo.canRedo)
    ];
    this.undoRedo.publishChange(this.getDefaultInitialState());
    this.setAdding = this.setAdding.bind(this);
  }

  /**
   * Get the state displayed when the creator
   * is first loaded.
   */
  private getDefaultInitialState(): any {
    return {
      steps: [{
        root: {
          type: 'vbox',
          children: []
        }
      }],
      terms: []
    };
  }

  /**
   * Start adding to the canvas.
   */
  setAdding(toAdd: string | object) {
    this.centre.controller.setAdding(toAdd);
  }

  /**
   * Redraw the canvas.
   */
  redraw() {
    this.centre.controller.redraw();
  }

  /**
   * Save the current state to a file.
   */
  save() {
    console.log('save');
  }

  /**
   * Load from a file.
   */
  load() {
    console.log('load');
  }

  /**
   * Play the current state.
   */
  play() {
    console.log('play');
  }
}

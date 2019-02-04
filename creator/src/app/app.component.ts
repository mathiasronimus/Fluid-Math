import { Component } from '@angular/core';
import Icon from './Icon';
import { UndoRedoService } from './undo-redo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  icons: Icon[];

  constructor(private undoRedo: UndoRedoService) {
    this.icons = [
      new Icon('save', this.save, () => true),
      new Icon('get_app', this.load, () => true),
      new Icon('play_arrow', this.play, () => true),
      new Icon('undo', this.undoRedo.undo, this.undoRedo.canUndo),
      new Icon('redo', this.undoRedo.redo, this.undoRedo.canRedo)
    ];
    this.undoRedo.publishChange({});
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

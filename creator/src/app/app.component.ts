import { Component } from '@angular/core';
import Icon from './Icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  icons = [
    new Icon('save', this.save),
    new Icon('get_app', this.load),
    new Icon('play_arrow', this.play)
  ];

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

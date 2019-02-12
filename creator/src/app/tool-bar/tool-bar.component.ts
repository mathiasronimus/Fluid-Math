import { Component, OnInit, Input } from '@angular/core';
import Icon from '../Icon';
import { ContentSelectionService } from '../content-selection.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Input() leftIcons: Icon[];
  @Input() rightIcons: Icon[];

  constructor(private selection: ContentSelectionService) {}

  ngOnInit() {
  }

  /**
   * Deselect, or don't, depending on the state.
   * @param e The mouse event.
   */
  interceptClick(e: MouseEvent) {
    if (this.selection.selectedOnCanvas) {
      e.stopPropagation();
    }
  }

}

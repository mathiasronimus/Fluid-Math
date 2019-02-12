import { Component, OnInit, Input } from '@angular/core';
import Icon from '../Icon';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Input() leftIcons: Icon[];
  @Input() rightIcons: Icon[];

  constructor() {}

  ngOnInit() {
  }

}

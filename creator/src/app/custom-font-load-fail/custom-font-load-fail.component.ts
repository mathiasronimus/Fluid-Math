import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-custom-font-load-fail',
  templateUrl: './custom-font-load-fail.component.html',
  styleUrls: ['./custom-font-load-fail.component.css']
})
export class CustomFontLoadFailComponent implements OnInit {

  constructor(private modal: ModalService) { }

  ngOnInit() {
  }

}

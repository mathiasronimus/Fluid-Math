import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import CanvasController from '@shared/main/CanvasController';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements AfterViewInit {

  @ViewChild('eqContainer')
  eqContainerEl: ElementRef;

  constructor(private undoRedo: UndoRedoService) { }

  ngAfterViewInit() {
    const canv = new CanvasController(this.eqContainerEl.nativeElement, this.undoRedo.getState());
  }
}

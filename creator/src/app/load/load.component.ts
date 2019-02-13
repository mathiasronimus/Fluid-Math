import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css']
})
export class LoadComponent implements OnInit {

  @ViewChild('input')
  inputEl: ElementRef;

  @ViewChild('textArea')
  textAreaEl: ElementRef;

  constructor(private undoRedo: UndoRedoService, private modal: ModalService) { }

  ngOnInit() {
  }

  /**
   * Load the uploaded file/pasted text.
   */
  load() {
    if (this.inputEl.nativeElement.files.length > 0) {
      // File has been uploaded
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.loadFile(reader.result as string);
      });
      reader.readAsText(this.inputEl.nativeElement.files[0]);
    } else {
      // No file, check textarea instead
      this.loadFile(this.textAreaEl.nativeElement.value);
    }
  }

  /**
   * Once the file has been retrieved as a
   * string, loads it.
   * @param fileStr The file as a string.
   */
  loadFile(fileStr: string) {
    const fileObj = JSON.parse(fileStr);
    this.undoRedo.erase();
    this.undoRedo.publishChange(fileObj);
    this.modal.remove();
  }

}

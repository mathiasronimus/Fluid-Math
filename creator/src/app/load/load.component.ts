import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { ModalService } from '../modal.service';
import { ErrorService } from '../error.service';
import { SelectedStepService } from '../selected-step.service';
import { FontUpdateService } from '../font-update.service';
import C from '@shared/main/consts';
import { getMetrics } from '@shared/main/helpers';

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

  showLoading = false;

  constructor(private undoRedo: UndoRedoService,
              private modal: ModalService,
              private error: ErrorService,
              private step: SelectedStepService,
              private fontLoader: FontUpdateService) { }

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
    const oldHistory = this.undoRedo.getHistory();
    const oldStep = this.step.selected;
    try {
      const fileObj: any = JSON.parse(fileStr);
      // Load the font that the animation uses
      this.showLoading = true;
      const defaultFontObj = {
        type: 'g',
        name: C.fontFamily + ':' + C.fontWeight
      };
      const fontToLoad = fileObj.font ? fileObj.font : defaultFontObj;
      // Function to actually load
      const finishLoad = () => {
        this.undoRedo.erase();
        fileObj.metrics = getMetrics(fileObj);
        this.undoRedo.publishChange(fileObj);
        this.modal.remove();
      };
      // If font fails to load
      const loadFail = () => {
        finishLoad();
        this.error.text = 'Failed to Load Font';
      };
      this.fontLoader.load(fontToLoad, finishLoad, loadFail);
    } catch (e) {
      console.log(e);
      this.undoRedo.setHistory(oldHistory);
      this.step.selected = oldStep;
      this.error.text = 'Invalid File';
    }
  }

}

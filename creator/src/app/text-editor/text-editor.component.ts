import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';
import { ModalService } from '../modal.service';
import { SelectorData } from '../color-picker/color-picker.component';
import C from '@shared/main/consts';
import { cap, deCap } from '../helpers';
import CanvasController from '@shared/main/CanvasController';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements AfterViewInit {

  @ViewChild('textArea')
  textAreaEl: ElementRef;

  @ViewChild('eqContainer')
  eqContainerEl: ElementRef;

  activeStyleColor: string;
  styleActive = false;

  readonly styleOpts: SelectorData[];

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private modal: ModalService) {
    this.styleOpts = Object.keys(C.colors).map(colName => {
      const name = colName === 'default' ? 'Bold' : cap(colName);
      const colorArr = C.colors[colName];
      const colStyle = 'rgb(' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + ')';
      return new SelectorData(colStyle, name);
    });
  }

  /**
   * Apply the changes.
   */
  apply(text: string) {
    const newState: any = this.undoRedo.getStateClone();
    newState.steps[this.step.selected].text = text;
    this.undoRedo.publishChange(newState);
    this.modal.remove();
  }

  /**
   * Get the value to put in the text area
   * when the component loads.
   */
  getInitialValue(): string {
    const state: any = this.undoRedo.getState();
    const stepText = state.steps[this.step.selected].text;
    if (!stepText) {
      return '';
    } else {
      return stepText;
    }
  }

  /**
   * If something is selected, style it.
   * If it isn't, start styling.
   * @param styleIdx The index of styleOpts.
   */
  stylePress(styleIdx: number) {
    const ta: HTMLTextAreaElement = this.textAreaEl.nativeElement;
    if (ta.selectionStart !== ta.selectionEnd) {
      // Do selection
      const selectedText = ta.value.substring(ta.selectionStart, ta.selectionEnd);
      const afterSelectedText = ta.value.substring(ta.selectionEnd, ta.value.length);
      ta.value = ta.value.substring(0, ta.selectionStart);
      this.startStyle(styleIdx);
      ta.value += selectedText;
      this.endStyle();
      ta.value += afterSelectedText;
    } else {
      this.startStyle(styleIdx);
    }
  }

  /**
   * Insert the opening em tag into the
   * text, for a particular style.
   */
  startStyle(styleIdx: number) {
    // Return an em tag, with a class if defined.
    const emString = (className: string) => {
      return '<em' + (className ? ' class="' + className + '"' : '') + '>';
    };
    const data = this.styleOpts[styleIdx];
    let toInsert: string;
    if (data.text === 'Bold') {
      toInsert = emString(undefined);
    } else {
      toInsert = emString(deCap(data.text));
    }
    const ta = this.textAreaEl.nativeElement;
    ta.value = this.insertInString(ta.value, ta.selectionStart, toInsert);
    ta.focus();
    this.styleActive = true;
    this.activeStyleColor = data.color;
  }

  /**
   * Insert a closing em tag into the text.
   */
  endStyle() {
    const ta = this.textAreaEl.nativeElement;
    ta.value = this.insertInString(ta.value, ta.selectionStart, '</em>');
    ta.focus();
    this.styleActive = false;
  }

  /**
   * Show an updated version of the preview.
   */
  updatePreview() {
    const state: any = this.undoRedo.getStateClone();
    state.steps = [state.steps[this.step.selected]];
    state.steps[0].text = this.textAreaEl.nativeElement.value;
    this.eqContainerEl.nativeElement.innerHTML = '';
    const canv = new CanvasController(this.eqContainerEl.nativeElement, state);
  }

  /**
   * Return a new string, having inserted a string
   * into another string.
   * @param insertIn The string to insert into.
   * @param insertAt The index to insert at.
   * @param insert The string to insert.
   */
  insertInString(insertIn: string, insertAt: number, insert: string): string {
    return insertIn.substring(0, insertAt) + insert + insertIn.substring(insertAt, insertIn.length);
  }

  ngAfterViewInit() {
    this.textAreaEl.nativeElement.value = this.getInitialValue();
    this.textAreaEl.nativeElement.focus();
    this.updatePreview();
  }

}

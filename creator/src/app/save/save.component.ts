import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnDestroy, AfterViewInit {

  private downloadHref;
  private fileString: string;
  private copied: boolean;

  @ViewChild('textArea')
  textAreaEl: ElementRef;

  constructor(private undoRedo: UndoRedoService, private sanitizer: DomSanitizer) {
    this.fileString = JSON.stringify(this.undoRedo.getState());
    const blob = new Blob([this.fileString], {type: 'text/plain'});
    this.downloadHref = sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
  }

  /**
   * Copy the file to the clipboard as a string.
   */
  copy() {
    this.textAreaEl.nativeElement.select();
    this.copied = true;
    document.execCommand('copy');
  }

  ngAfterViewInit() {
    this.textAreaEl.nativeElement.value = this.fileString;
  }

  ngOnDestroy() {
    // Prevent resource leak.
    window.URL.revokeObjectURL(this.downloadHref);
  }
}

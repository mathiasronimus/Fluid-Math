import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { FontUpdateService } from '../font-update.service';
import { ModalService } from '../modal.service';
import { CustomFontLoadFailComponent } from '../custom-font-load-fail/custom-font-load-fail.component';
import { getMetrics } from '@shared/main/helpers';

@Component({
  selector: 'app-font-settings',
  templateUrl: './font-settings.component.html',
  styleUrls: ['./font-settings.component.css']
})
export class FontSettingsComponent implements OnInit, AfterViewInit {

  @ViewChild('fontType')
  fontType: ElementRef<HTMLSelectElement>;

  @ViewChild('gfName')
  googleFontName: ElementRef<HTMLInputElement>;

  @ViewChild('gfFontWeight')
  googleFontWeight: ElementRef<HTMLSelectElement>;

  @ViewChild('gfItalic')
  googleFontItalic: ElementRef<HTMLInputElement>;

  @ViewChild('cfName')
  customFontName: ElementRef<HTMLInputElement>;

  @ViewChild('cfFontWeight')
  customFontWeight: ElementRef<HTMLSelectElement>;

  @ViewChild('cfItalic')
  customFontItalic: ElementRef<HTMLInputElement>;

  @ViewChild('cfURL')
  customFontURL: ElementRef<HTMLInputElement>;

  loadingText = false;
  errorText = false;

  constructor(private undoRedo: UndoRedoService,
              private cd: ChangeDetectorRef,
              private fontLoader: FontUpdateService,
              private modal: ModalService) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Initialize UI with the current font
    const currState: any = this.undoRedo.getState();
    if (currState.font || currState.saveLaterFont) {
      const font = currState.saveLaterFont ? currState.saveLaterFont : currState.font;
      if (font.type === 'g') {
        this.fontType.nativeElement.value = 'google fonts';
        this.cd.detectChanges();
        // Name contains actual name, weight, and italic
        const fullName: string = font.name;
        const nameSplit = fullName.split(':');
        const name = nameSplit[0];
        this.googleFontName.nativeElement.value = name;
        // Check if italic
        let weightAndItalic = nameSplit[1];
        if (weightAndItalic.charAt(weightAndItalic.length - 1) === 'i') {
          // Italic
          this.googleFontItalic.nativeElement.checked = true;
          // Trim to be just the weight
          weightAndItalic = weightAndItalic.substring(0, weightAndItalic.length - 1);
        } else {
          this.googleFontItalic.nativeElement.checked = false;
        }
        this.googleFontWeight.nativeElement.value = weightAndItalic;
      } else if (font.type === 'c') {
        // Current font is custom
        this.fontType.nativeElement.value = 'custom font';
        this.cd.detectChanges();
        this.customFontName.nativeElement.value = font.name;
        this.customFontItalic.nativeElement.checked = font.style === 'italic';
        this.customFontWeight.nativeElement.value = font.weight;
        this.customFontURL.nativeElement.value = font.src;
      }
    }
    this.cd.detectChanges();
  }

  /**
   * Load the font, showing an error if it can't be loaded.
   */
  apply() {
    const fontType = this.fontType.nativeElement.value;
    if (fontType === 'default') {
      // Don't need to load anything.
      // Erase any custom font.
      const newState: any = this.undoRedo.getStateClone();
      delete newState.font;
      delete newState.saveLaterFont;
      newState.metrics = getMetrics(newState);
      this.undoRedo.publishChange(newState);
      this.modal.remove();
    } else if (fontType === 'google fonts') {
        // Load the google font
        this.loadingText = true;
        const name = this.googleFontName.nativeElement.value;
        const weight = this.googleFontWeight.nativeElement.value;
        const italic = this.googleFontItalic.nativeElement.checked ? 'i' : '';
        const fontObj = {
          type: 'g',
          name: name + ':' + weight + italic
        };
        // If successful
        const onSuccess = () => {
          const newState: any = this.undoRedo.getStateClone();
          delete newState.saveLaterFont;
          newState.font = fontObj;
          newState.metrics = getMetrics(newState);
          this.undoRedo.publishChange(newState);
          this.modal.remove();
        };
        // If unsuccessful
        const onFail = () => {
          this.loadingText = false;
          this.errorText = true;
        };
        this.fontLoader.load(fontObj, onSuccess, onFail);
    } else if (fontType === 'custom font') {
        // Load the custom font
        const fontName = this.customFontName.nativeElement.value;
        const fontStyle = this.customFontItalic.nativeElement.checked ? 'italic' : 'normal';
        const fontWeight = this.customFontWeight.nativeElement.value;
        const fontSrc = this.customFontURL.nativeElement.value;
        const fontObj = {
          type: 'c',
          name: fontName,
          style: fontStyle,
          weight: fontWeight,
          src: fontSrc
        };
        // If successful
        const onSuccess = () => {
          const newState: any = this.undoRedo.getStateClone();
          delete newState.saveLaterFont;
          newState.font = fontObj;
          newState.metrics = getMetrics(newState);
          this.undoRedo.publishChange(newState);
          this.modal.remove();
        };
        // If fail
        const onFail = () => {
          const newState: any = this.undoRedo.getStateClone();
          delete newState.font;
          newState.saveLaterFont = fontObj;
          newState.metrics = getMetrics(newState);
          this.undoRedo.publishChange(newState);
          this.modal.remove();
          setTimeout(() => {
            this.modal.show(CustomFontLoadFailComponent);
          }, 10);
        };
        this.fontLoader.load(fontObj, onSuccess, onFail);
    }
  }
}

import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import Icon from './Icon';
import { UndoRedoService } from './undo-redo.service';
import { CentralAreaComponent } from './central-area/central-area.component';
import { ContentSelectionService } from './content-selection.service';
import { ContentPaneComponent } from './content-pane/content-pane.component';
import { ModalDirective } from './modal.directive';
import { ModalService } from './modal.service';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { LoadComponent } from './load/load.component';
import { SaveComponent } from './save/save.component';
import { PreviewComponent } from './preview/preview.component';
import { addStyleSheet } from '@shared/main/helpers';
import { SubSuperAlignmentComponent } from './sub-super-alignment/sub-super-alignment.component';
import { ErrorService } from './error.service';
import { FontSettingsComponent } from './font-settings/font-settings.component';
import { ProjectOptionsComponent } from './project-options/project-options.component';
import { QuizConfigurationComponent } from './quiz-configuration/quiz-configuration.component';
import { TableAddComponent } from './table-add/table-add.component';
import EqContent from '@shared/layout/EqContent';
import C from '@shared/main/consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  defaultLeftIcons: Icon[];
  defaultRightIcons: Icon[];

  selectedLeftIcons: Icon[];
  selectedRightIcons: Icon[];

  subSuperAlignIcon: Icon;
  quizConfigIcon: Icon;
  tableIcons: Icon[];

  @ViewChild(CentralAreaComponent)
  centre: CentralAreaComponent;

  @ViewChild(ContentPaneComponent)
  content: ContentPaneComponent;

  private modalHostVar: ModalDirective;
  displayingModal = false;
  // Function called when the modal is shown,
  // passed a directive with a ViewContainerRef
  // of the inner modal container.
  // once set, only called once.
  onModalShow: (modalHost: ModalDirective) => void;

  constructor(private undoRedo: UndoRedoService,
              private selection: ContentSelectionService,
              private modal: ModalService,
              public cd: ChangeDetectorRef,
              private error: ErrorService) {
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.play = this.play.bind(this);
    this.deselect = this.deselect.bind(this);
    this.changeFont = this.changeFont.bind(this);
    this.openProjectOptions = this.openProjectOptions.bind(this);
    this.modal.appComponent = this;
    this.defaultLeftIcons = [];
    this.defaultRightIcons = [
      new Icon('save', this.save, () => true),
      new Icon('get_app', this.load, () => true),
      new Icon('play_arrow', this.play, () => true),
      new Icon('undo', this.undo, this.undoRedo.canUndo),
      new Icon('redo', this.redo, this.undoRedo.canRedo),
      new Icon('font_download', this.changeFont, () => true),
      new Icon('build', this.openProjectOptions, () => true)
    ];
    this.selectedLeftIcons = [
      new Icon('clear', this.deselect, () => true)
    ];
    this.selectedRightIcons = [
      new Icon('delete', () => {
        this.selection.canvasInstance.delete();
      }, () => this.selection.canvasInstance.canDelete()),
      new Icon('palette', () => {
        this.modal.show(ColorPickerComponent);
      }, () => true)
    ];
    this.subSuperAlignIcon = new Icon('vertical_align_top', () => {
      this.modal.show(SubSuperAlignmentComponent);
    }, () => true);
    this.quizConfigIcon = new Icon('star_half', () => {
      this.modal.show(QuizConfigurationComponent);
    }, () => true);
    this.tableIcons = [
      new Icon('add', () => {
        this.modal.show(TableAddComponent);
      }, () => true),
      new Icon('border_outer', () => {
        this.selection.canvasInstance.tableAddOuterBorder();
      }, () => true),
      new Icon('border_inner', () => {
        this.selection.canvasInstance.tableAddInnerBorder();
      }, () => true)
    ];
    this.undoRedo.publishChange(this.getDefaultInitialState());
    addStyleSheet();
  }

  @ViewChild(ModalDirective)
  set modalHost(newModalHost: ModalDirective) {
    this.modalHostVar = newModalHost;
    if (this.onModalShow) {
      this.onModalShow(this.modalHostVar);
    }
    this.onModalShow = undefined;
  }

  get modalHost() {
    return this.modalHostVar;
  }

  ngOnInit(): void {
    EqContent.colors = C.colors;
  }

  /**
   * Get the state displayed when the creator
   * is first loaded.
   */
  private getDefaultInitialState(): any {
    return {
      steps: [{
        root: {
          type: 'vbox',
          children: []
        }
      }],
      terms: []
    };
  }

  /**
   * Get the icons to be displayed on the
   * left based on the current state.
   */
  getLeftIcons() {
    if (this.selection.selectedOnCanvas) {
      return this.selectedLeftIcons;
    } else {
      return this.defaultLeftIcons;
    }
  }

  /**
   * Get the icons to be displayed on the
   * right based on the current state.
   */
  getRightIcons() {
    if (this.selection.selectedOnCanvas) {
      if (this.selection.selectedOnCanvas === 'c4') {
        // A subsuper is selected, offer option to change alignment.
        return this.selectedRightIcons.concat([this.subSuperAlignIcon]);
      } else if (this.selection.selectedOnCanvas === 'c5') {
        // Quiz selected, offer option to change config
        return this.selectedRightIcons.concat([this.quizConfigIcon]);
      } else if (this.selection.selectedOnCanvas === 'c6') {
        // Table selected, offer table options
        return this.selectedRightIcons.concat(this.tableIcons);
      } else {
        return this.selectedRightIcons;
      }
    } else {
      return this.defaultRightIcons;
    }
  }

  /**
   * Redraw the canvas.
   */
  redraw() {
    this.centre.controller.redraw();
  }

  /**
   * When a component is dropped not on the
   * canvas, stop the adding behavior.
   * @param e The drag event.
   */
  stopDrag(e: DragEvent) {
    e.preventDefault();
    this.selection.adding = undefined;
    this.content.dragging = false;
  }

  /**
   * Deselect anything on the content pane
   * and canvas.
   */
  deselect() {
    this.selection.adding = undefined;
    this.selection.selectedOnCanvas = undefined;
  }

  /**
   * Roll back to the last state.
   */
  undo() {
    this.deselect();
    this.undoRedo.undo();
  }

  /**
   * Undo the last undo.
   */
  redo() {
    this.deselect();
    this.undoRedo.redo();
  }

  /**
   * Save the current state to a file.
   */
  save() {
    this.modal.show(SaveComponent);
  }

  /**
   * Load from a file.
   */
  load() {
    this.modal.show(LoadComponent);
  }

  /**
   * Play the current state.
   */
  play() {
    this.modal.show(PreviewComponent);
  }

  /**
   * Change the current font.
   */
  changeFont() {
    this.modal.show(FontSettingsComponent);
  }

  /**
   * Show the project config dialog.
   */
  openProjectOptions() {
    this.modal.show(ProjectOptionsComponent);
  }
}

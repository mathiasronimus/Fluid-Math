import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ContentSelectionService } from '../content-selection.service';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';
import CanvasController from '@shared/main/CanvasController';
import C from '@shared/main/consts';
import SubSuper from '@shared/layout/SubSuper';
import { ModalService } from '../modal.service';
import { FileFormat, SubSuperContainerFormat, ContainerFormat } from '@shared/main/FileFormat';
import CreatorSubSuper from '../central-area/CreatorSubSuper';

@Component({
  selector: 'app-sub-super-alignment',
  templateUrl: './sub-super-alignment.component.html',
  styleUrls: ['./sub-super-alignment.component.css']
})
export class SubSuperAlignmentComponent implements AfterViewInit {

  private subSuperLayout: SubSuperContainerFormat;
  private fullInstructions: FileFormat;

  defaultPortrusion = C.defaultExpPortrusion;
  private portrusionVar = this.defaultPortrusion + '';

  @ViewChild('eqContainer')
  eqContainerEl: ElementRef;

  constructor(private selection: ContentSelectionService,
              private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private modal: ModalService) {
    // Create an instructions containing solely the
    // selected subSuper layout. Keep the color, remove
    // the text.
    this.subSuperLayout = selection.canvasInstance.getStepLayoutOfSelected() as SubSuperContainerFormat;
    this.fullInstructions = undoRedo.getStateClone();
    this.fullInstructions.steps = [this.fullInstructions.steps[step.selected]];
    delete this.fullInstructions.steps[0].text;
    delete this.fullInstructions.autoplay;
    this.fullInstructions.steps[0].root = {
      type: 'vbox',
      children: [this.subSuperLayout]
    } as ContainerFormat;
  }

  get portrusion() {
    return this.portrusionVar;
  }

  set portrusion(newPort: string) {
    this.portrusionVar = newPort;
    this.update();
  }

  /**
   * Update the current portrusion.
   */
  update() {
    this.subSuperLayout.portrusion = parseFloat(this.portrusion);
    this.refreshPreview();
  }

  /**
   * Update the preview canvas controller.
   */
  refreshPreview() {
    this.eqContainerEl.nativeElement.innerHTML = '';
    const canv = new CanvasController(this.eqContainerEl.nativeElement, this.fullInstructions);
  }

  /**
   * Apply the changes.
   */
  apply() {
    const subSuper = this.selection.canvasInstance.getSelectedLayout().component as CreatorSubSuper;
    subSuper.savePortrusion(parseFloat(this.portrusion));
    this.selection.canvasInstance.save();
    this.modal.remove();
  }

  ngAfterViewInit() {
    this.refreshPreview();
  }
}

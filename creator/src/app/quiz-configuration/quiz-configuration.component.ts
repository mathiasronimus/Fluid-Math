import { Component, OnInit, QueryList, ViewChildren, Directive, ElementRef, AfterViewInit } from '@angular/core';
import { ContentSelectionService } from '../content-selection.service';
import { QuizFormat, FileFormat, ContainerFormat, LinearContainerFormat } from '@shared/main/FileFormat';
import { UndoRedoService } from '../undo-redo.service';
import { ModalService } from '../modal.service';
import { deepClone } from '../helpers';
import CanvasController from '@shared/main/CanvasController';
import CreatorQuiz from '../central-area/CreatorQuiz';

@Component({
  selector: 'app-quiz-configuration',
  templateUrl: './quiz-configuration.component.html',
  styleUrls: ['./quiz-configuration.component.css']
})
export class QuizConfigurationComponent implements AfterViewInit {

  quizObj: QuizFormat;
  answers: boolean[];
  formatTemplate: FileFormat;

  @ViewChildren('eqContainer') containers: QueryList<ElementRef>;

  constructor(private selection: ContentSelectionService,
              private undoRedo: UndoRedoService,
              private modal: ModalService) {
    this.quizObj = selection.canvasInstance.getStepLayoutOfSelected() as QuizFormat;
    this.answers = new Array(this.quizObj.children.length).fill(false);
    this.quizObj.answers.forEach(index => {
      this.answers[index] = true;
    });
    // Create an empty template to put children of the quiz into
    this.formatTemplate = undoRedo.getStateClone();
    this.formatTemplate.steps = [{root: ({type: 'vbox', children: []}) as LinearContainerFormat}];
    delete this.formatTemplate.autoplay;
  }

  ngAfterViewInit() {
    this.initContainers();
    this.containers.changes.subscribe(this.initContainers.bind(this));
  }

  /**
   * Display each option in the containers.
   */
  initContainers() {
    this.containers.forEach((container, i) => {
      // Create a container for each child of the quiz
      container.nativeElement.innerHTML = '';
      const childEl = this.quizObj.children[i] as string | ContainerFormat;
      const template = deepClone(this.formatTemplate) as FileFormat;
      (template.steps[0].root as LinearContainerFormat).children[0] = childEl;
      const canv = new CanvasController(container.nativeElement, template);
    });
  }

  /**
   * Save changes and close.
   */
  apply() {
    const quiz = this.selection.canvasInstance.getSelectedLayout().component as CreatorQuiz;
    quiz.saveAnswers(this.answers);
    this.selection.canvasInstance.save();
    this.modal.remove();
  }

  trackByIndex(index: number) {
    return index;
  }

}

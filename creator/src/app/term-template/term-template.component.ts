import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { getMetrics } from '@shared/main/helpers';
import { ContentSelectionService } from '../content-selection.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-term-template',
  templateUrl: './term-template.component.html',
  styleUrls: ['./term-template.component.css']
})
export class TermTemplateComponent {

  readonly templates: string[];

  constructor(private undoRedo: UndoRedoService,
              private selection: ContentSelectionService,
              private modal: ModalService) {
    this.templates = [
      '×',
      '⋅',
      '÷',
      '±',
      '≤',
      '≥',
      '≠',
      '≈',
      '≡',
      '∝',
      '∞',
      '∫',
      'α',
      'β',
      'γ',
      'Δ',
      'δ',
      'ε',
      'ζ',
      'η',
      'Θ',
      'θ',
      'ι',
      'κ',
      'Λ',
      'λ',
      'μ',
      'Ξ',
      'ξ',
      'Π',
      'π',
      'ρ',
      'Σ',
      'σ',
      'τ',
      'υ',
      'Φ',
      'φ',
      'χ',
      'Ψ',
      'ψ',
      'Ω',
      'ω'
    ];
  }

  /**
   * Apply a template.
   * @param idx The index of the template in templates.
   */
  apply(idx: number) {
    const text = this.templates[idx];
    const newState: any = this.undoRedo.getStateClone();
    if (!newState.terms) {
      newState.terms = [];
    }
    newState.terms.push(text);
    newState.metrics = getMetrics(newState);
    this.undoRedo.publishChange(newState);
    this.modal.remove();
  }

}

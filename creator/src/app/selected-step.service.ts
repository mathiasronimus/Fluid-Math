import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedStepService {

  private selectedVar = 0;

  private subscribers: ((newSelected: number) => void)[] = [];

  constructor() { }

  set selected(newSelected: number) {
    this.selectedVar = newSelected;
    this.subscribers.forEach(sub => sub(newSelected));
  }

  get selected() {
    return this.selectedVar;
  }

  subscribe(listener) {
    this.subscribers.push(listener);
  }

  resetSubscriptions() {
    this.subscribers = [];
  }
}

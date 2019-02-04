import { Injectable } from '@angular/core';

// The total amount of objects that may be stored
const MAX_SIZE = 100;

@Injectable({
  providedIn: 'root'
})
/**
 * A service storing a history of the configuration
 * file as it has been edited. The configuration file
 * is the one converted into JSON for storage, describing
 * the animation.
 */
export class UndoRedoService {

  // Where idx > currentStateIdx, that state is a redo.
  // Where idx < currentStateIdx, that state is an undo.
  // Where idx = currentStateIdx, that state is current.
  private history: object[];
  private currentStateIdx;

  private subscribers: ((newState: object) => void)[];

  constructor() {
    this.history = [];
    this.currentStateIdx = -1;
    this.subscribers = [];
    this.redo = this.redo.bind(this);
    this.canRedo = this.canRedo.bind(this);
    this.undo = this.undo.bind(this);
    this.canUndo = this.canUndo.bind(this);
  }

  /**
   * Subscribe to changes in the current state.
   * @param changeFunction Function that will be passed the current state when it changes.
   */
  subscribe(changeFunction: (newState: object) => void) {
    this.subscribers.push(changeFunction);
  }

  /**
   * Notify subscribers the state has changed.
   */
  notifySubscribers() {
    const currState = this.history[this.currentStateIdx];
    this.subscribers.forEach(func => {
      func(currState);
    });
  }

  /**
   * Make a change to the current state.
   * @param newState The new current state.
   */
  publishChange(newState: object) {
    // Erase any redos ahead of this change
    this.history.splice(this.currentStateIdx + 1, this.history.length);
    // Add the new state
    this.history.push(newState);
    this.currentStateIdx++;
    // Trim the size if necessary
    const numToRemove = this.history.length - MAX_SIZE;
    if (numToRemove > 0) {
      this.history.splice(0, numToRemove);
      this.currentStateIdx -= numToRemove;
    }
    // Notify subscribers of change
    this.notifySubscribers();
  }

  /**
   * Whether there are changes to be undone.
   */
  canUndo(): boolean {
    return this.currentStateIdx > 0;
  }

  /**
   * Undo the last change.
   */
  undo() {
    const newIdx = this.currentStateIdx - 1;
    if (newIdx < 0) {
      throw new Error('Cannot undo.');
    }
    this.currentStateIdx = newIdx;
    this.notifySubscribers();
  }

  /**
   * Whether there are changes to be redone.
   */
  canRedo(): boolean {
    return this.currentStateIdx < this.history.length - 1;
  }

  /**
   * Redo the last undo.
   */
  redo() {
    const newIdx = this.currentStateIdx + 1;
    if (newIdx >= this.history.length) {
      throw new Error('Cannot redo');
    }
    this.currentStateIdx = newIdx;
    this.notifySubscribers();
  }

  /**
   * Get the current state.
   */
  getState(): object {
    return this.history[this.currentStateIdx];
  }
}

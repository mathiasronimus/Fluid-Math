import { Injectable } from '@angular/core';
import CreatorCanvasController from './central-area/CreatorCanvasController';

@Injectable({
  providedIn: 'root'
})
export class ContentSelectionService {

  containerObjGetters: (() => object)[] = [
    () => {
      return {
        type: 'hbox',
        children: []
      };
    },
    () => {
      return {
        type: 'vbox',
        children: []
      };
    },
    () => {
      return {
        type: 'tightHBox',
        children: []
      };
    },
    () => {
      return {
          type: 'subSuper',
          top: [],
          middle: [],
          bottom: []
      };
    }
  ];

  // The reference of what is selected on the pane.
  // For containers, the prefix 'c' is used which
  // is not valid in the context of the player.
  // addingContainer() and getContainer() must be used
  // to check for this.
  private addingVar: string;

  // The listeners that will be run when the above
  // variable
  private addingListeners: (() => void)[] = [];

  // The reference of what is selected on the canvas,
  // with the same 'c' prefix for containers as above.
  private selectedOnCanvasVar: string;

  private selectedOnCanvasListeners: (() => void)[] = [];

  // The singleton instance of CreatorCanvasController.
  canvasInstance: CreatorCanvasController;

  constructor() { }

  get selectedOnCanvas() {
    return this.selectedOnCanvasVar;
  }

  set selectedOnCanvas(newSelectedOnCanvas: string) {
    this.selectedOnCanvasVar = newSelectedOnCanvas;
    this.selectedOnCanvasListeners.forEach(listener => {
      listener();
    });
  }

  get adding() {
    return this.addingVar;
  }

  set adding(newAdding: string) {
    this.addingVar = newAdding;
    this.selectedOnCanvas = undefined;
    this.addingListeners.forEach(listener => {
      listener();
    });
  }

  /**
   * Add a new listener that will be run when the
   * 'adding' variable changes.
   * @param listener The new listener.
   */
  addAddListener(listener: () => void) {
    this.addingListeners.push(listener);
  }

  /**
   * Remove all current add listeners.
   */
  resetAddListeners() {
    this.addingListeners = [];
  }

  /**
   * Add a new listener that will be run when the
   * 'selectedOnCanvas' variable changes.
   * @param listener The new listener.
   */
  addSelectedOnCanvasListener(listener: () => void) {
    this.selectedOnCanvasListeners.push(listener);
  }

  /**
   * Remove all current selected on canvas listeners.
   */
  resetSelectedOnCanvasListeners() {
    this.addingListeners = [];
  }

  /**
   * Returns whether we are adding a container.
   */
  addingContainer(): boolean {
    return this.adding.charAt(0) === 'c';
  }

  /**
   * Returns the object representation of the
   * container we are adding.
   */
  getContainer(): object {
    const type = this.adding.charAt(0);
    if (type !== 'c') {
      throw new Error('Cannot add container. The type of adding is not a container.');
    }
    const idx = parseFloat(this.adding.substring(1, this.adding.length));
    return this.containerObjGetters[idx]();
  }
}

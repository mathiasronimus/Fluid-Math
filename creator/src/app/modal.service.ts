import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { AppComponent } from './app.component';
import { Component } from '@angular/compiler/src/core';

/**
 * Provides methods for any component to
 * add a component inside a modal and
 * display it.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private appComponentVar: AppComponent;

  constructor(private compFactRes: ComponentFactoryResolver) { }

  set appComponent(newAppComponent) {
    this.appComponentVar = newAppComponent;
  }

  /**
   * Show the modal and display
   * a component inside it.
   * @param The TYPE of the component to display.
   */
  show(component) {
    const factory = this.compFactRes.resolveComponentFactory(component);
    const viewContainer = this.appComponentVar.modalHost.viewContainerRef;
    viewContainer.clear();
    viewContainer.createComponent(factory);
  }

  /**
   * Remove the modal.
   */
  remove() {
    this.appComponentVar.modalHost.viewContainerRef.clear();
    this.appComponentVar.displayingModal = false;
  }
}

import { Injectable, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { AppComponent } from './app.component';
import { ModalDirective } from './modal.directive';

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
  private innerComponentRef: ComponentRef<any>;

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
    this.appComponentVar.onModalShow = (modalHost: ModalDirective) => {
      const factory = this.compFactRes.resolveComponentFactory(component);
      const viewContainer = modalHost.viewContainerRef;
      viewContainer.clear();
      this.innerComponentRef = viewContainer.createComponent(factory);
      this.appComponentVar.cd.detectChanges();
    };
    this.appComponentVar.displayingModal = true;
  }

  /**
   * Remove the modal.
   */
  remove() {
    this.innerComponentRef.destroy();
    this.appComponentVar.modalHost.viewContainerRef.clear();
    this.appComponentVar.displayingModal = false;
  }
}

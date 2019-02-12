import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appModalHost]'
})
export class ModalDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

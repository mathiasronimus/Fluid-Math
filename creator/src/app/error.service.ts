import { Injectable } from '@angular/core';
import { creatorErrorTimeout } from '@shared/main/consts';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private textVar: string;
  active: boolean;
  private timeoutID;

  constructor() { }

  get text() {
    return this.textVar;
  }

  set text(newText: string) {
    this.textVar = newText;
    this.active = true;
    if (this.timeoutID) {
      clearInterval(this.timeoutID);
    }
    this.timeoutID = setTimeout(() => {
      this.active = false;
    }, creatorErrorTimeout);
  }
}

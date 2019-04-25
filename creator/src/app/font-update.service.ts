import { Injectable, OnInit } from '@angular/core';
import * as WebFont from 'webfontloader';

@Injectable({
  providedIn: 'root'
})
export class FontUpdateService implements OnInit {

  // Stores the font face declarations
  // for loaded fonts.
  private styleEl: Element;

  constructor() {
    this.styleEl = document.createElement('style');
    document.head.appendChild(this.styleEl);
  }

  ngOnInit() {
  }

  /**
   * Attempt to load a font, call a callback
   * on success or failure.
   * @param fontObj An object representing the font to load. In the same format as
   *                that of the JSON files.
   * @param onSuccess Called when the loading of the font was successful. After this,
   *                  the font is loaded and can be used in Canvas instances.
   * @param onFail Called when the loading of the font was unsuccessful.
   */
  load(fontObj: any, onSuccess: () => void, onFail: () => void) {
    // Parse the font object
    let loadObj;
    if (fontObj.type === 'g') {
      // Load google font
      loadObj = {
        google: {
          families: [fontObj.name]
        }
      };
    } else if (fontObj.type === 'c') {
      // Load custom font
      // Add a font face declaration
      const fontFaceText =
                    '@font-face {' +
                        'font-family: ' + fontObj.name + ';' +
                        'font-style: ' + fontObj.style + ';' +
                        'font-weight: ' + fontObj.weight + ';' +
                        'src: url(' + fontObj.src + ');' +
                    '}';
      this.styleEl.appendChild(document.createTextNode(fontFaceText));
      // Create the object for the loader
      let loaderString = fontObj.name + ':';
      if (fontObj.style === 'normal') {
        loaderString += 'n';
      } else if (fontObj.style === 'italic') {
        loaderString += 'i';
      } else {
        throw new Error('Unrecognized custom font style');
      }
      loaderString += fontObj.weight;
      loadObj = {
        custom: {
          families: [loaderString]
        }
      };
    } else {
      throw new Error('Unrecognized font object type');
    }
    // Load the font
    loadObj.active = onSuccess;
    loadObj.inactive = onFail;
    WebFont.load(loadObj);
  }
}

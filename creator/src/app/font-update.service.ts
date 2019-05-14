import { Injectable, OnInit } from '@angular/core';
import * as WebFont from 'webfontloader';
import { FontFormat, GoogleFontFormat, CustomFontFormat } from '@shared/main/FileFormat';

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
  load(fontObj: FontFormat, onSuccess: () => void, onFail: () => void) {
    // Parse the font object
    let loadObj: WebFont.Config;
    if (fontObj.type === 'g') {
      // Load google font
      const font = fontObj as GoogleFontFormat;
      loadObj = {
        google: {
          families: [font.name]
        }
      };
    } else if (fontObj.type === 'c') {
      // Load custom font
      // Add a font face declaration
      const font = fontObj as CustomFontFormat;
      const fontFaceText =
                    '@font-face {' +
                        'font-family: ' + font.name + ';' +
                        'font-style: ' + font.style + ';' +
                        'font-weight: ' + font.weight + ';' +
                        'src: url(' + font.src + ');' +
                    '}';
      this.styleEl.appendChild(document.createTextNode(fontFaceText));
      // Create the object for the loader
      let loaderString = font.name + ':';
      if (font.style === 'normal') {
        loaderString += 'n';
      } else if (font.style === 'italic') {
        loaderString += 'i';
      } else {
        throw new Error('Unrecognized custom font style');
      }
      loaderString += font.weight;
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

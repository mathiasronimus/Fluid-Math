import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { UndoRedoService } from '../undo-redo.service';
import { SelectedStepService } from '../selected-step.service';
import { ModalService } from '../modal.service';
import { SelectorData } from '../color-picker/color-picker.component';
import C from '@shared/main/consts';
import { cap, deCap } from '../helpers';
import CanvasController from '@shared/main/CanvasController';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements AfterViewInit {

  @ViewChild('textArea')
  textAreaEl: ElementRef;

  @ViewChild('eqContainer')
  eqContainerEl: ElementRef;

  private anyTagPat = new RegExp('(<([^>]+)>)', 'gi');
  private openTagPat = new RegExp('(<[^/]([^>]*)>)', 'gi');
  private closeTagPat = new RegExp('(</([^>]+)>)', 'gi');

  readonly styleOpts: SelectorData[];

  constructor(private undoRedo: UndoRedoService,
              private step: SelectedStepService,
              private modal: ModalService,
              private error: ErrorService) {
    this.styleOpts = Object.keys(C.colors).map(colName => {
      const name = colName === 'default' ? 'Bold' : cap(colName);
      const colorArr = C.colors[colName];
      const colStyle = 'rgb(' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + ')';
      return new SelectorData(colStyle, name);
    });
  }

  /**
   * Apply the changes.
   */
  apply(text: string) {
    const newState = this.undoRedo.getStateClone();
    newState.steps[this.step.selected].text = text;
    this.undoRedo.publishChange(newState);
    this.modal.remove();
  }

  /**
   * Get the value to put in the text area
   * when the component loads.
   */
  getInitialValue(): string {
    const state = this.undoRedo.getState();
    const stepText = state.steps[this.step.selected].text;
    if (!stepText) {
      return 'Step Text Here';
    } else {
      return stepText;
    }
  }

  /**
   * If something is selected, style it.
   * @param styleIdx The index of styleOpts.
   */
  stylePress(styleIdx: number) {
    // Prepare the tags to be inserted
    const styleOpt = this.styleOpts[styleIdx];
    let startTag: string;
    if (styleOpt.text === 'Bold') {
      startTag = '<em>';
    } else {
      startTag = '<em class="' + deCap(styleOpt.text) + '">';
    }
    const endTag = '</em>';

    // Remove existing tags and add new ones
    const [start, end] = this.getHTMLSelection();
    const oldHTML = this.textAreaEl.nativeElement.innerHTML;
    const [preparedHTML, newStart, newEnd] = this.removeTags(oldHTML, start, end);
    const beforeSelected = preparedHTML.slice(0, newStart);
    const selected = preparedHTML.slice(newStart, newEnd);
    const afterSelected = preparedHTML.slice(newEnd, preparedHTML.length);
    this.textAreaEl.nativeElement.innerHTML = beforeSelected + startTag + selected + endTag + afterSelected;
  }

  /**
   * Remove the styling of the current selection.
   */
  unStyle() {
    const [start, end] = this.getHTMLSelection();
    const newHTML = this.removeTags(this.textAreaEl.nativeElement.innerHTML, start, end)[0];
    this.textAreaEl.nativeElement.innerHTML = newHTML;
  }

  /**
   * Given a string of HTML, remove any effects
   * of em tags within a certain range, while
   * preserving the effects outside the range.
   * Returns the new string, as well as the new
   * positions of the range boundary.
   * CASES TO CONSIDER:  (| = range boundary)
   * 1.        |                    |
   * 2. <em>   |                    |    </em>
   * 3.        |      <em></em>     |
   * 4. <em>   |        </em>       |
   * 5.        |        <em>        |    </em>
   * 6. <em>   |     </em><em>      |    </em>
   * 7. <em>   | </em><em></em><em> |    </em>
   * @param htmlString The string of HTML.
   * @param startInc The character at start of range (0-based, inclusive).
   * @param endExc The character at end of range (0-based, exclusive).
   */
  removeTags(htmlString: string, startInc: number, endExc: number): [string, number, number] {
    let beforeRange = htmlString.slice(0, startInc);
    let range = htmlString.slice(startInc, endExc);
    let afterRange = htmlString.slice(endExc, htmlString.length);

    const openBeforeIdx = this.lastIndexOf(beforeRange, this.openTagPat);
    const closeBeforeIdx = this.lastIndexOf(beforeRange, this.closeTagPat);
    const openAfterIdx = this.indexOf(afterRange, this.openTagPat);
    const closeAfterIdx = this.indexOf(afterRange, this.closeTagPat);

    // cases 2, 4, 6, 7
    if (openBeforeIdx > closeBeforeIdx) {
      beforeRange += '</em>';
      startInc += 5;
      endExc += 5;
    }

    // cases 2, 5, 6, 7
    if ((closeAfterIdx !== -1 && openAfterIdx === -1) || openAfterIdx > closeAfterIdx) {
      // Find the opening tag for the closing tag after the range
      // (which won't be in the after range portion.)
      const beforeAfterRange = beforeRange + range;
      const openTag = this.extractTag(beforeAfterRange, this.openTagPat, true);
      afterRange = openTag + afterRange;
    }

    // cases 3-7
    const rangeLenBefore = range.length;
    range = range.replace(this.anyTagPat, '');
    endExc -= rangeLenBefore - range.length;

    return [beforeRange + range + afterRange, startInc, endExc];
  }

  /**
   * Looks for an HTML tag in a string, and returns its
   * substring. Finds the tag closest to the end of the string.
   * Returns undefined if none found.
   * @param str The string to look in.
   * @param pat The pattern for the HTML tag. Must find matches ending in '>'.
   * @param backwards Whether to start the search from the rear of the string.
   */
  extractTag(str: string, pat: RegExp, backwards: boolean): string {
    const searchFunc = backwards ? this.lastIndexOf : this.indexOf;
    const startIdx = searchFunc(str, pat);
    if (startIdx === -1) {
      return undefined;
    }
    const endSearchStr = str.substring(startIdx, str.length);
    const endIdx = endSearchStr.indexOf('>');
    return endSearchStr.substring(0, endIdx + 1);
  }

  /**
   * Return the starting and ending offset
   * of what is selected, relative to the HTML
   * of the text area as opposed to the visual
   * content. If there is no selection, throw
   * an error.
   */
  getHTMLSelection(): [number, number] {
    const range = window.getSelection().getRangeAt(0);
    if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
      // TODO: Put an error in the UI.
      this.error.text = 'Select Text First';
      throw new Error('Select text first.');
    }
    const start = this.getInnerHTMLOffset(range.startOffset, range.startContainer, true);
    const end = this.getInnerHTMLOffset(range.endOffset, range.endContainer, false);
    return [start, end];
  }

  /**
   * Converts an offset relative to a child node of
   * the text area element to be relative to the
   * inner HTML of the text area element.
   * @param nodeOffset The offset relative to a child node
   *                   of the text area element.
   * @param node The node the above param is relative to.
   * @param expandLeft  Whether to include opening tags to the left
   *                    of the offset. If false, include closing tags
   *                    to the right.
   */
  getInnerHTMLOffset(nodeOffset: number, node: Node, expandLeft: boolean): number {
    const ta: HTMLDivElement = this.textAreaEl.nativeElement;
    // Get rid of adjacent text nodes.
    ta.normalize();
    const children = ta.childNodes;
    const innerHTML = ta.innerHTML;
    let idxOfNodeWithOffset;
    for (let i = 0; i < children.length; i++) {
      let child: Node = children[i];
      // EMs are children, which have text nodes as children
      if (child.nodeName !== '#text') {
        child = child.firstChild;
      }
      if (child === node) {
        idxOfNodeWithOffset = i;
        break;
      }
    }
    let cursor;
    let currChild = innerHTML.charAt(0) === '<' ? -1 : 0;
    let currChildStartIdx = 0;
    let tagLastIteration = false;
    for (cursor = 0; cursor <= innerHTML.length; cursor++) {
      if (currChild === idxOfNodeWithOffset && cursor === currChildStartIdx + nodeOffset) {
        // Found the selected position, but there's a catch:
        // if there is an opening tag directly before, or closing
        // tag directly after, we want to place the cursor on the
        // other side.
        const beforeCursor = innerHTML.slice(0, cursor);
        const afterCursor = innerHTML.slice(cursor, innerHTML.length);
        const lastOpenTagBeforeCursor = this.extractTag(beforeCursor, this.openTagPat, true);
        const firstCloseTagAfterCursor = this.extractTag(afterCursor, this.closeTagPat, false);
        if (expandLeft && beforeCursor.endsWith(lastOpenTagBeforeCursor)) {
          // Shift to before
          cursor -= lastOpenTagBeforeCursor.length;
        } else if (!expandLeft && afterCursor.startsWith(firstCloseTagAfterCursor)) {
          // Shift to after
          cursor += firstCloseTagAfterCursor.length;
        }
        return cursor;
      }
      const char = innerHTML.charAt(cursor);
      if (char === '<') {
        // Possibly the start or end of an HTML tag, either signifying the next element
        const restOf = innerHTML.slice(cursor);
        const startOfTag = restOf.search(this.anyTagPat) === 0;
        if (startOfTag) {
          if (!tagLastIteration) {
            // If we have <em></em><em></em>, there is only one transition between children
            currChild++;
          }
          const endOfTagIdx = restOf.indexOf('>');
          // Put cursor at end of tag, next iteration pushes it to right place
          cursor += endOfTagIdx;
          currChildStartIdx = cursor + 1;
          tagLastIteration = true;
        }
      } else {
        tagLastIteration = false;
      }
    }
    throw new Error('Could not find position within HTML.');
  }

  /**
   * Find the starting index of a pattern in
   * a string, searching backwards. Make sure
   * the 'g' flag is enabled in the pattern.
   * @param str The string to search in.
   * @param pattern The pattern to match.
   */
  lastIndexOf(str: string, pattern: RegExp): number {
    const match = str.match(pattern);
    if (!match) {
      return -1;
    }
    return str.lastIndexOf(match[match.length - 1]);
  }

  /**
   * Find the starting index of a pattern in
   * a string.
   * @param str The string to find an index in.
   * @param pattern The pattern to match.
   */
  indexOf(str: string, pattern: RegExp): number {
    const match = str.match(pattern);
    if (!match) {
      return -1;
    }
    return str.indexOf(match[0]);
  }

  /**
   * Show an updated version of the preview.
   */
  updatePreview() {
    const state = this.undoRedo.getStateClone();
    state.steps = [state.steps[this.step.selected]];
    state.steps[0].text = undefined;
    this.eqContainerEl.nativeElement.innerHTML = '';
    const canv = new CanvasController(this.eqContainerEl.nativeElement, state);
  }

  /**
   * Called when a key is down. If it is not a valid
   * key, cancel the typing.
   */
  checkValid(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  ngAfterViewInit() {
    this.textAreaEl.nativeElement.innerHTML = this.getInitialValue();
    this.textAreaEl.nativeElement.focus();
    this.updatePreview();
  }

}

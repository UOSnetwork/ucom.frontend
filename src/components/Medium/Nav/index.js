import { KEY_DOWN, KEY_UP, KEY_RIGHT, KEY_LEFT, KEY_BACK_SPACE, KEY_DELETE, KEY_ENTER, KEY_RETURN } from 'keycode-js';
import MediumEditor from 'medium-editor';
import { getBlockFromElement } from '../utils';
import './styles.css';

export default class MediumNav extends MediumEditor.Extension {
  name = 'MediumNav';

  init() {
    this.state = {};
    this.onKeyDown = this.onKeyDown.bind(this);

    this.base.subscribe('editableClick', (e) => {
      const selectedBlock = getBlockFromElement(e.target);
      this.removeActiveFromAllEmbeds();

      if (selectedBlock && this.blockIsEmbed(selectedBlock)) {
        this.setActiveEmbed(selectedBlock);
      }

      this.state = this.getState();
    });

    this.base.subscribe('editableKeyup', () => {
      this.state = this.getState();
    });

    this.base.subscribe('stateChanged', () => {
      this.state = this.getState();
    });

    this.base.subscribe('editableKeydown', this.onKeyDown);
  }

  onKeyDown(e) {
    const selection = window.getSelection();
    const { state } = this;

    switch (e.which) {
      case KEY_DOWN: {
        if (!state.nextBlock) {
          return;
        }

        if (state.selectedBlockIsEmbed && state.nextBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.setActiveEmbed(state.nextBlock);
          return;
        }

        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.removeActiveFromAllEmbeds();
          this.setCursorBeforeStartOfBlock(state.nextBlock);
          return;
        }

        if (state.cursonInLastLine && state.nextBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.nextBlock);
        }

        break;
      }

      case KEY_UP: {
        if (!state.prevBlock) {
          return;
        }

        if (state.selectedBlockIsEmbed && state.prevBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.setActiveEmbed(state.prevBlock);
          return;
        }

        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.removeActiveFromAllEmbeds();
          this.setCursorBeforeEndBlock(state.prevBlock);
          return;
        }

        if (state.cursonInFirstLine && state.prevBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.prevBlock);
        }

        break;
      }

      case KEY_RIGHT: {
        if (!state.nextBlock) {
          return;
        }

        if (state.selectedBlockIsEmbed && state.nextBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.setActiveEmbed(state.nextBlock);
          return;
        }

        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.removeActiveFromAllEmbeds();
          this.setCursorBeforeStartOfBlock(state.nextBlock);
        }

        if (state.cursonInLastLine && state.cursonInLastCharacter && state.nextBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.nextBlock);
        }

        break;
      }

      case KEY_DELETE: {
        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.deleteBlock(state.selectedBlock);
          this.base.checkContentChanged(this.base.origElements);
          return;
        }

        if (state.nextBlock && state.cursonInLastLine && state.cursonInLastCharacter && state.nextBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.nextBlock);
        }

        break;
      }

      case KEY_LEFT: {
        if (!state.prevBlock) {
          return;
        }

        if (state.selectedBlockIsEmbed && state.prevBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.setActiveEmbed(state.prevBlock);
          return;
        }

        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.removeActiveFromAllEmbeds();
          this.setCursorAfterEndBlock(state.prevBlock);
          return;
        }

        if (state.cursonInFirstLine && state.cursonInFirstCharacter && state.prevBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.prevBlock);
        }

        break;
      }

      // TODO: If empty block remove block
      case KEY_BACK_SPACE: {
        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.deleteBlock(state.selectedBlock);
          this.base.checkContentChanged(this.base.origElements);
          return;
        }

        if (state.prevBlock && state.cursonInFirstLine && state.cursonInFirstCharacter && state.prevBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          selection.empty();
          this.setActiveEmbed(state.prevBlock);

          if (this.blockIsEmpty(state.selectedBlock) && state.selectedBlock.nextSibling) {
            this.removeBlock(state.selectedBlock);
            this.base.checkContentChanged(this.base.origElements);
          }
        }

        break;
      }

      case KEY_ENTER:
      case KEY_RETURN: {
        if (state.selectedBlockIsEmbed) {
          e.preventDefault();
          e.stopPropagation();
          this.addEmptyBlockBefore(state.selectedBlock);
          this.base.checkContentChanged(this.base.origElements);
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  getState() {
    const state = {
      cursonInLastLine: false,
      cursonInFirstLine: false,
      cursonInLastCharacter: false,
      cursonInFirstCharacter: false,
      selectedBlock: null,
      selectedBlockIsEmbed: false,
      nextBlockIsEmbed: false,
      prevBlockIsEmbed: false,
      nextBlock: null,
      prevBlock: null,
    };

    const selectedBlock = this.getSelectedBlock();

    if (!selectedBlock) {
      return state;
    }

    state.selectedBlock = selectedBlock;
    state.nextBlock = selectedBlock.nextSibling;
    state.prevBlock = selectedBlock.previousSibling;
    state.nextBlockIsEmbed = state.nextBlock ? this.blockIsEmbed(state.nextBlock) : false;
    state.prevBlockIsEmbed = state.prevBlock ? this.blockIsEmbed(state.prevBlock) : false;

    if (this.blockIsEmbed(selectedBlock)) {
      state.selectedBlockIsEmbed = true;
      return state;
    }

    const selectedLine = this.getSelectedLine();

    if (typeof selectedLine === 'string') {
      const selectedBlockContent = selectedBlock.textContent;
      const selectedLineIndex = selectedBlockContent.indexOf(selectedLine);
      let selectedBlockRest = selectedBlockContent.slice(0, selectedLineIndex);
      selectedBlockRest = selectedBlockContent.replace(selectedBlockRest, '');
      selectedBlockRest = selectedBlockRest.replace(selectedLine, '');

      state.cursonInLastLine = selectedBlockRest.length === 0;
      state.cursonInFirstLine = selectedBlockContent.indexOf(selectedLine) === 0;

      const caretCharacterOffsetWithin = this.getCaretCharacterOffsetWithin(selectedBlock);

      state.cursonInLastCharacter = selectedBlockContent.length === caretCharacterOffsetWithin;
      state.cursonInFirstCharacter = caretCharacterOffsetWithin === 0;
    }

    return state;
  }

  getSelectedLine() {
    const selection = window.getSelection();

    if (selection.rangeCount === 0 || selection.anchorOffset !== selection.focusOffset) {
      return null;
    }

    const range = selection.getRangeAt(0);

    selection.modify('move', 'backward', 'lineboundary');
    selection.modify('extend', 'forward', 'lineboundary');

    const line = selection.getRangeAt(0).toString();

    selection.removeAllRanges();
    selection.addRange(range);

    return line;
  }

  getCaretCharacterOffsetWithin(element) {
    const sel = window.getSelection();
    let caretOffset = 0;

    if (sel.rangeCount > 0) {
      const range = window.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }

    return caretOffset;
  }

  getSelectedBlock() {
    const activeEmbed = this.getActiveEmbeds()[0];

    if (activeEmbed) {
      return activeEmbed;
    }

    const selection = window.getSelection();

    if (selection.rangeCount === 0 || selection.anchorOffset !== selection.focusOffset) {
      return null;
    }

    return getBlockFromElement(this.base.getSelectedParentElement());
  }

  blockIsEmbed(block) {
    if (!block) {
      return false;
    }

    return block.getAttribute('contenteditable') === 'false';
  }

  blockIsEmpty(block) {
    if (!block) {
      return false;
    }

    return block.textContent.length === 0;
  }

  getActiveEmbeds() {
    return Array.from(document.querySelectorAll('[contenteditable="false"].active'));
  }

  removeActiveFromAllEmbeds() {
    this.getActiveEmbeds().forEach((el) => {
      el.classList.remove('active');
      el.removeEventListener('keydown', this.onKeyDown);
    });
  }

  setActiveEmbed(block) {
    this.removeActiveFromAllEmbeds();

    block.classList.add('active');
    block.setAttribute('tabindex', '0');
    block.addEventListener('keydown', this.onKeyDown, true);

    if (block !== document.activeElement && !block.contains(document.activeElement)) {
      block.focus();
    }
  }

  setCursorBeforeStartOfBlock(block) {
    if (!block) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();

    range.setStartBefore(block.childNodes[0]);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    block.setAttribute('tabindex', '0');
    block.focus();
  }

  setCursorBeforeEndBlock(block) {
    if (!block) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    const lastChildNode = block.childNodes[block.childNodes.length - 1];

    range.setStartAfter(lastChildNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    selection.modify('move', 'backward', 'lineboundary');
    block.setAttribute('tabindex', '0');
    block.focus();
  }

  setCursorAfterEndBlock(block) {
    if (!block) {
      return;
    }

    const selection = window.getSelection();
    const range = document.createRange();
    const lastChildNode = block.childNodes[block.childNodes.length - 1];

    range.setStartAfter(lastChildNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    selection.modify('move', 'forward', 'lineboundary');
    block.setAttribute('tabindex', '0');
    block.focus();
  }

  deleteBlock(block) {
    if (!block) {
      return;
    }

    const p = document.createElement('p');
    p.innerHTML = '<br>';
    block.parentNode.replaceChild(p, block);

    const selection = window.getSelection();
    const range = document.createRange();

    range.setStartAfter(p.childNodes[0]);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    block.setAttribute('tabindex', '0');
    block.focus();
  }

  addEmptyBlockBefore(block) {
    if (!block) {
      return;
    }

    const p = document.createElement('p');
    p.innerHTML = '<br>';
    block.parentNode.insertBefore(p, block);
  }

  removeBlock(block) {
    block.parentNode.removeChild(block);
  }
}

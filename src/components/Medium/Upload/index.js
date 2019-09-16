import MediumEditor from 'medium-editor';
import api from '../../../api';
import { compressUploadedImage } from '../../../utils/upload';
import EmbedService from '../../../utils/embedService';
import './styles.css';

class UploadButtons {
  constructor({
    onImageSelect,
    onVideoEmbedSelect,
    onSurveyEmbedSelect,
  }) {
    this.currentEl = null;
    this.el = document.createElement('div');
    this.el.className = 'medium-upload';

    this.render();

    this.el.querySelector('.js-trigger').addEventListener('click', () => {
      this.toggleButtons();
    });

    this.el.querySelector('.js-file-input').addEventListener('change', (e) => {
      onImageSelect(e.target.files[0]);
      e.target.value = '';
      this.hide();
    });

    this.el.querySelector('.js-video-embed').addEventListener('click', () => {
      const url = prompt('Paste a link and press Enter'); // eslint-disable-line
      onVideoEmbedSelect(url);
      this.hide();
    });

    this.el.querySelector('.js-survey-embed').addEventListener('click', () => {
      onSurveyEmbedSelect();
      this.hide();
    });

    document.body.appendChild(this.el);
  }

  // TODO: Move to react component
  render() {
    this.el.innerHTML = `
      <div class="medium-upload__trigger">
        <div class="medium-upload__button js-trigger">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2832 0.187977H8.28919V8.01398H0.383739V9.98798H8.28919V17.814H10.2832L10.2832 9.98798L18.1887 9.98798V8.01398L10.2832 8.01398L10.2832 0.187977Z" />
          </svg>
        </div>
      </div>

      <div class="medium-upload__list">
        <div class="medium-upload__item">
          <label class="medium-upload__icon">
            <input type="file" class="js-file-input" />
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="path-1-inside-1" fill="white">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7694 1.26302C14.7694 0.565474 14.2039 0 13.5063 0H7.82726C7.12971 0 6.56424 0.565474 6.56424 1.26302C6.56424 1.96057 5.99876 2.52604 5.30122 2.52604H3C1.34315 2.52604 0 3.86919 0 5.52604V12.9997C0 14.6566 1.34315 15.9997 3 15.9997H18.3333C19.9902 15.9997 21.3333 14.6566 21.3333 12.9997V5.52604C21.3333 3.86919 19.9902 2.52604 18.3333 2.52604H16.0324C15.3348 2.52604 14.7694 1.96057 14.7694 1.26302Z"/>
              </mask>
              <path d="M7.82726 2H13.5063V-2H7.82726V2ZM3 4.52604H5.30122V0.526042H3V4.52604ZM2 12.9997V5.52604H-2V12.9997H2ZM18.3333 13.9997H3V17.9997H18.3333V13.9997ZM19.3333 5.52604V12.9997H23.3333V5.52604H19.3333ZM16.0324 4.52604H18.3333V0.526042H16.0324V4.52604ZM16.0324 0.526042C16.4394 0.526042 16.7694 0.855999 16.7694 1.26302H12.7694C12.7694 3.06514 14.2303 4.52604 16.0324 4.52604V0.526042ZM23.3333 5.52604C23.3333 2.76462 21.0948 0.526042 18.3333 0.526042V4.52604C18.8856 4.52604 19.3333 4.97376 19.3333 5.52604H23.3333ZM18.3333 17.9997C21.0948 17.9997 23.3333 15.7612 23.3333 12.9997H19.3333C19.3333 13.552 18.8856 13.9997 18.3333 13.9997V17.9997ZM-2 12.9997C-2 15.7612 0.238581 17.9997 3 17.9997V13.9997C2.44772 13.9997 2 13.552 2 12.9997H-2ZM3 0.526042C0.238577 0.526042 -2 2.76461 -2 5.52604H2C2 4.97376 2.44771 4.52604 3 4.52604V0.526042ZM4.56424 1.26302C4.56424 0.856 4.89419 0.526042 5.30122 0.526042V4.52604C7.10333 4.52604 8.56424 3.06514 8.56424 1.26302H4.56424ZM13.5063 2C13.0993 2 12.7694 1.67004 12.7694 1.26302H16.7694C16.7694 -0.539097 15.3085 -2 13.5063 -2V2ZM7.82726 -2C6.02514 -2 4.56424 -0.539095 4.56424 1.26302H8.56424C8.56424 1.67004 8.23428 2 7.82726 2V-2Z" fill="#C4C4C4" mask="url(#path-1-inside-1)"/>
              <circle cx="10.6667" cy="9.05209" r="3" stroke="#C4C4C4" stroke-width="2"/>
            </svg>
          </label>
        </div>
        <div class="medium-upload__item">
          <div class="medium-upload__icon js-video-embed">
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.33331" y="1" width="19.3333" height="14" rx="3" stroke="#C4C4C4" stroke-width="2"/>
              <path d="M10.2778 6.74908L12.4444 8L10.2778 9.25093L10.2778 6.74908Z" stroke="#C4C4C4" stroke-width="3"/>
            </svg>
          </div>
        </div>
        <div class="medium-upload__item medium-upload__item_survay">
          <div class="medium-upload__icon js-survey-embed">
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9.92981" y="1.77778" width="1.68421" height="10.6667" rx="0.842105" fill="#C4C4C4"/>
            <rect x="5.7193" width="1.68421" height="12.4444" rx="0.842105" fill="#C4C4C4"/>
            <rect x="16.6667" y="14.2222" width="1.77778" height="16" rx="0.888889" transform="rotate(90 16.6667 14.2222)" fill="#C4C4C4"/>
            <rect x="1.50876" y="5.33334" width="1.68421" height="7.11111" rx="0.842105" fill="#C4C4C4"/>
            <rect x="14.1404" y="8" width="1.68421" height="4.44444" rx="0.842105" fill="#C4C4C4"/>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  toggleButtons() {
    if (this.el.classList.contains('medium-upload_active')) {
      this.hideButtons();
    } else {
      this.showButton();
    }
  }

  showButton() {
    this.el.classList.add('medium-upload_active');
    if (this.currentEl) {
      this.currentEl.classList.add('active-buttons');
    }
  }

  hideButtons() {
    this.el.classList.remove('medium-upload_active');
    if (this.currentEl) {
      this.currentEl.classList.remove('active-buttons');
    }
  }

  show(el) {
    this.hideButtons();

    const rect = el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;

    this.currentEl = el;

    this.el.style.top = `${top}px`;
    this.el.style.left = `${left}px`;
    this.el.style.height = `${rect.height}px`;
    this.el.classList.add('medium-upload_visible');
  }

  hide() {
    this.hideButtons();
    this.el.classList.remove('medium-upload_visible');
  }

  remove() {
    this.el.parentNode.removeChild(this.el);
  }
}

export default class MediumUpload extends MediumEditor.Extension {
  name = 'MediumUpload';
  currentEl = null;

  constructor(params) {
    super(params);

    this.onUploadStart = params.onUploadStart;
    this.onUploadDone = params.onUploadDone;
    this.onError = params.onError;
    this.onEmbed = params.onEmbed;
    this.uploadButtons = new UploadButtons({
      onImageSelect: this.uplaodAndAppendImage,
      onVideoEmbedSelect: this.appendEmbed,
    });
  }

  init() {
    this.base.subscribe('editableKeyup', this.onEdit);
    this.base.subscribe('editableClick', this.onEdit);
  }

  destroy() {
    this.uploadButtons.remove();
  }

  onEdit = () => {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const { startContainer } = selection.getRangeAt(0);

      if (startContainer.nodeType === 1) {
        if (['H1', 'H2', 'P'].includes(startContainer.tagName)) {
          this.currentEl = startContainer;
        } else if (startContainer.parentNode.tagName === 'P') {
          this.currentEl = startContainer.parentNode;
        }
      }
    }

    if (this.hasShowUploadButtons()) {
      this.uploadButtons.show(this.currentEl);
    } else {
      this.uploadButtons.hide();
    }
  }

  hasShowUploadButtons() {
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const { startContainer } = selection.getRangeAt(0);

      return startContainer.nodeType === 1 && startContainer.tagName !== 'LI';
    }

    return false;
  }

  setCursorToElemnt(el) {
    const range = document.createRange();
    const sel = window.getSelection();

    range.setStart(el.childNodes[0], 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  insertEl = (el) => {
    const parentEl = this.currentEl.parentNode;
    const newLine = document.createElement('p');
    newLine.innerHTML = '<br>';
    parentEl.replaceChild(el, this.currentEl);
    parentEl.insertBefore(newLine, el.nextSibling);
    this.setCursorToElemnt(newLine);
    this.currentEl = newLine;
    this.base.checkContentChanged(this.base.origElements);
    this.base.trigger('stateChanged');

    setTimeout(() => {
      this.uploadButtons.show(this.currentEl);
    }, 0);
  }

  fileIsImage = (file) => {
    if (!file || file.type.indexOf('image/') !== 0) {
      return false;
    }

    return true;
  }

  uplaodAndAppendImage = async (file) => {
    if (!this.fileIsImage(file)) {
      return;
    }

    let compressedImage;

    try {
      compressedImage = await compressUploadedImage(file);
    } catch (err) {
      this.onError(err.message);
      return;
    }

    const p = document.createElement('p');
    p.contentEditable = false;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    p.appendChild(img);
    this.insertEl(p);

    if (this.onUploadStart) {
      this.onUploadStart();
    }

    try {
      const data = await api.uploadOneImage(compressedImage);
      img.src = data.files[0].url;
      this.base.checkContentChanged(this.base.origElements);
    } catch (e) {
      this.onError(e);
    }

    if (this.onUploadDone) {
      this.onUploadDone();
    }
  }

  appendEmbed = async (url) => {
    if (this.onUploadStart) {
      this.onUploadStart();
    }

    try {
      const data = await EmbedService.getDataFromUrl(url);
      const div = document.createElement('div');
      div.contentEditable = false;
      div.innerHTML = EmbedService.renderEmbedLink(data.url);
      this.insertEl(div);
      this.onEmbed(data);
    } catch (err) {
      console.error(err);
      this.onError(err.message);
    }

    if (this.onUploadDone) {
      this.onUploadDone();
    }
  }
}

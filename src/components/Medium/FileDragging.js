import { uniqueId } from 'lodash';
import MediumEditor from 'medium-editor';
import api from '../../api';
import loader from '../../utils/loader';
import { UPLAOD_ERROR_BASE, compressUploadedImage } from '../../utils/upload';
import { getBlockFromElement } from './utils';

const CLASS_DRAG_OVER = 'medium-editor-dragover';

const clearClassNames = (element) => {
  const editable = MediumEditor.util.getContainerEditorElement(element);
  const existing = Array.from(editable.parentElement.querySelectorAll(`.${CLASS_DRAG_OVER}`));

  existing.forEach((el) => {
    el.classList.remove(CLASS_DRAG_OVER);
  });
};

const containsFiles = (e) => {
  if (e.dataTransfer.types) {
    for (let i = 0; i < e.dataTransfer.types.length; i++) {
      if (e.dataTransfer.types[i] === 'Files') {
        return true;
      }
    }
  }

  return false;
};


export default MediumEditor.extensions.fileDragging.extend({
  handleDrag(e) {
    e.preventDefault();

    if (!containsFiles(e)) {
      return;
    }

    e.dataTransfer.dropEffect = 'copy';

    const target = e.target.classList ? e.target : e.target.parentElement;

    // Ensure the class gets removed from anything that had it before
    clearClassNames(target);

    if (e.type === 'dragover') {
      target.classList.add(CLASS_DRAG_OVER);
    }
  },

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files) {
      const images = Array.from(e.dataTransfer.files)
        .filter(file => this.isAllowedFile(file))
        .filter(file => file.type.match('image'));

      if (!images.length) {
        return;
      }

      let block = getBlockFromElement(e.target);

      if (!block) {
        block = this.base.origElements.lastChild;
      }

      if (block === this.base.origElements.lastChild) {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        block.parentNode.appendChild(p);
      }

      images.forEach((file) => {
        this.insertImageFile(file, block);
      });
    }

    clearClassNames(e.target);
  },

  async insertImageFile(file, block) {
    const p = document.createElement('p');
    p.contentEditable = false;
    const img = this.document.createElement('img');
    const imgId = uniqueId('upload-img');
    img.id = imgId;
    img.src = URL.createObjectURL(file);
    p.appendChild(img);
    const emptyP = document.createElement('p');
    emptyP.innerHTML = '<br>';
    block.parentElement.insertBefore(p, block.nextSibling);
    loader.start();

    try {
      const compressedFile = await compressUploadedImage(file);
      const data = await api.uploadPostImage(compressedFile);
      const imgUrl = data.files[0].url;
      const imgEl = this.document.getElementById(imgId);
      if (imgEl) {
        imgEl.src = imgUrl;
        imgEl.removeAttribute('id');
        this.base.checkContentChanged(this.base.origElements);
        this.base.trigger('stateChanged');
      }
    } catch (e) {
      console.error(e);
      if (this.onError) {
        this.onError(UPLAOD_ERROR_BASE);
      }
    }

    loader.done();
  },
});

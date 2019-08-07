import MediumEditor from 'medium-editor';
import './styles.css';

class Input {
  constructor(tagName) {
    this.el = document.createElement(tagName);
    this.el.innerHTML = '<br>';
  }

  showPlaceholder() {
    this.el.classList.add('medium-post-placeholder');
  }

  hidePlaceholder() {
    this.el.classList.remove('medium-post-placeholder');
  }

  togglePlaceholder(show) {
    if (show) {
      this.showPlaceholder();
    } else {
      this.hidePlaceholder();
    }
  }
}

export default class MediumPost extends MediumEditor.Extension {
  name = 'MediumPost';

  init() {
    const title = new Input('h1');
    const leadText = new Input('h2');
    const mainText = new Input('p');

    title.showPlaceholder();
    leadText.showPlaceholder();
    mainText.showPlaceholder();

    this.base.origElements.appendChild(title.el);
    this.base.origElements.appendChild(leadText.el);
    this.base.origElements.appendChild(mainText.el);

    this.base.subscribe('editableInput', (e) => {
      if (e instanceof InputEvent) {
        const el = this.base.getSelectedParentElement();
        const hasContent = el.textContent.length > 0;

        if (el === title.el) {
          title.togglePlaceholder(!hasContent);
        } else if (el === leadText.el) {
          leadText.togglePlaceholder(!hasContent);
        } else if (el === mainText.el) {
          mainText.togglePlaceholder(!hasContent);
        } else {
          el.classList.remove('medium-post-placeholder');
        }
      }
    });
  }
}

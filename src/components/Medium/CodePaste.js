import MediumEditor from 'medium-editor';

export default class CodePaste extends MediumEditor.Extension {
  name = 'CodePaste';

  init() {
    this.base.subscribe('editablePaste', (e) => {
      e.currentTarget.querySelectorAll('pre')
        .forEach((pre) => {
          const nodes = Array.from(pre.childNodes);
          let result = '';

          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].nodeType === 1) {
              result = `${result}${nodes[i].textContent}\r\n`;
            } else {
              result += nodes[i].textContent;
            }
          }

          pre.innerHTML = result;
        });
    });
  }
}

import FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';

export default class FTVFolder extends FTVNode {
  private content: HTMLDivElement;

  constructor(name: string, children: [FTVFolder | FTVFile] | [] = []) {
    super(name);

    this.content = document.createElement('div');
    this.content.append(...children);
    this.appendChild(this.content);

    this.append = this.append.bind(this.content);
    this.appendChild = this.appendChild.bind(this.content);
  }

  isExpanded() {
    return this.hasAttribute('expanded');
  }

  toggleExpanded() {
    this.toggleAttribute('expanded');
  }

  clear() {
    this.content.childNodes.forEach((childNode) => {
      childNode.remove();
    });
  }
}

customElements.define('ftv-folder', FTVFolder);

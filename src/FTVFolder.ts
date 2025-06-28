import FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';

export type FTVNodes = [FTVFolder | FTVFile] | [];

export default class FTVFolder extends FTVNode {
  private content: FTVRef;

  constructor(name: string, children: FTVNodes = []) {
    super(name);

    this.content = new FTVRef(false);
    this.content.classList.add('content');
    this.content.append(...children);
    this.appendChild(this.content);
  }

  isExpanded() {
    return this.hasAttribute('expanded');
  }

  toggleExpanded() {
    this.toggleAttribute('expanded');
  }

  addContent(content: FTVNodes) {
    this.content.append(...content);
  }

  clear() {
    this.content.childNodes.forEach((childNode) => {
      childNode.remove();
    });
  }
}

customElements.define('ftv-folder', FTVFolder);

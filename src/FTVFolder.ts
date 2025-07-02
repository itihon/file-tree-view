import FTVNode from './FTVNode.js';

export default class FTVFolder extends FTVNode {
  constructor(name: string, children: [FTVNode] | [] = []) {
    super(name, children);
  }

  isExpanded() {
    return this.hasAttribute('expanded');
  }

  toggleExpanded() {
    this.toggleAttribute('expanded');
  }

  expand() {
    this.toggleAttribute('expanded', true);
  }

  collapse() {
    this.toggleAttribute('expanded', false);
  }

  addContent(content: [FTVNode] | [] = []) {
    super.addContent(content);
  }

  getContent() {
    return super.getContent()!; // if FTVNode is folder, content container exists
  }

  clearContent() {
    super.clearContent();
  }
}

customElements.define('ftv-folder', FTVFolder);

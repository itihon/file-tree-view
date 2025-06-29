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

  addContent(content: [FTVNode] | [] = []) {
    super.addContent(content);
  }

  clearContent() {
    super.clearContent();
  }
}

customElements.define('ftv-folder', FTVFolder);

import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';

export default class FTVFolder extends FTVNode {
  private content: FTVRef<FTVNode> | null = null;

  addContent(content: [FTVNode] | [] = []) {
    if (!this.content) {
      this.createContent(...content);
    } else {
      this.content.append(...content);
    }
  }

  getContent() {
    return this.content;
  }

  clearContent() {
    if (this.content) {
      while (this.content.firstChild) {
        this.content.firstChild.remove();
      }
    }
  }

  private createContent(...nodes: Node[]) {
    this.content = new FTVRef(false);
    this.content.classList.add('content');
    this.content.append(...nodes);
    this.appendChild(this.content);
  }

  constructor(name: string, children: [FTVNode] | [] = []) {
    super(name, true);
    this.createContent(
      ...children,
      ...Array.from(this.children).filter(
        (child) => !(child instanceof FTVRef),
      ), // filter out the label alreade created in the parend class constructor
    );
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
}

customElements.define('ftv-folder', FTVFolder);

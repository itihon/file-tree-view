import type FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';

export default class FTVFolder extends FTVNode {
  private content: FTVRef<FTVNode>;

  addContent(
    content: FTVFile | FTVFolder | Array<FTVFile | FTVFolder> | [] = [],
  ) {
    if (Array.isArray(content)) {
      this.content.append(...content);
    } else {
      this.content.appendChild(content);
    }
  }

  getContent(): FTVRef<FTVNode> {
    return this.content;
  }

  clearContent() {
    while (this.content.firstChild) {
      this.content.firstChild.remove();
    }
  }

  constructor(name: string, children: [FTVFile | FTVFolder] | [] = []) {
    super(name, true);

    this.content = new FTVRef(false);
    this.content.classList.add('content');
    this.content.append(
      ...children,
      ...Array.from(this.children).filter(
        (child) => !(child instanceof FTVRef), // filter out the label alreade created in the parend class constructor
      ),
    );
    this.appendChild(this.content);
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

import type FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';

declare global {
  interface HTMLElementEventMap {
    expand: CustomEvent<undefined>;
    collapse: CustomEvent<undefined>;
  }
}

const eventOpts = { bubbles: true };

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

  get length() {
    return this.content.children.length;
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

  isExpanded(): boolean {
    return this.hasAttribute('expanded');
  }

  toggleExpanded() {
    if (this.toggleAttribute('expanded')) {
      this.dispatchEvent(new CustomEvent('expand', eventOpts));
    } else {
      this.dispatchEvent(new CustomEvent('collapse', eventOpts));
    }
  }

  expand() {
    if (!this.isExpanded()) {
      this.toggleAttribute('expanded', true);
      this.dispatchEvent(new CustomEvent('expand', eventOpts));
    }
  }

  collapse() {
    if (this.isExpanded()) {
      this.toggleAttribute('expanded', false);
      this.dispatchEvent(new CustomEvent('collapse', eventOpts));
    }
  }
}

customElements.define('ftv-folder', FTVFolder);

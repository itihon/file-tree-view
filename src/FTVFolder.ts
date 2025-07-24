import type FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';

interface FTVFolderToggleEventDetail {
  path: string;
}

declare global {
  interface HTMLElementEventMap {
    expand: CustomEvent<FTVFolderToggleEventDetail>;
    collapse: CustomEvent<FTVFolderToggleEventDetail>;
  }
}

export default class FTVFolder extends FTVNode {
  private content: FTVRef<FTVNode>;

  private dispatch(type: string) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        detail: {
          path: this.getRelativePath(),
        },
      }),
    );
  }

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
    if (this.toggleAttribute('expanded')) {
      this.dispatch('expand');
    } else {
      this.dispatch('collapse');
    }
  }

  expand() {
    this.toggleAttribute('expanded', true);
    this.dispatch('expand');
  }

  collapse() {
    this.toggleAttribute('expanded', false);
    this.dispatch('collapse');
  }
}

customElements.define('ftv-folder', FTVFolder);

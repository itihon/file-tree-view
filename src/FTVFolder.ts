import type FileTreeView from './FileTreeView.js';
import type FTVFile from './FTVFile.js';
import FTVNode from './FTVNode.js';
import FTVRef from './FTVRef.js';
import stateRegistry from './StateRegistry.js';

declare global {
  interface HTMLElementEventMap {
    expand: CustomEvent<undefined>;
    collapse: CustomEvent<undefined>;
  }
}

const eventOpts = { bubbles: true };

function getExpandedState(
  container: FileTreeView,
  path: string,
): boolean | undefined {
  const states = stateRegistry.get(container);

  if (states) {
    const state = states.get('expanded');

    if (state) {
      return state.get(path);
    }
  }
}

function saveExpandedState(
  container: FileTreeView,
  path: string,
  value: boolean,
): boolean {
  const states = stateRegistry.get(container);

  if (states) {
    const state = states.get('expanded');

    if (state) {
      state.set(path, value);
      return true;
    }
  }
  return false;
}

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

  connectedCallback() {
    super.connectedCallback();

    if (this.isExpanded()) return; // component was created with the attribute "expanded" in html markup

    const container = this.getTreeViewContainer();
    const path = this.getRelativePath();

    if (container) {
      if (getExpandedState(container, path)) {
        this.expand();
      } else {
        this.collapse();
      }
    }
  }

  disconnectedCallback() {
    const container = this.getTreeViewContainer();
    const path = this.getRelativePath();

    if (container) {
      saveExpandedState(container, path, this.isExpanded());
    }

    super.disconnectedCallback();
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

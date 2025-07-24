import type FTVFolder from './FTVFolder';
import FTVRef from './FTVRef';

export default class FTVNode extends FTVRef<FTVNode> {
  private expandable = false;
  private label: FTVRef<FTVNode>;
  private path = '';

  private initPath() {
    let node: FTVNode = this;
    let path = '';

    while (node instanceof FTVNode) {
      path = '/' + node.getName() + path;
      node = node.getContainingFolder() as FTVNode;
    }

    return path;
  }

  constructor(name: string, expandable = false) {
    super(true);

    const nodeName = name || this.getAttribute('name') || '';

    this.label = new FTVRef(false);
    this.label.classList.add('label', 'noselect');
    this.insertAdjacentElement('afterbegin', this.label);
    this.setName(nodeName);
    this.setAttribute('name', nodeName);

    this.tabIndex = -1;
    this.expandable = expandable;
  }

  connectedCallback() {
    this.path = this.initPath();
  }

  getContainingFolder(): FTVFolder | null {
    const parentElement = this.parentElement as FTVRef<FTVNode> | null;

    if (parentElement instanceof FTVRef) {
      return parentElement.getNode() as FTVFolder | null;
    }

    return null;
  }

  getName(): string {
    return this.label.textContent!;
  }

  isSelected() {
    return this.hasAttribute('selected');
  }

  toggleSelected() {
    this.toggleAttribute('selected');
  }

  select() {
    this.toggleAttribute('selected', true);
  }

  deselect() {
    this.toggleAttribute('selected', false);
  }

  isFocused() {
    return document.activeElement === this;
  }

  setName(name: string) {
    if (name.trim().length === 0) {
      throw new Error('File or folder name cannot be empty');
    }
    this.label.textContent = name;
  }

  getRelativePath(): string {
    return this.path;
  }

  isFolder(): this is FTVFolder {
    return this.expandable;
  }
}

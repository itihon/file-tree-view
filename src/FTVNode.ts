import type FTVFolder from './FTVFolder';
import FTVRef from './FTVRef';

export default class FTVNode extends FTVRef<FTVNode> {
  private expandable = false;
  private label: FTVRef<FTVNode> | null = null;

  private createLabel(nodeName: string = '') {
    this.label = new FTVRef(false);
    this.label.classList.add('label', 'noselect');
    this.insertAdjacentElement('afterbegin', this.label);
    this.setName(nodeName);
  }

  constructor(name: string, expandable = false) {
    super(true);

    const nodeName = name || this.getAttribute('name') || '';

    this.createLabel(nodeName);
    this.setAttribute('name', nodeName);

    this.tabIndex = -1;
    this.expandable = expandable;
  }

  getContainingFolder(): FTVFolder | null {
    const parentElement = this.parentElement as FTVRef<FTVNode> | null;

    if (parentElement instanceof FTVRef) {
      return parentElement.getNode() as FTVFolder | null;
    }

    return null;
  }

  getName() {
    if (this.label) return this.label.textContent;
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
    if (!this.label) {
      this.createLabel(name);
    } else {
      this.label.textContent = name;
    }
  }

  getRelativePath() {
    let node: FTVNode = this;
    let path = '';

    while (node instanceof FTVNode) {
      path = '/' + node.getName() + path;
      node = node.getContainingFolder() as FTVNode;
    }

    return path;
  }

  isFolder(): this is FTVFolder {
    return this.expandable;
  }
}

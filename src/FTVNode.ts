import type FTVFolder from './FTVFolder';
import FTVRef from './FTVRef';

export default class FTVNode extends FTVRef<FTVNode> {
  private label: FTVRef<FTVNode> | null = null;
  private content: FTVRef<FTVNode> | null = null;

  protected addContent(content: [FTVNode] | [] = []) {
    if (!this.content) {
      this.createContent(...content);
    } else {
      this.content.append(...content);
    }
  }

  protected getContent() {
    return this.content;
  }

  protected clearContent() {
    if (this.content) {
      while (this.content.firstChild) {
        this.content.firstChild.remove();
      }
    }
  }

  private createLabel(nodeName: string = '') {
    this.label = new FTVRef(false);
    this.label.classList.add('label', 'noselect');
    this.insertAdjacentElement('afterbegin', this.label);
    this.setName(nodeName);
  }

  private createContent(...nodes: Node[]) {
    this.content = new FTVRef(false);
    this.content.classList.add('content');
    this.content.append(...nodes);
    this.appendChild(this.content);
  }

  constructor(name: string, children: [FTVNode] | [] | undefined = undefined) {
    super(true);

    const nodeName = name || this.getAttribute('name') || '';

    // execution order of createContent and createLabel functions must be held
    if (children) {
      // by presense of children, the node's type can be defined: folder|file
      this.createContent(...children, ...this.children);
    }
    this.createLabel(nodeName);

    this.tabIndex = -1;
    this.setAttribute('name', nodeName);
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
      node = node.parentNode as FTVNode;
    }

    return path;
  }

  isFolder(): this is FTVFolder {
    return this.content !== null;
  }
}

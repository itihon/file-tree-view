import FTVRef from './FTVRef';

export default class FTVNode extends FTVRef {
  private label: FTVRef | null = null;
  private content: FTVRef | null = null;

  protected addContent(content: [FTVNode] | [] = []) {
    if (!this.content) {
      this.createContent(...content);
    } else {
      this.content.append(...content);
    }
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
      this.createContent(...children, ...this.children);
    }
    this.createLabel(nodeName);

    this.setAttribute('name', nodeName);
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
}

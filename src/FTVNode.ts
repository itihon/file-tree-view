import FTVRef from './FTVRef';

export default class FTVNode extends FTVRef {
  private label: FTVRef;

  constructor(name: string) {
    super(true);
    this.label = new FTVRef(false);
    this.label.classList.add('label', 'noselect');
    this.label.textContent = name;
    this.appendChild(this.label);
    this.setAttribute('name', name);
  }

  getName() {
    return this.label.textContent;
  }

  isSelected() {
    return this.hasAttribute('selected');
  }

  setName(name: string) {
    this.label.textContent = name;
  }

  toggleSelected() {
    this.toggleAttribute('selected');
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

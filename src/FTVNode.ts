export default class FTVNode extends HTMLElement {
  private label: HTMLLabelElement;

  constructor(name: string) {
    super();
    this.label = document.createElement('label');
    this.label.classList.add('noselect');
    this.label.textContent = name;
    this.append(this.label);
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

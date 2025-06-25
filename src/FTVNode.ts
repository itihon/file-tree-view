export default class FTVNode extends HTMLElement {
  private name:string;

  constructor(name:string) {
    super();
    this.name = name;
    this.setAttribute('name', name);
  }

  getName() {
    return this.name;
  }

  isSelected() {
    return this.hasAttribute('selected');
  }

  setName(name:string) {
    this.name = name;
  }

  toggleSelected() {
    this.toggleAttribute('selected');
  }
}


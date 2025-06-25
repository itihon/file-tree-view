export default class FTVNode extends HTMLElement {
  private name:string;
  private selected:boolean = false;

  constructor(name:string) {
    super();
    this.name = name;
    this.setAttribute('name', name);
  }

  getName() {
    return this.name;
  }

  isSelected() {
    return this.selected;
  }

  setName(name:string) {
    this.name = name;
  }

  setSelected(selected:boolean) {
    this.selected = selected;
  }
}


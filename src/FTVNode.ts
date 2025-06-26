import FTVLabel from "./FTVLabel";

export default class FTVNode extends HTMLElement {
  private label: FTVLabel;

  constructor(name: string) {
    super();
    this.label = new FTVLabel(name);
    this.append(this.label);
    this.setAttribute("name", name);
  }

  getName() {
    return this.label.textContent;
  }

  isSelected() {
    return this.hasAttribute("selected");
  }

  setName(name: string) {
    this.label.textContent = name;
  }

  toggleSelected() {
    this.toggleAttribute("selected");
  }
}

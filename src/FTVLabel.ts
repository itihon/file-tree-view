export default class FTVLabel extends HTMLElement {
  constructor(label: string) {
    super();

    this.append(label);
    this.classList.add("noselect");
  }
}

customElements.define("ftv-label", FTVLabel);

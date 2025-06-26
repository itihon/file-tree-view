export default class FTVLabel extends HTMLElement {
  constructor(label: string) {
    super();

    this.append(label);
  }
}

customElements.define("ftv-label", FTVLabel);

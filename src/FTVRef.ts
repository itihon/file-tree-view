type GetNode = () => HTMLElement | null;

export default class FTVRef extends HTMLElement {
  public getNode: GetNode;

  private getSelfRef() {
    return this;
  }

  private getParentRef() {
    return this.parentNode as HTMLElement | null;
  }

  constructor(isSelf: boolean) {
    super();

    if (isSelf) {
      this.getNode = this.getSelfRef;
    } else {
      this.getNode = this.getParentRef;
    }
  }
}

customElements.define('ftv-auxiliary', FTVRef);

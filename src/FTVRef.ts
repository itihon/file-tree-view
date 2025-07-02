export default class FTVRef<T extends FTVRef<T>> extends HTMLElement {
  public getNode: () => T | null;

  private getSelfRef(): T {
    return this as unknown as T;
  }

  private getParentRef(): T | null {
    return this.parentNode as unknown as T | null;
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

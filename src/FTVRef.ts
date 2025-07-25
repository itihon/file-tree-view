import type FileTreeView from './FileTreeView';

export default class FTVRef<T extends FTVRef<T>> extends HTMLElement {
  private getSelfRef(): T {
    return this as unknown as T;
  }

  private getParentRef(): T | null {
    return this.parentNode as unknown as T | null;
  }

  private treeViewContainer: FileTreeView | null = null;

  public getNode: () => T | null;

  public getTreeViewContainer(): FileTreeView | null {
    return this.treeViewContainer;
  }

  connectedCallback() {
    let currentNode: typeof this | FileTreeView = this;

    while (
      currentNode &&
      currentNode.tagName.toLowerCase() !== 'file-tree-view'
    ) {
      currentNode = currentNode.parentElement as typeof this | FileTreeView;
    }

    if (!(currentNode instanceof FTVRef)) {
      this.treeViewContainer = currentNode;
    }
  }

  disconnectedCallback() {
    this.treeViewContainer = null;
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

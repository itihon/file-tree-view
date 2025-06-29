import FTVFile from './FTVFile.js';
import FTVFolder from './FTVFolder.js';
import './themes/default.css';

type FileTreeNode = {
  name: string;
  selected?: boolean;
};

export type FileNode = {
  type: 'file';
} & FileTreeNode;

type FileOrFolder = FileNode | FolderNode;
type FolderOrFileTreeView = FTVFolder | FileTreeView;

export type FolderNode = {
  type: 'folder';
  expanded?: boolean;
  children?: FileOrFolder[];
} & FileTreeNode;

export default class FileTreeView extends HTMLElement {
  private selectedItem: FTVFile | FTVFolder | null = null;

  load(
    tree: FolderNode,
    root: FolderOrFileTreeView = this,
    withRootNode = true,
  ) {
    const { children, name } = tree;
    let currentNode: FolderOrFileTreeView = root;

    if (withRootNode) {
      const folder = new FTVFolder(name);
      currentNode.addContent([folder]);
      currentNode = folder;
    } else {
      currentNode = root;
    }

    if (children) {
      children.forEach((child) => {
        const { type, name } = child;

        if (type === 'file') {
          const file = new FTVFile(name);
          currentNode.addContent([file]);
        } else {
          this.load(child, currentNode);
        }
      });
    }
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  addContent(content: [HTMLElement] | [] = []) {
    this.append(...content);
  }

  constructor() {
    super();

    this.addEventListener('click', (event) => {
      const target = event.target as FTVFile | FTVFolder;

      // prevent clicks on folders's content area
      if (target.classList.contains('content')) {
        return;
      }

      const node = target.getNode() as FTVFile | FTVFolder;

      if (node instanceof FTVFolder) {
        node.toggleExpanded();

        if (!node.isExpanded()) {
          node.clearContent();
        }
      }

      if (this.selectedItem) {
        if (this.selectedItem.isSelected()) {
          this.selectedItem.toggleSelected();
        }
      }

      this.selectedItem = node;

      if (!this.selectedItem.isSelected()) {
        this.selectedItem.toggleSelected();
      }
    });
  }
}

customElements.define('file-tree-view', FileTreeView);

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

  private getLastVisibleNode(folder: FTVFolder): FTVFile | FTVFolder {
    if (folder.isExpanded()) {
      const content = folder.getContent();

      if (content.children.length) {
        const lastChild = content.lastElementChild as FTVFile | FTVFolder;

        if (lastChild.isFolder()) {
          return this.getLastVisibleNode(lastChild);
        }

        return lastChild;
      } else {
        return folder;
      }
    }

    return folder;
  }

  private getNextVisibleNode(node: FTVFile | FTVFolder): FTVFile | FTVFolder {
    const nextNode = node.nextElementSibling as FTVFile | FTVFolder | null;

    if (nextNode) {
      return nextNode;
    }

    const containingFolder = node.getContainingFolder();

    if (containingFolder) {
      const isNotRootFolder = containingFolder.getContainingFolder() !== null;

      if (isNotRootFolder) {
        return this.getNextVisibleNode(containingFolder);
      }
    }

    return node;
  }

  private focusPrevious(currentNode: FTVFile | FTVFolder) {
    const previousNode = currentNode.previousElementSibling as
      | FTVFile
      | FTVFolder
      | null;

    if (previousNode) {
      if (previousNode.isFolder()) {
        this.getLastVisibleNode(previousNode).focus();
      } else {
        previousNode.focus();
      }
    } else {
      const containingFolder = currentNode.getContainingFolder();

      if (containingFolder) {
        containingFolder.focus();
      }
    }
  }

  private focusNext(currentNode: FTVFile | FTVFolder) {
    if (currentNode.isFolder()) {
      if (currentNode.isExpanded()) {
        const content = currentNode.getContent();

        if (content.children.length) {
          const firstChild = content.firstElementChild as FTVFile | FTVFolder;

          firstChild.focus();
        } else {
          this.getNextVisibleNode(currentNode).focus();
        }
      } else {
        this.getNextVisibleNode(currentNode).focus();
      }
    } else {
      this.getNextVisibleNode(currentNode).focus();
    }
  }

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

      if (node && node.isFolder()) {
        node.toggleExpanded();
      }

      if (this.selectedItem) {
        this.selectedItem.deselect();
      }

      this.selectedItem = node;
      this.selectedItem.select();
    });

    this.addEventListener('keydown', (event) => {
      const focusedElement =
        document.activeElement === this
          ? (this.firstElementChild as FTVFile | FTVFolder)
          : (document.activeElement as FTVFile | FTVFolder);

      if (focusedElement) {
        const node = focusedElement.getNode() as FTVFile | FTVFolder;

        if (node) {
          if (event.code === 'ArrowUp') {
            this.focusPrevious(node);
          }
          if (event.code === 'ArrowDown') {
            this.focusNext(node);
          }
        }
      }
    });

    this.tabIndex = 0;
  }
}

customElements.define('file-tree-view', FileTreeView);

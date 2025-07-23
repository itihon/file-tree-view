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

const preventScroll: FocusOptions = { preventScroll: true };
const nearest: ScrollIntoViewOptions = { block: 'nearest' };

const sortBy = (field: 'name' | 'type', order: 'asc' | 'desc' = 'desc') =>
  order === 'desc'
    ? (a: FileOrFolder, b: FileOrFolder) =>
        a[field] < b[field] ? -1 : a[field] > a[field] ? 1 : 0
    : (a: FileOrFolder, b: FileOrFolder) =>
        a[field] > b[field] ? -1 : a[field] < a[field] ? 1 : 0;

const sortByName = sortBy('name');
const sortByType = sortBy('type', 'asc');

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
      const nextUpperLevelNode = this.getNextVisibleNode(containingFolder);

      if (nextUpperLevelNode === containingFolder) {
        return node;
      }

      return nextUpperLevelNode;
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
        this.getLastVisibleNode(previousNode).focus(preventScroll);
      } else {
        previousNode.focus(preventScroll);
      }
    } else {
      const containingFolder = currentNode.getContainingFolder();

      if (containingFolder) {
        containingFolder.focus(preventScroll);
      }
    }
  }

  private focusNext(currentNode: FTVFile | FTVFolder) {
    if (currentNode.isFolder()) {
      if (currentNode.isExpanded()) {
        const content = currentNode.getContent();

        if (content.children.length) {
          const firstChild = content.firstElementChild as FTVFile | FTVFolder;

          firstChild.focus(preventScroll);
        } else {
          this.getNextVisibleNode(currentNode).focus(preventScroll);
        }
      } else {
        this.getNextVisibleNode(currentNode).focus(preventScroll);
      }
    } else {
      this.getNextVisibleNode(currentNode).focus(preventScroll);
    }
  }

  load(
    tree: FolderNode,
    root: FolderOrFileTreeView = this,
    withRootNode = true,
    sort = false,
  ) {
    const { children, name } = tree;
    let currentNode: FolderOrFileTreeView = root;

    if (withRootNode) {
      const folder = new FTVFolder(name);
      currentNode.addContent(folder);
      currentNode = folder;
    } else {
      currentNode = root;
    }

    if (children) {
      (sort ? children.sort(sortByName).sort(sortByType) : children).forEach(
        (child) => {
          const { type, name } = child;

          if (type === 'file') {
            const file = new FTVFile(name);
            currentNode.addContent(file);
          } else {
            this.load(child, currentNode);
          }
        },
      );
    }
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  getNodeByPath(path: string): FTVFile | FTVFolder | null {
    let currentNode: FTVFile | FTVFolder | null = null;

    const folderNames = path.split('/');
    for (const folderName of folderNames) {
      if (folderName) {
        if (currentNode instanceof FTVFolder) {
          currentNode = currentNode
            .getContent()
            .querySelector(`:scope > [name="${folderName}"]`) as
            | FTVFile
            | FTVFolder
            | null;
        } else {
          const rootNode = this.firstElementChild as
            | FTVFolder
            | FTVFolder
            | null;

          if (rootNode) {
            if (rootNode.getAttribute('name') === folderName) {
              currentNode = rootNode;
            } else break;
          } else break;
        }
      }
    }

    return currentNode;
  }

  addContent(content: FTVFile | FTVFolder) {
    if (this.firstElementChild) {
      throw new Error('This tree-view already has a root element.');
    }

    this.appendChild(content);
  }

  addNode(path: string, name: string, type: 'file' | 'folder') {
    const node = path === '/' || path === '' ? this : this.getNodeByPath(path);

    if (!node) {
      throw new Error(`Path ${path} not found.`);
    }

    if (node === this && this.firstElementChild) {
      throw new Error('This tree-view already has a root element.');
    }

    if (!(node instanceof FTVFolder) && node !== this) {
      throw new Error(`Path ${path} is not a folder.`);
    }

    if (type === 'file') {
      const file = new FTVFile(name);
      node.addContent(file);
    }

    if (type === 'folder') {
      const folder = new FTVFolder(name);
      node.addContent(folder);
    }
  }

  removeNode(path: string) {
    const node = this.getNodeByPath(path);

    if (!node) {
      throw new Error(`Path ${path} not found.`);
    }

    node.remove();
  }

  constructor() {
    super();

    this.addEventListener('click', (event) => {
      const target = event.target as FTVFile | FTVFolder | FileTreeView;

      // prevent clicks on the container itself
      if (target instanceof FileTreeView) {
        return;
      }

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
      if (event.code !== 'Tab') {
        event.preventDefault();
      }

      const targetNode =
        event.target === this
          ? (this.firstElementChild as FTVFile | FTVFolder | null)
          : (event.target as FTVFile | FTVFolder);

      if (targetNode) {
        const node = targetNode.getNode() as FTVFile | FTVFolder;

        if (node) {
          if (event.code === 'ArrowUp') {
            this.focusPrevious(node);
          }

          if (event.code === 'ArrowDown') {
            this.focusNext(node);
          }

          if (event.code === 'ArrowLeft') {
            if (node.isFolder() && node.isExpanded()) {
              node.collapse();
            } else {
              const containingFolder = node.getContainingFolder();

              if (containingFolder) {
                containingFolder.focus(preventScroll);
              }
            }
          }

          if (event.code === 'ArrowRight') {
            if (node.isFolder()) {
              if (!node.isExpanded()) {
                node.expand();
              } else {
                const firstChild = node.getContent().firstElementChild as
                  | FTVFile
                  | FTVFolder;

                if (firstChild) {
                  firstChild.focus(preventScroll);
                }
              }
            }
          }

          if (event.code === 'Home') {
            const firstChild = this.firstElementChild as
              | FTVFile
              | FTVFolder
              | null;

            if (firstChild) {
              firstChild.focus();
            }
          }

          if (event.code === 'End') {
            const lastChild = this.lastElementChild as
              | FTVFile
              | FTVFolder
              | null;

            if (lastChild) {
              if (lastChild.isFolder()) {
                this.getLastVisibleNode(lastChild).focus();
              } else {
                lastChild.focus();
              }
            }
          }
        }
      }
    });

    this.addEventListener('focusin', (event) => {
      const target = event.target as FTVFile | FTVFolder;
      const label = target.firstElementChild!;
      const horizontalScroll = this.scrollLeft;
      label.scrollIntoView(nearest);
      this.scrollLeft = horizontalScroll;
    });

    this.tabIndex = 0;
  }
}

customElements.define('file-tree-view', FileTreeView);

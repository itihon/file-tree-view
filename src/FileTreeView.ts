import FTVFile from "./FTVFile.js";
import FTVFolder from "./FTVFolder.js";
import "./themes/default.css";

type FileTreeNode = {
  name: string,
  selected?: boolean,
}

type FileNode = { 
  type: 'file' 
} & FileTreeNode;

type FileOrFolder = FileNode | FolderNode;

type FolderNode = { 
  type: 'folder', 
  expanded?:boolean, 
  children?: FileOrFolder[],
} & FileTreeNode; 

export default class FileTreeView extends HTMLElement {
  private selectedItem:FTVFile | FTVFolder | null = null;

  load(tree:FolderNode, root:HTMLElement = this) {
    const { children, name } = tree;
    let parentNode = root;

    const folder = new FTVFolder(name);
    parentNode.appendChild(folder);

    parentNode = folder;

    if (children) {
      children.forEach(
        child => {
          const { type, name } = child;

          if (type === "file") {
            const file = new FTVFile(name);
            parentNode.appendChild(file);
          }
          else {
            this.load(child, folder);
          }
        }
      )
    }
  }

  connectedCallback() {
    this.addEventListener('click', event => {
      const target = event.target as FTVFile | FTVFolder;

      if (target instanceof FTVFolder) {
        target.toggleExpanded();
      }

      if (this.selectedItem) {
        if (this.selectedItem.isSelected()) {
          this.selectedItem.toggleSelected();
        }
      }
      
      this.selectedItem = target;
        
      if (!this.selectedItem.isSelected()) {
        this.selectedItem.toggleSelected();
      }
      
    });
  }
}

customElements.define('file-tree-view', FileTreeView);

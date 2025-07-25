import type {FileNode, FolderNode} from "../../../src/FileTreeView";
import FTVFolder from "../../../src/FTVFolder";
import FileTreeView from "../../../src/index";
import tree from "../../fixtures/1-file-tree-view";

async function treeFromDir(dirHandle:FileSystemDirectoryHandle):Promise<FolderNode> {
  const tree = {} as FolderNode;

  tree.type = 'folder';
  tree.name = dirHandle.name;
  tree.children = [];

  for await (let entry of dirHandle.entries()) {
    const [name, fsHandle] = entry;

    if (fsHandle instanceof FileSystemDirectoryHandle) {
      // const childTree = await treeFromEntries(fsHandle);
      const childTree:FolderNode = { type: 'folder', name: fsHandle.name };
      tree.children.push(childTree);
    }

    if (fsHandle instanceof FileSystemFileHandle) {
      const file:FileNode = { type: 'file', name: fsHandle.name };
      tree.children.push(file);
    }
  }

  return tree; 
}

async function openDirectory() {
  if (!('showDirectoryPicker' in window)) {
    throw new Error('showDirectoryPicker is not available.');
  }

  directoryHandle = await showDirectoryPicker();
  directoryHandle.getFileHandle('README.md').then(console.log);

  return treeFromDir(directoryHandle);
}

let directoryHandle:FileSystemDirectoryHandle;
const fileTreeView = new FileTreeView();
const openFolderBtn = document.createElement('button');

openFolderBtn.textContent = 'Open directory';
document.body.appendChild(openFolderBtn);

// fileTreeView.load(tree);
document.body.append(fileTreeView);

openFolderBtn.addEventListener('click', async () => {
  const tree = await openDirectory();
  fileTreeView.load(tree, undefined, undefined, true);
});

fileTreeView.addEventListener('expand', async event => {
  const folder = event.target;

  if (folder instanceof FTVFolder && folder.length === 0) {
    const path = folder.getRelativePath();
    const dirNames = path.substring(1).split('/');
    let dirHandle:FileSystemDirectoryHandle = directoryHandle;

    for (let dirName of dirNames) {
      if (dirName === directoryHandle.name) continue; 
      
      dirHandle = await dirHandle.getDirectoryHandle(dirName);
    }

    if (dirHandle.name !== directoryHandle.name) {
      const tree = await treeFromDir(dirHandle);
      requestAnimationFrame(() => {
        fileTreeView.load(tree, folder, false, true);
      });
    }
    else {
      const tree = await treeFromDir(directoryHandle);
      requestAnimationFrame(() => {
        fileTreeView.load(tree, folder, false, true);
      });
    }
  }
});

fileTreeView.addEventListener('collapse', event => {
  const folder = event.target;
  if (folder instanceof FTVFolder) {
    folder.clearContent();
  }
});

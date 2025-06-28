import type {FileNode, FolderNode} from "../../../src/FileTreeView";
import FTVFolder from "../../../src/FTVFolder";
import FileTreeView from "../../../src/index";

// async function treeFromDir(dirHandle:FileSystemDirectoryHandle):Promise<FolderNode> {
//   const tree = {} as FolderNode;
// 
//   tree.type = 'folder';
//   tree.name = dirHandle.name;
//   tree.children = [];
// 
//   for await (let entry of dirHandle.entries()) {
//     const [name, fsHandle] = entry;
// 
//     if (fsHandle instanceof FileSystemDirectoryHandle) {
//       // const childTree = await treeFromEntries(fsHandle);
//       const childTree:FolderNode = { type: 'folder', name: fsHandle.name };
//       tree.children.push(childTree);
//     }
// 
//     if (fsHandle instanceof FileSystemFileHandle) {
//       const file:FileNode = { type: 'file', name: fsHandle.name };
//       tree.children.push(file);
//     }
//   }
// 
//   return tree; 
// }
// 
// async function openDirectory() {
//   if (!('showDirectoryPicker' in window)) {
//     throw new Error('showDirectoryPicker is not available.');
//   }
// 
//   directoryHandle = await showDirectoryPicker();
// 
//   return treeFromDir(directoryHandle);
// }

// let directoryHandle:FileSystemDirectoryHandle;
// const fileTreeView = new FileTreeView();
// const openFolderBtn = document.querySelector('[openFolder]')!;

// fileTreeView.load(tree);
// document.body.append(fileTreeView);

// openFolderBtn.addEventListener('click', async () => {
//   const tree = await openDirectory();
// });

// fileTreeView.addEventListener('click', async event => {
//   const selectedItem = fileTreeView.getSelectedItem();
// 
//   if (selectedItem instanceof FTVFolder) {
//     const path = selectedItem.getRelativePath();
//     const dirNames = path.substring(1).split('/');
//     let dirHandle:FileSystemDirectoryHandle;
// 
//     for (let dirName of dirNames) {
//       if (dirName === directoryHandle.name) continue; 
// 
//       dirHandle = await directoryHandle.getDirectoryHandle(dirName);
//       fileTreeView.load(await treeFromDir(dirHandle), selectedItem, false);
//     }
//     
//   }
// });
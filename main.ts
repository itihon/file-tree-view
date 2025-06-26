import type {FileNode, FolderNode} from "./src/FileTreeView";
import FileTreeView from "./src/index";

const tree:FolderNode = {
  type: 'folder',
  name: 'folder1',
  children: [
    {
      type: "file",
      name: 'file1',
    },
    {
      type: "folder",
      name: 'folder2',
      children: [
        {
          type: "file",
          name: 'file3',
        },
        {
          type: "file",
          name: 'file4',
        },
        {
          type: "folder",
          name: 'folder3',
        }
      ],
    },
    {
      type: "folder",
      name: 'folder4',
      children: [
        {
          type: "file",
          name: 'file5',
        },
        {
          type: "file",
          name: 'file6',
        },
        {
          type: "folder",
          name: 'folder5',
        }
      ],
    }
  ],
};

async function treeFromEntries(dirHandle:FileSystemDirectoryHandle):Promise<FolderNode> {
  const tree = {} as FolderNode;

  tree.type = 'folder';
  tree.name = dirHandle.name;
  tree.children = [];

  for await (let entry of dirHandle.entries()) {
    const [name, fsHandle] = entry;

    if (fsHandle instanceof FileSystemDirectoryHandle) {
      const childTree = await treeFromEntries(fsHandle);
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

  const dirHandle = await showDirectoryPicker();

  return treeFromEntries(dirHandle);
}

const openFolderBtn = document.querySelector('[openFolder]');

openFolderBtn?.addEventListener('click', async () => {
  const tree = await openDirectory();
  const fileTreeView = new FileTreeView();

  fileTreeView.load(tree);
  document.body.append(fileTreeView);
});


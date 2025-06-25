import FileTreeView from "./src/index";

const tree = {
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

const fileTreeView = new FileTreeView();

fileTreeView.load(tree);

document.body.append(fileTreeView);

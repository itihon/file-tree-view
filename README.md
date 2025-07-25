# file-tree-view
[![License][]](https://opensource.org/licenses/MIT)
[![Build Status]](https://github.com/itihon/file-tree-view/actions/workflows/code-quality-and-test.yml)
[![NPM Package]](https://npmjs.org/package/@itithon/file-tree-view)
[![Code Coverage]](https://codecov.io/gh/itihon/file-tree-view)
[![semantic-release]](https://github.com/semantic-release/semantic-release)

[License]: https://img.shields.io/badge/License-MIT-blue.svg
[Build Status]: https://github.com/itihon/file-tree-view/actions/workflows/code-quality-and-test.yml/badge.svg
[NPM Package]: https://img.shields.io/npm/v/@itihon/file-tree-view.svg
[Code Coverage]: https://codecov.io/gh/itihon/file-tree-view/branch/master/graph/badge.svg
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

> File tree view web component with drag-and-drop feature.

## 🕑 Developing...

## Install

``` shell
npm install @itihon/file-tree-view
```

## Use

### In HTML

``` html
<script type="module" src="/path/to/file-tree-view"></script>

<file-tree-view id="file_explorer">
  <ftv-folder name="folder1" expanded>
      <ftv-file name="file1"></ftv-file>
      <ftv-folder name="folder2" expanded>
          <ftv-file name="file3"></ftv-file>
          <ftv-file name="file4"></ftv-file>
          <ftv-folder name="folder3"></ftv-folder>
      </ftv-folder>
      <ftv-folder name="folder4">
          <ftv-file name="file5"></ftv-file>
          <ftv-file name="file6"></ftv-file>
          <ftv-folder name="folder5"></ftv-folder>
      </ftv-folder>
  </ftv-folder>
</file-tree-view>
```

### In JS or TS

#### Create an instance and add to DOM:

``` js
import FileTreeView from "@itihon/file-tree-view";

const fileTree = new FileTreeFiew();

document.body.append(fileTree);
```

#### or get a reference to an existing instance:

``` js
const fileTree = document.getElementById('file_explorer');
```

<!-- embed-api-docs-start -->
## API

### class `FileTreeView`

```ts
export default class FileTreeView extends HTMLElement  {
  addContent(content: FTVFile | FTVFolder): void;
  addNode(path: string, name: string, type: 'file' | 'folder'): void;
  getNodeByPath(path: string): FTVFile | FTVFolder | null;
  getSelectedItem(): FTVFolder | FTVFile | null;
  load(tree: FolderNode, root?: FolderOrFileTreeView, withRootNode?: boolean, sort?: boolean): void;
  removeNode(path: string): void;
}
```

### class `FTVFile`

```ts
export default class FTVFile extends FTVNode  {
  deselect(): void;
  getContainingFolder(): FTVFolder | null;
  getName(): string;
  getNode: () => T | null;
  getRelativePath(): string;
  getTreeViewContainer(): FileTreeView | null;
  isFocused(): boolean;
  isFolder(): this is FTVFolder;
  isSelected(): boolean;
  select(): void;
  setName(name: string): void;
  toggleSelected(): void;
}
```

### class `FTVFolder`

```ts
export default class FTVFolder extends FTVNode  {
  addContent(content?: FTVFile | FTVFolder | Array<FTVFile | FTVFolder> | []): void;
  clearContent(): void;
  collapse(): void;
  deselect(): void;
  expand(): void;
  get length(): number;
  getContainingFolder(): FTVFolder | null;
  getContent(): FTVRef<FTVNode>;
  getName(): string;
  getNode: () => T | null;
  getRelativePath(): string;
  getTreeViewContainer(): FileTreeView | null;
  isExpanded(): boolean;
  isFocused(): boolean;
  isFolder(): this is FTVFolder;
  isSelected(): boolean;
  select(): void;
  setName(name: string): void;
  toggleExpanded(): void;
  toggleSelected(): void;
}
```
<!-- embed-api-docs-end -->

#### Tree state

``` js
scroll
focus
```

#### Folder state

``` js
name
selected
expanded/collapsed
hovered
hint displayed
context menu displayed
```

#### File state

``` js
name
selected
hovered
hint displayed
context menu displayed
```

#### Events

``` js
fileTree.addEventListener('expand', (e) => {
  const folder = e.target;
  // ...
});

fileTree.addEventListener('collapse', (e) => {
  const folder = e.target;
  // ...
});
```

#### Instance methods

``` js
fileTree.load(/* from file system, from JSON */);
fileTree.createFile(path, fileName);
fileTree.createFolder(path, folderName);
fileTree.cut();
fileTree.copy();
fileTree.copyPath();
fileTree.paste();
fileTree.rename();
fileTree.delete();
```

#### Instance properties

``` js
fileTree.selectedItems
```

#### Features

- [ ] make it a general tree view component, not a file tree view
- [ ] themes
- [x] tab control
- [x] keyboard navigation: [x]up, [x]down, [x]left, [x]right, [x]Home, [x]End, Tabindex for main container
- [x] hover indication
- [ ] multiple selection
- [ ] hint tooltip
- [ ] aria
- [ ] drag and drop
- [ ] context menu
- [ ] icons for specific file types
- [x] loading the first level of file system, and then loading every additional folder level by clicking on it (possible with the expande/collabse events)
- [ ] fs adapter that reflects file system state
- [ ] sorting on [x]load, on [ ]adding content, on [ ]file/folder creation 
- [x] remember expanded child folders when a parent folder gets cleared

## Issues


## Refactor

- [ ] Change type "folder" to "directory" to follow File system API convention
- [ ] Consider changing isExpanded() method to getter. It may allow to check an instance if is folder or file.

## Related

TODO

## Acknowledgments

TODO

## TODO

- the remembering expanded folders feature 
  - probably should be deactivatable 
  - when adding nodes with methods addNode(), addContent() probably should be optional

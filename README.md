# file-tree-view
[![License][]](https://opensource.org/licenses/ISC)
[![Build Status]](https://github.com/itihon/file-tree-view/actions/workflows/ci.yml)
[![NPM Package]](https://npmjs.org/package/file-tree-view)
[![Code Coverage]](https://codecov.io/gh/itihon/file-tree-view)
[![semantic-release]](https://github.com/semantic-release/semantic-release)

[License]: https://img.shields.io/badge/License-ISC-blue.svg
[Build Status]: https://github.com/itihon/file-tree-view/actions/workflows/ci.yml/badge.svg
[NPM Package]: https://img.shields.io/npm/v/file-tree-view.svg
[Code Coverage]: https://codecov.io/gh/itihon/file-tree-view/branch/master/graph/badge.svg
[semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

> File tree view web component with drag-and-drop feature.

## 🕑 Developing...

## Install

``` shell
npm install @itihon/file-tree-view
```

## Use

``` typescript
import { fileTreeView } from 'file-tree-view'
// TODO: describe usage
```

### In HTML

``` html
<script type="module" src="/path/to/file-tree-view.js"></script>

<file-tree-view id="file_explorer" theme="/path/to/theme/">
  <ftv-folder name="folder1">
      <ftv-file name="file1"></ftv-file>
      <ftv-folder name="folder2">
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
fileTree.addEventListener('change', () => {

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
- [ ] tab control
- [x] keyboard navigation: [x]up, [x]down, [x]left, [x]right, [x]Home, [x]End, Tabindex for main container
- [x] hover indication
- [ ] multiple selection
- [ ] hint tooltip
- [ ] aria
- [ ] drag and drop
- [ ] context menu
- [ ] icons for specific file types
- [ ] loading the first level of file system, and then loading every additional folder level by clicking on it
- [ ] fs adapter that reflects file system state
- [ ] sorting on [x]load, on [ ]adding content, on [ ]file/folder creation 

## Issues


## Refactor

- [ ] Change type "folder" to "directory" to follow File system API convention
- [ ] Consider changing isExpanded() method to getter. It may allow to check an instance if is folder or file.

## Related

TODO

## Acknowledgments

TODO

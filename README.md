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
<script type="module" src="/path/to/file-tree-view.js">

<!-- Maybe icons should be defined in the theme ? -->
<file-tree-icons for="file_explorer">
  <file-tree-icon type="js" src="/path/to/icon/js.svg"></file-tree-icon>
  <file-tree-icon type="md" src="/path/to/icon/md.svg"></file-tree-icon>
</file-tree-icons>

<file-tree-view id="file_explorer" theme="/path/to/theme/">
  <ftv-folder name="folder name1">
    
    <ftv-file name="filename.ext"></ftv-file>

    <ftv-folder name="folder name2">
      <ftv-file name="filename.ext"></ftv-file>
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

- [ ] themes
- [ ] tab control
- [ ] keyboard navigation: [x]up, [x]down, [x]left, [x]right, [x]Home, [x]End, Tabindex for main container
- [x] hover indication
- [ ] multiple selection
- [ ] hint tooltip
- [ ] aria
- [ ] drag and drop
- [ ] context menu
- [ ] icons for specific file types

## Related

TODO

## Acknowledgments

TODO

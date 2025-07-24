import FileTreeView from '../../../src/index';
import treeStructure from '../../fixtures/1-file-tree-view';

function asyncForeach(arrayOfAsyncFns = [], eachCb = Function.prototype) {
  let chain = Promise.resolve();

  for (let asyncFn of arrayOfAsyncFns) {
    if (typeof asyncFn !== 'function') {
      console.dir(asyncFn);
      throw new Error(`Expected a function, got ${asyncFn}`);
    }

    chain = chain.then(() => {
      const thenable = asyncFn();

      if (!thenable.then) {
        console.dir(thenable);
        throw new Error(`Expected a thenable, got ${thenable}`);
      }

      return thenable;
    }).then(eachCb);

  }

  return chain;
}

function clean(node)
{
  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if
    (
      child.nodeType === 8
      ||
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}

const visitLocalhost = () => {
  cy.visit('localhost:5173');
};

const clearDocumentBody = () => 
  cy.document().then(document => document.body.innerHTML = '');

const applyStyle = (propertyName, value) => 
  (ftViewCyObj) => {
    const ftView = ftViewCyObj[0];
    ftView.style[propertyName] = value;
    return ftView;
  };

const constructLoadAppend = (tree) => {
  return clearDocumentBody().then(() => {
    return cy.document().then(document => {
      const ftView = new FileTreeView();
      ftView.load(tree);
      document.body.appendChild(ftView);
      return ftView;
    });
  });
};

const constructAppendLoad = (tree) => {
  return clearDocumentBody().then(() => {
    return cy.document().then(document => {
      const ftView = new FileTreeView();
      document.body.appendChild(ftView);
      ftView.load(tree);
      return ftView;
    });
  });
};

const markupLoad = (tree) => {
  return clearDocumentBody().then(() => {
    return cy.document().then(document => {
      document.body.insertAdjacentHTML('beforeend', '<file-tree-view></file-tree-view>');

      return cy.get('file-tree-view').then(([ftView]) => {
        ftView.load(tree);
        return ftView;
      });
    });
  });
};


describe('file-tree-view', () => {
  beforeEach(visitLocalhost);

  it('constructs certain DOM structure from loaded object structure', () => {
    cy.fixture('1-tree-structure.html').then(htmlStructure => {
    
      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => cy
          .get('file-tree-view')
          .should('have.html', htmlStructure),
      );
    });
  });

  it('constructs certain DOM structure from html', () => {
    cy.fixture('1-html-markup.html').then(htmlMarkup => {
      cy.fixture('1-tree-structure.html').then(htmlStructure => {
        cy
          .document()
          .then(document => { document.body.innerHTML = htmlMarkup; clean(document.body) })
          .then(() => {
            cy
              .get('file-tree-view')
              .should('have.html', htmlStructure);
          });
      });
    });
  });

  describe('file-tree-view pointer and keyboard interaction', () => {
    it('expands folders on click and selects folders and files', () => {
      visitLocalhost();
      
      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('file-tree-view')
            .then(applyStyle('height', '100%'))
            .click() // click on the container itself, shouldn't throw an error
            .contains('folder1').click() // folder label click

            .get('[name="folder1"]').should('have.attr', 'expanded') // same folder

            .get('[selected]').should('have.length', 1)
            .should('have.attr', 'name').and('equal', 'folder1') // same folder

            .get('[name="folder2"]').click() // folder click
            .get('[selected]').should('have.length', 1) // same folder
            .should('have.attr', 'expanded') // same folder
            .get('[selected]').should('have.length', 1) // same folder
            .should('have.attr', 'name').and('equal', 'folder2') // same folder

            .get('[name="file1"]').contains('file1').click() // file label click
            .get('[selected]').should('have.length', 1)
            .should('have.attr', 'name').and('equal', 'file1') // same file
            
            .get('[name="file3"]').click() // file click
            .get('[selected]').should('have.length', 1)
            .should('have.attr', 'name').and('equal', 'file3') // same file
        },
      );
    });

    it('moves focus down on arrow down press', () => {
      visitLocalhost();
      
      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('file-tree-view')
            .focus()
            .should('have.focus')
            .get('[name="folder1"]').click()
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file1"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder2"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder4"]')
            .should('have.focus')
            .get('[name="folder2"]').click() // expanded folder with content
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file3"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file4"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder3"]') // last collapsed folder in a nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder4"]')
            .should('have.focus')
            .get('[name="folder3"]').click() // last expanded empty folder in a nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder4"]') // last collapsed folder in the root folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder4"]')
            .should('have.focus')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .addNode('folder1/folder2', 'file7', 'file')
            )
            .get('[name="folder3"]').focus() // not last expanded empty folder in a nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file7"]') // last file in a nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder4"]')
            .should('have.focus')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .addNode('folder1', 'file8', 'file')
            )
            .get('[name="folder4"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file8"]') // last file in the root folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file8"]')
            .should('have.focus')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .addNode('folder1', 'folder6', 'folder')
            )
            .get('[name="file8"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder6"]').click() // last expanded empty folder in the root folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder6"]')
            .should('have.focus')
            .type('{downArrow}')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .removeNode('folder1/folder6')
            )
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .removeNode('folder1/file8')
            )
            .get('[name="folder4"]').click()
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file5"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file6"]')
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder5"]') // very last collapsed folder in the last nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="folder5"]')
            .should('have.focus')
            .click() // very last expanded empty folder in the last nested folder
            .type('{downArrow}')
            .get('[name="folder5"]')
            .should('have.focus')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .removeNode('folder1/folder4/folder5')
            )
            .get('[name="file6"]').click() // very last file in the last nested folder
            .should('have.focus')
            .type('{downArrow}')
            .get('[name="file6"]')
            .should('have.focus');
        }
      );
    });

    it('moves focus up on arrow up press', () => {
      visitLocalhost();
      
      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('[name="folder1"]').click()
            .get('[name="folder2"]').click()
            .get('[name="folder4"]').click()
            .get('[name="folder5"]').focus()
            .type('{upArrow}')
            .get('[name="file6"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="file5"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="folder4"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="folder3"]')
            .should('have.focus')
            .click()
            .get('[name="folder4"]').focus()
            .type('{upArrow}')
            .get('[name="folder3"]')
            .should('have.focus')
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .addNode('/folder1/folder2/folder3', 'folder6', 'folder')
            )
            .document()
            .then((document) => document
              .querySelector('file-tree-view')
              .addNode('/folder1/folder2/folder3/folder6', 'file7', 'file')
            )
            .get('[name="folder4"]').focus()
            .type('{upArrow}')
            .get('[name="folder6"]')
            .should('have.focus')
            .click()
            .get('[name="folder4"]').focus()
            .type('{upArrow}')
            .get('[name="file7"]')
            .should('have.focus')
            .get('[name="folder2"]').contains('folder2').click()
            .get('[name="folder4"]').focus()
            .type('{upArrow}')
            .get('[name="folder2"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="file1"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="folder1"]')
            .should('have.focus')
            .type('{upArrow}')
            .get('[name="folder1"]')
            .should('have.focus');
        });
    });

    it('collapses folder and focuses parent folder on left arrow press', () => {
      visitLocalhost();

      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('[name="folder1"]').click()
            .get('[name="folder2"]').click()
            .get('[name="folder3"]').focus()
            .type('{leftArrow}')
            .get('[name="folder2"]')
            .should('have.focus')
            .get('[name="folder3"]').click()
            .should('have.attr', 'expanded')
            .get('[name="folder3"]')
            .type('{leftArrow}')
            .should('have.focus')
            .should('not.have.attr', 'expanded')
            .get('[name="folder3"]')
            .type('{leftArrow}')
            .get('[name="folder2"]')
            .should('have.focus')
            .get('[name="file3"]').click()
            .type('{leftArrow}')
            .get('[name="folder2"]')
            .should('have.focus')
            .should('have.attr', 'expanded')
            .get('[name="folder2"]')
            .type('{leftArrow}')
            .should('have.focus')
            .should('not.have.attr', 'expanded')
            .get('[name="folder2"]')
            .type('{leftArrow}')
            .get('[name="folder1"]')
            .should('have.focus')
            .should('have.attr', 'expanded')
            .get('[name="folder1"]')
            .type('{leftArrow}')
            .should('have.focus')
            .should('not.have.attr', 'expanded')
            .get('[name="folder1"]')
            .type('{leftArrow}')
            .should('have.focus')
            .should('not.have.attr', 'expanded');
        });
    });

    it('expands folder and focuses first child on right arrow press', () => {
      visitLocalhost();

      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('body').press('Tab')
            .get('file-tree-view')
            .should('have.focus')
            .get('[name="folder1"]')
            .should('not.have.focus')
            .should('not.have.attr', 'expanded')
            .get('file-tree-view')
            .type('{rightArrow}')
            .get('[name="folder1"]')
            .should('have.attr', 'expanded')
            .get('[name="folder1"]')
            .type('{rightArrow}')
            .get('[name="file1"]')
            .should('have.focus')
            .type('{rightArrow}')
            .should('have.focus')
            .get('[name="folder2"]').focus()
            .type('{rightArrow}')
            .should('have.focus')
            .type('{rightArrow}')
            .get('[name="file3"]')
            .should('have.focus')
            .get('[name="folder3"]').focus()
            .should('have.focus')
            .should('not.have.attr', 'expanded')
            .get('[name="folder3"]')
            .type('{rightArrow}')
            .should('have.focus')
            .should('have.attr', 'expanded')
            .get('[name="folder3"]')
            .type('{rightArrow}')
            .should('have.focus')
            .get('[name="folder3"]')
            .type('{rightArrow}')
            .should('have.focus')
        });
    });

    it('focuses the first and the last element with Home and End key press', () => {
      visitLocalhost();

      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('[name="folder1"]').click()
            .get('[name="folder2"]').click()
            .get('[name="folder3"]').click()
            .get('body').focus().press('Tab')
            .get('file-tree-view')
            .should('have.focus')
            .type('{Home}')
            .get('[name="folder1"]')
            .should('have.focus')
            .get('body').focus().press('Tab')
            .get('file-tree-view')
            .should('have.focus')
            .type('{End}')
            .get('[name="folder4"]')
            .should('have.focus')
            .click()
            .type('{End}')
            .get('[name="folder5"]')
            .should('have.focus')
            .type('{End}')
            .get('[name="folder5"]')
            .should('have.focus')
            .type('{Home}')
            .get('[name="folder1"]')
            .should('have.focus')
            .type('{Home}')
            .get('[name="folder1"]')
            .should('have.focus');
        });
    });

  });

  describe('API', () => {
    it('adds and removes nodes whith addNode() and removeNode()', () => {
      visitLocalhost();

      const removeNode = (path, name, err) => (res) => {
        const fileTreeView = res[0];

        if (err) {
          expect(() => fileTreeView.removeNode(path + '/' + name)).throw(err);
        }
        else {
          fileTreeView.removeNode(path + '/' + name);
        }

        return cy
          .get('file-tree-view')
          .should('not.have.descendants', `[name=${name}]`);
      };

      const addNode = (path, name, type) => (res) => {
        const fileTreeView = res[0];

        fileTreeView.addNode(path, name, type);

        return cy
          .get('file-tree-view')
          .should('have.descendants', `[name=${name}]`);
      };

      const throwWhenAdding = (path, name, type, err) => (res) => {
        const fileTreeView = res[0];

        expect(() => fileTreeView.addNode(path, name, type)).throw(err);

        return cy
          .get('file-tree-view')
          .should('not.have.descendants', `[name=${name}]`);
      };

      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('file-tree-view')
            .then(removeNode('', 'folder1'))
            .then(addNode('/', 'folder1', 'folder'))
            .get('file-tree-view')
            .then(removeNode('/', 'folder1'))
            .then(addNode('', 'folder1', 'folder'))
            .then(throwWhenAdding('', 'folder2', 'folder', 'This tree-view already has a root element.'))
            .then(throwWhenAdding('folder1/folder2', 'folder3', 'folder', 'Path folder1/folder2 not found.'))
            .then(addNode('folder1', 'file1', 'file'))
            .then(throwWhenAdding('folder1/file1', 'folder3', 'folder', 'Path folder1/file1 is not a folder.'))
            .then(addNode('folder1', 'folder2', 'folder'))
            .then(addNode('/folder1/folder2', 'folder3', 'folder'))
            .then(removeNode('folder1/folder2/folder3', 'folder4', 'Path folder1/folder2/folder3/folder4 not found.'))
            .then(removeNode('/folder1/folder2/', 'folder3'))
            .then(removeNode('folder1', 'folder2'))
            .then(removeNode('folder1', 'file1'))
        });
    });
  });

  describe('Events', () => {
    it.only('fires "expand" and "collapse" events', () => {
      visitLocalhost();

      const listeners = new Set();

      const addExpandListenerOnce = (path) => res => {
        /** @type {FileTreeView} */
        const ftView = res[0];
        const checkPath = e => { 
          expect(e.detail.path).eq(path); 
          listeners.delete(checkPath) 
        };

        listeners.add(checkPath);
        ftView.addEventListener('expand', checkPath, { once: true });

        return ftView;
      };
      
      const addCollapseListenerOnce = (path) => res => {
        /** @type {FileTreeView} */
        const ftView = res[0];
        const checkPath = e => { 
          expect(e.detail.path).eq(path); 
          listeners.delete(checkPath) 
        };

        listeners.add(checkPath);
        ftView.addEventListener('collapse', checkPath, { once: true });

        return ftView;
      };

      const expectListenerAdded = () => { expect(listeners.size).eq(1); };
      const expectAllListenersCalled = () => { expect(listeners.size).eq(0); };

      asyncForeach(
        [
          () => constructLoadAppend(treeStructure),
          () => constructAppendLoad(treeStructure),
          () => markupLoad(treeStructure),
        ],
        () => {
          return cy
            .get('file-tree-view')
            .then(addExpandListenerOnce('/folder1'))
            .then(expectListenerAdded)
            .get('[name=folder1]')
            .type('{rightArrow}') // right arrow expand

            .get('file-tree-view')
            .then(addExpandListenerOnce('/folder1/folder2'))
            .then(expectListenerAdded)
            .get('[name=folder2]')
            .click() // click expand

            .get('file-tree-view')
            .then(addCollapseListenerOnce('/folder1/folder2'))
            .then(expectListenerAdded)
            .contains('folder2')
            .click() // click collapse
            
            .get('file-tree-view')
            .then(addCollapseListenerOnce('/folder1'))
            .then(expectListenerAdded)
            .contains('folder1')
            .type('{leftArrow}') // left arrow collapse

            .then(expectAllListenersCalled);
        });
    });
  });
});

/**
 * inside root folder and inside nested folder
 * lastChild:
 *  file
 *  collapsed folder
 *  open folder with elements
 *  open empty folder
 */
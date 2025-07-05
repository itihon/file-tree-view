import FileTreeView from '../../../src/index';
import treeStructure from '../../fixtures/1-file-tree-view';

// TODO: expanded and selected when loading from object and html

// test for asyncForeach
// const asyncArr = [
//   () => new Promise(res => { setTimeout(res, 500, 1); }),
//   () => new Promise(res => { setTimeout(res, 3000, 2); }),
//   () => new Promise(res => { setTimeout(res, 500, 3); }),
//   () => new Promise(res => { setTimeout(res, 4000, 4); }),
//   () => new Promise(res => { setTimeout(res, 4000, 5); }),
// ];

// const cb = console.log;
// 
// asyncForeach(asyncArr, cb);
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
        }
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
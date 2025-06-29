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
});
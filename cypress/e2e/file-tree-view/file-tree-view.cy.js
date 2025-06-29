import FileTreeView from '../../../src/index';
import treeStructure from '../../fixtures/1-file-tree-view';

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

describe('file-tree-view', () => {
  beforeEach(() => {
    cy.visit('localhost:5173');
  });

  it('constructs certain DOM structure from loaded object structure', () => {
    cy.fixture('1-tree-structure.html').then(htmlStructure => {
      
      const ftView = new FileTreeView();

      ftView.load(treeStructure);

      cy
        .document()
        .then(document => document.body.appendChild(ftView))
        .then(() => {
          cy
            .get('file-tree-view')
            .should('have.html', htmlStructure);
        });
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
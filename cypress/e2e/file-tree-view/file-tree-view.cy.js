import FileTreeView from '../../../src/index';
import treeStructure from '../../fixtures/1-file-tree-view';

describe('file-tree-view', () => {
  it('constructs certain DOM structure from loaded object structure', () => {
    cy.visit('localhost:5173');
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
});
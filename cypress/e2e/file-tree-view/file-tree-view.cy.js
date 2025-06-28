import FileTreeView from '../../../src/index';
import treeFixture from '../../fixtures/1-file-tee-view';

describe('file-tree-view', () => {
  it('has certain DOM structure', () => {
    cy.visit('localhost:5173');

    const ftView = new FileTreeView();

    ftView.load(treeFixture);

    cy
      .document()
      .then(document => document.body.appendChild(ftView))
      .then(() => {
        cy
          .get('file-tree-view')
          .should('contain.html', `<ftv-folder name="folder1"><ftv-label class="noselect">folder1</ftv-label><ftv-file name="file1"><ftv-label class="noselect">file1</ftv-label></ftv-file><ftv-folder name="folder2"><ftv-label class="noselect">folder2</ftv-label><ftv-file name="file3"><ftv-label class="noselect">file3</ftv-label></ftv-file><ftv-file name="file4"><ftv-label class="noselect">file4</ftv-label></ftv-file><ftv-folder name="folder3"><ftv-label class="noselect">folder3</ftv-label></ftv-folder></ftv-folder><ftv-folder name="folder4"><ftv-label class="noselect">folder4</ftv-label><ftv-file name="file5"><ftv-label class="noselect">file5</ftv-label></ftv-file><ftv-file name="file6"><ftv-label class="noselect">file6</ftv-label></ftv-file><ftv-folder name="folder5"><ftv-label class="noselect">folder5</ftv-label></ftv-folder></ftv-folder></ftv-folder>`);
      });
  });
});
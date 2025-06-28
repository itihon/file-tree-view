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
          .should('have.html', `<ftv-folder name="folder1"><ftv-auxiliary class="label noselect">folder1</ftv-auxiliary><ftv-auxiliary class="content"><ftv-file name="file1"><ftv-auxiliary class="label noselect">file1</ftv-auxiliary></ftv-file><ftv-folder name="folder2"><ftv-auxiliary class="label noselect">folder2</ftv-auxiliary><ftv-auxiliary class="content"><ftv-file name="file3"><ftv-auxiliary class="label noselect">file3</ftv-auxiliary></ftv-file><ftv-file name="file4"><ftv-auxiliary class="label noselect">file4</ftv-auxiliary></ftv-file><ftv-folder name="folder3"><ftv-auxiliary class="label noselect">folder3</ftv-auxiliary><ftv-auxiliary class="content"></ftv-auxiliary></ftv-folder></ftv-auxiliary></ftv-folder><ftv-folder name="folder4"><ftv-auxiliary class="label noselect">folder4</ftv-auxiliary><ftv-auxiliary class="content"><ftv-file name="file5"><ftv-auxiliary class="label noselect">file5</ftv-auxiliary></ftv-file><ftv-file name="file6"><ftv-auxiliary class="label noselect">file6</ftv-auxiliary></ftv-file><ftv-folder name="folder5"><ftv-auxiliary class="label noselect">folder5</ftv-auxiliary><ftv-auxiliary class="content"></ftv-auxiliary></ftv-folder></ftv-auxiliary></ftv-folder></ftv-auxiliary></ftv-folder>`);
      });
  });
});
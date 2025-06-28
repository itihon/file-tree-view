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
          .should('have.html', `<ftv-folder name="folder1"><label class="noselect">folder1</label><div><ftv-file name="file1"><label class="noselect">file1</label></ftv-file><ftv-folder name="folder2"><label class="noselect">folder2</label><div><ftv-file name="file3"><label class="noselect">file3</label></ftv-file><ftv-file name="file4"><label class="noselect">file4</label></ftv-file><ftv-folder name="folder3"><label class="noselect">folder3</label><div></div></ftv-folder></div></ftv-folder><ftv-folder name="folder4"><label class="noselect">folder4</label><div><ftv-file name="file5"><label class="noselect">file5</label></ftv-file><ftv-file name="file6"><label class="noselect">file6</label></ftv-file><ftv-folder name="folder5"><label class="noselect">folder5</label><div></div></ftv-folder></div></ftv-folder></div></ftv-folder>`);
      });
  });
});
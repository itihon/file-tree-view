import * as fs from 'fs';

const publicApiFilePathDefault = 'temp/docs/public-api.md';
const destinationFilePathDefault = 'README.md';
const embedStartToken = '<!-- embed-api-docs-start -->';
const embedEndToken = '<!-- embed-api-docs-end -->';

const destinationFileContent = fs.readFileSync(destinationFilePathDefault, { encoding: 'utf8' });
const startTokenPosition = destinationFileContent.indexOf(embedStartToken) + embedStartToken.length;
const endTokenPosition = destinationFileContent.indexOf(embedEndToken);
const pieceBefore = destinationFileContent.substring(0, startTokenPosition);
const pieceInside = destinationFileContent.substring(startTokenPosition, endTokenPosition);
const pieceAfter = destinationFileContent.substring(endTokenPosition);
const embeddedText = '\n' + fs.readFileSync(publicApiFilePathDefault, { encoding: 'utf8' });

if (pieceInside === embeddedText) {
  console.log('Embedding flat docs.', 'API did not change. Nothing to embed.');
  process.exit();
}

const resultText = pieceBefore.concat(embeddedText).concat(pieceAfter);

fs.writeFileSync(destinationFilePathDefault, resultText, { encoding: 'utf8' });

console.log(destinationFilePathDefault, 'updated.');
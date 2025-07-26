import { ApiModel, ApiClass, ApiMethod, ApiItem, ApiProperty, ApiEntryPoint } from '@microsoft/api-extractor-model';
import * as path from 'path';
import * as fs from 'fs';

const apiJsonFilePathDefault = 'temp/file-tree-view.api.json';
const outputFolderPathDefault = 'temp/docs';
const outputFileNameDefault = 'public-api.md';
const ingnoredClassMemberList = [
  'connectedCallback',
  'disconnectedCallback',
  'connectedMoveCallback',
  'adoptedCallback',
  'attributeChangedCallback',
];
const ignoredClassList = [
  'FTVNode',
  'FTVRef',
];

function writeFile(
  outputFolderPath = outputFolderPathDefault, 
  fileName = outputFileNameDefault, 
  content = '',
) {
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }
  
  const outputPath = path.join(outputFolderPath, fileName);
  fs.writeFileSync(outputPath, content);
}

/**
 * @param {ApiClass} apiClass 
 * @returns {Array<ApiClass>}
 */
function getAncestorClassName(apiClass) {
  const { tokenRange, tokens } = apiClass.extendsType.excerpt;
  const { startIndex, endIndex } = tokenRange;
  return tokens.slice(startIndex, endIndex)[0].text;
}

/**
 * @param {ApiClass | undefined | null} apiClass 
 * @param {ApiEntryPoint} apiEntryPoint 
 * @returns {Array<ApiClass>}
 */
function getClassHierachy(apiClass, apiEntryPoint) {
  if (!apiClass) return [];

  const ancestorClassName = getAncestorClassName(apiClass);
  const ancestorClass = apiEntryPoint.findMembersByName(ancestorClassName)[0];

  return [ apiClass, ...getClassHierachy(ancestorClass, apiEntryPoint)];
}

/**
 * @param {ApiClass} apiClass 
 * @returns {Array<string>}
 */
function collectClassMembers(apiClass) {
  const classMemebers = [];

  for (const member of apiClass.members) {
    logEntry(member, 'Processing ', 2);

    if (member instanceof ApiMethod || member instanceof ApiProperty) {
      if (!ingnoredClassMemberList.includes(member.displayName)) {
        classMemebers.push(member.excerpt.text);
      }
    }
  }
  return classMemebers;
}

/**
 * @param {ApiItem} entry 
 * @param {string} preMessage 
 * @param {number} indentLevel 
 */
function logEntry(entry, preMessage = '', indentLevel = 0) {
  console.log(`${''.padStart(indentLevel, ' ')}${preMessage} ${entry.kind}: ${entry.displayName}`);
}

/**
 * @param {ApiClass} apiClass 
 * @param {Array<string>} members 
 */
function generateClass(apiClass, members = []) {
  const text = `
${apiClass.excerpt.text} {
${members.map(value => `  ${value}`).join('\n')}
}`;
  return text;
}

function generateFlatClassDocs(apiJsonFilePath = apiJsonFilePathDefault) {
  const apiModel = new ApiModel();
  const apiPackage = apiModel.loadPackage(apiJsonFilePath);
  let markdown = '## API\n';

  for (const defaultEntry of apiPackage.entryPoints) {

    for (const entry of defaultEntry.members) {

     if (entry instanceof ApiClass) {

      if (!ignoredClassList.includes(entry.displayName)) {

        logEntry(entry, 'Processing ');

        const hierarchy = getClassHierachy(entry, defaultEntry);

        const classText = generateClass(
          entry,
          hierarchy
            .map(collectClassMembers)
            .flat()
            .sort(),
        );

        markdown = markdown.concat(
          '\n', 
          `### class \`${entry.displayName}\`\n\n`, 
          `\`\`\`ts${classText}\n\`\`\`\n`,
        );
      }
     }
    }
  }

  writeFile(undefined, undefined, markdown);
  console.log(`Generated.`);
}

generateFlatClassDocs();
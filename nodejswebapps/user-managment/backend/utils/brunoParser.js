const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');

/**
 * Recursively collects all .bru files from a directory and its subdirectories.
 * @param {string} dir - Directory to start from.
 * @returns {string[]} - Array of full file paths.
 */
function getAllBruFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllBruFiles(filePath));
    } else if (file.endsWith('.bru')) {
      results.push(filePath);
    }
  });

  return results;
}

/**
 * Parses Bruno .bru files and extracts API call metadata.
 * @param {string} folderPath - Path to the Bruno collections folder.
 * @returns {Array} - Array of parsed API call objects.
 */
function parseBrunoCollections(folderPath = path.join(__dirname, '../resources/bruno-collections')) {
  const files = getAllBruFiles(folderPath);
  const apiCalls = [];

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    const relativeDir = path.relative(folderPath, path.dirname(filePath));
    const category = relativeDir === '' ? 'Uncategorized' : relativeDir;

    logger.debug(`Parsing bruno file => ${fileName}`);

    const metaMatch = content.match(/meta\s*{[^}]*name:\s*(\S+)[^}]*seq:\s*(\d+)/);
    const authMatch = content.match(/auth:bearer\s*{[^}]*token:\s*(\S+)/);

    const methods = ['get', 'post', 'put', 'delete'];

    methods.forEach(method => {
      const methodRegex = new RegExp(`${method}\\s*{[^}]*url:\\s*(\\S+)[^}]*auth:\\s*(\\S+)`, 'i');
      const match = content.match(methodRegex);

      if (metaMatch && match) {
        apiCalls.push({
          name: metaMatch[1],
          seq: parseInt(metaMatch[2]),
          method: method.toUpperCase(),
          url: match[1],
          authType: match[2],
          token: authMatch ? authMatch[1] : null,
          file: fileName,
          category
        });
      }
    });

    if (!methods.some(method => content.includes(`${method} {`))) {
      console.log(`⚠️ Skipped: ${fileName} (no supported method block found)`);
    }
  });

  return apiCalls.sort((a, b) => a.seq - b.seq);
}

module.exports = { parseBrunoCollections };

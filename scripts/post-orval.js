/**
 * Post-generation script for Orval.
 * Adds // @ts-nocheck to all generated service files
 * so TypeScript doesn't flag issues in auto-generated code.
 */
const fs = require('fs');
const path = require('path');

const generatedDir = path.join(__dirname, '..', 'src', 'app', 'api', 'generated');

function processDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.startsWith('// @ts-nocheck')) {
        fs.writeFileSync(fullPath, '// @ts-nocheck\n' + content, 'utf8');
      }
    }
  }
}

processDir(generatedDir);
console.log('Added // @ts-nocheck to all generated service files.');

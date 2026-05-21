#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

/**
 * Clean TODO comments that are poorly formatted or unnecessary
 */
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'generated', 'coverage'].includes(entry.name)) continue;
      files = files.concat(walk(full));
    } else if (entry.isFile() && full.endsWith('.ts')) {
      if (full.endsWith('.spec.ts')) continue;
      files.push(full);
    }
  }
  return files;
}

function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  let changed = false;

  // Remove orphaned TODO comments (those on their own or after a closing block)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Pattern: orphaned "TODO" comment block
    if (line.includes('TODO: Documentation for if') ||
        line.includes('TODO: Documentation for map') ||
        line.includes('TODO: Documentation for filter') ||
        line.includes('TODO: Documentation for tap') ||
        line.includes('TODO: Documentation for finalize') ||
        line.includes('TODO: Documentation for catch') ||
        line.includes('TODO: Documentation for forEach')) {
      
      // Look back to find the start of this comment block
      let docStart = i;
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        if (lines[j].trim().startsWith('/**')) {
          docStart = j;
          break;
        }
      }
      
      // Find end of comment block
      let docEnd = i;
      for (let j = i; j < Math.min(lines.length, i + 5); j++) {
        if (lines[j].includes('*/')) {
          docEnd = j;
          break;
        }
      }
      
      // Remove the entire block
      lines.splice(docStart, docEnd - docStart + 1);
      changed = true;
      i = docStart - 1;
      continue;
    }
  }

  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log(`Cleaned: ${path.relative(process.cwd(), file)}`);
  }
}

console.log('Cleaning up TODO comments...');
const files = walk(root);
files.forEach(processFile);
console.log(`Done! Processed ${files.length} files.`);

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

const root = path.resolve(__dirname, '..', 'src');

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
      const rel = path.relative(process.cwd(), full).replace(/\\/g, '/');
      if (rel.includes('/src/app/api/generated/') || rel.includes('/src/app/api/model/')) continue;
      if (rel.endsWith('/test.ts') || rel.endsWith('/main.ts') || rel.endsWith('/server.ts')) continue;
      files.push(full);
    }
  }
  return files;
}

function processFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // detect declaration patterns: exported declarations, top-level functions and constants
    let kind = null;
    let name = null;
    const mExportDecl = line.match(/^\s*export\s+(?:abstract\s+)?(class|interface|enum|type|function)\s+([A-Za-z0-9_]+)/);
    const mExportVar = line.match(/^\s*export\s+(?:const|let|var)\s+([A-Za-z0-9_]+)\s*[=:]/);
    const mFunc = line.match(/^\s*function\s+([A-Za-z0-9_]+)\s*\(/);
    const mVar = line.match(/^\s*(?:const|let|var)\s+([A-Za-z0-9_]+)\s*[=:]/);

    if (mExportDecl) { kind = mExportDecl[1]; name = mExportDecl[2]; }
    else if (mExportVar) { kind = 'const'; name = mExportVar[1]; }
    else if (mFunc) {
      // only consider top-level non-exported functions (no indentation)
      const leading = line.match(/^(\s*)/)[1].length;
      if (leading === 0) { kind = 'function'; name = mFunc[1]; }
    }
    else if (mVar) {
      const leading = line.match(/^(\s*)/)[1].length;
      if (leading === 0) { kind = 'const'; name = mVar[1]; }
    }
    if (!kind || !name) continue;

    // find decorator index (e.g. @Component) if any
    let decoratorIndex = -1;
    for (let j = i - 1; j >= Math.max(0, i - 80); j--) {
      if (lines[j].trim().startsWith('@')) { decoratorIndex = j; break; }
    }

    // try to detect an existing JSDoc block just before the declaration
    let docStart = -1;
    for (let s = 1; s <= 40; s++) {
      const idx = i - s;
      if (idx < 0) break;
      const t = lines[idx].trim();
      if (t === '') continue;
      if (t.startsWith('/**')) { docStart = idx; break; }
      if (t.startsWith('*/')) {
        for (let u = idx - 1; u >= Math.max(0, idx - 40); u--) {
          if (lines[u].trim().startsWith('/**')) { docStart = u; break; }
          if (lines[u].trim() === '') break;
        }
        break;
      }
      if (t.startsWith('//') || t.startsWith('*')) continue;
      break;
    }

    const hadDoc = docStart !== -1;

    if (hadDoc && decoratorIndex !== -1 && docStart > decoratorIndex) {
      // move the existing doc block above the decorator
      let docEnd = docStart;
      for (let k = docStart; k < lines.length; k++) {
        if (lines[k].includes('*/')) { docEnd = k; break; }
      }
      const block = lines.splice(docStart, docEnd - docStart + 1);
      lines.splice(decoratorIndex, 0, ...block);
      i += block.length; // adjust index to skip moved block
      changed = true;
      continue;
    }

    if (!hadDoc) {
      // insert before decorator if present, otherwise before the declaration
      let insertAt = decoratorIndex !== -1 ? decoratorIndex : i;
      if (insertAt === i) {
        // try to avoid inserting inside code: prefer to insert at previous blank line
        for (let j = i - 1; j >= 0; j--) {
          if (lines[j].trim() === '') { insertAt = j + 1; break; }
          if (lines[j].trim().startsWith('@')) { insertAt = j; break; }
        }
      }
      const stub = [
        '/**',
        ` * TODO: Documentation for ${name} (${kind})`,
        ' */'
      ];
      lines.splice(insertAt, 0, ...stub);
      i += stub.length; // skip newly inserted lines
      changed = true;
    }
  }

  // Second pass: add member-level stubs inside classes and interfaces
  function addMemberStubs(lines) {
    for (let i = 0; i < lines.length; i++) {
      const classMatch = lines[i].match(/^\s*(?:export\s+)?(?:abstract\s+)?class\s+([A-Za-z0-9_]+)/);
      const interfaceMatch = lines[i].match(/^\s*(?:export\s+)?interface\s+([A-Za-z0-9_]+)/);
      if (!classMatch && !interfaceMatch) continue;
      // find opening brace
      let braceLine = i;
      let bracePos = lines[braceLine].indexOf('{');
      while (bracePos === -1 && braceLine + 1 < lines.length) { braceLine++; bracePos = lines[braceLine].indexOf('{'); }
      if (bracePos === -1) continue;
      // find matching closing brace
      let depth = 0;
      let foundStart = false;
      let endLine = braceLine;
      for (let j = braceLine; j < lines.length; j++) {
        const str = lines[j];
        for (let k = 0; k < str.length; k++) {
          const c = str[k];
          if (c === '{') { depth++; foundStart = true; }
          else if (c === '}') { depth--; if (foundStart && depth === 0) { endLine = j; j = lines.length; break; } }
        }
      }
      // iterate inside block
      for (let m = braceLine + 1; m < endLine; m++) {
        const raw = lines[m];
        if (!raw) continue;
        const trimmed = raw.trim();
        if (trimmed === '' || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('@')) continue;
        if (/^[{}]\s*$/.test(trimmed)) continue;

        // naive member detection: name followed by '(' => method, or ':'/';' => property (for interfaces)
        const memberMatch = raw.match(/^\s*(?:public\s+|private\s+|protected\s+|readonly\s+|static\s+|abstract\s+|async\s+|)\s*([A-Za-z0-9_$]+)\s*(\(|:|<|;)/);
        if (!memberMatch) continue;
        const memberName = memberMatch[1];
        const nextChar = memberMatch[2];
        const kind = nextChar === '(' ? 'method' : 'property';

        // check for existing JSDoc immediately above
        let hasDoc = false;
        for (let b = m - 1; b >= braceLine + 1; b--) {
          const t = lines[b].trim();
          if (t === '') continue;
          if (t.startsWith('/**')) { hasDoc = true; break; }
          if (t.startsWith('*/')) continue;
          // stop if we hit another member or decorator
          if (t.startsWith('@')) continue;
          break;
        }
        if (hasDoc) continue;

        // determine insert position (above decorators if any)
        let insertAt = m;
        for (let d = m - 1; d >= braceLine + 1; d--) {
          const t = lines[d].trim();
          if (t.startsWith('@')) insertAt = d;
          else if (t === '') insertAt = d + 1;
          else break;
        }

        // gather params for methods (try to read until matching ')')
        let params = [];
        if (kind === 'method') {
          let sig = raw;
          let pIdx = m;
          const openIdx = sig.indexOf('(');
          let closeFound = sig.indexOf(')') !== -1;
          while (!closeFound && pIdx + 1 < endLine) {
            pIdx++;
            sig += ' ' + lines[pIdx].trim();
            if (lines[pIdx].indexOf(')') !== -1) closeFound = true;
          }
          const firstParen = sig.indexOf('(');
          const lastParen = sig.lastIndexOf(')');
          if (firstParen >= 0 && lastParen > firstParen) {
            const paramsStr = sig.substring(firstParen + 1, lastParen).trim();
            if (paramsStr.length > 0) {
              const rawParams = paramsStr.split(',').map(s => s.trim()).filter(Boolean);
              params = rawParams.map(p => {
                const beforeType = p.split(':')[0].split('=')[0].trim();
                const name = beforeType.replace(/^\.\.\./, '').split(/\s+/).slice(-1)[0];
                return name || null;
              }).filter(Boolean);
            }
          }
        }

        // build stub
        const stub = [];
        stub.push('/**');
        stub.push(` * TODO: Documentation for ${memberName} (${kind})`);
        if (params && params.length) {
          for (const p of params) stub.push(` * @param ${p} - TODO`);
        }
        if (kind === 'method') stub.push(' * @returns TODO');
        stub.push(' */');

        lines.splice(insertAt, 0, ...stub);
        // adjust pointers due to insertion
        const added = stub.length;
        m += added;
        endLine += added;
        i += added; // keep outer loop in sync
        changed = true;
      }
      // jump to end of block
      i = endLine;
    }
  }

  try {
    addMemberStubs(lines);
  } catch (err) {
    console.error('Member stub pass failed for', file, err && err.message);
  }

  if (changed) {
    fs.writeFileSync(file, lines.join(os.EOL), 'utf8');
    console.log('Patched', file);
  }
  return changed;
}

(function main() {
  if (!fs.existsSync(root)) {
    console.error('Source folder not found:', root);
    process.exit(1);
  }
  const files = walk(root);
  let modified = 0;
  for (const f of files) {
    try {
      if (processFile(f)) modified++;
    } catch (err) {
      console.error('Error processing', f, err.message);
    }
  }
  console.log(`Finished. Modified ${modified} files.`);
})();

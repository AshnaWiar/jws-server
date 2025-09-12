import fs from 'fs';
import path from 'path';

const DIST_DIR = './dist';

class TreeNode {
  constructor(name = '') {
    this.name = name;
    this.children = new Map();
  }

  add(parts) {
    if (!parts.length) return; // Stop once full path added
    const [head, ...tail] = parts;
    if (!this.children.has(head)) this.children.set(head, new TreeNode(head));
    this.children.get(head).add(tail);
  }

  print(prefix = '', isLast = true) {
    if (this.name) {
      const branch = isLast ? '└─ ' : '├─ ';
      // Show tsLink path if present after the name
      console.log(prefix + branch + this.name );
      prefix += isLast ? '   ' : '│  ';
    }

    const children = [...this.children.values()];
    children.forEach((child, i) => child.print(prefix, i === children.length - 1));
  }



  get isEmpty() {
    // Empty tree means nothing was deleted
    return this.children.size === 0;
  }
}

// Wrap calls to handle errors gracefully and avoid crashes
const safeExecute = (fn) => {
  try {
    return fn();
  } catch {
    return null;
  }
};

// Get file stats safely, skip if inaccessible
const safeStatSync = (p) => safeExecute(() => fs.statSync(p));

// Delete a file safely and track it if successful
const safeUnlinkSync = (p, tree) => {
  if (safeExecute(() => fs.unlinkSync(p)) === null) return;
  tree.add(path.relative(DIST_DIR, p).split(path.sep));
};

// Remove directory only if empty, then track deletion
const safeRmdirSyncIfEmpty = (dir, tree) => {
  const entries = safeExecute(() => fs.readdirSync(dir));
  if (!entries || entries.length) return; // Only delete empty folders
  if (safeExecute(() => fs.rmdirSync(dir)) === null) return;
  tree.add(path.relative(DIST_DIR, dir).split(path.sep));
};

// Check file content pattern to identify empty export JS files
const isEmptyExportJs = (file) => {
  const content = safeExecute(() => fs.readFileSync(file, 'utf8').trim());
  if (!content) return false; // Skip unreadable files
  return /^export\s*\{\};\s*[\r\n]+\/\/# sourceMappingURL=.*$/.test(content);
};

// Recursively clean target directory and record deletions
const cleanDir = (dir, tree) => {
  const entries = safeExecute(() => fs.readdirSync(dir));
  if (!entries) return; // Skip if directory is missing or inaccessible

  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = safeStatSync(full);
    if (!stat) continue; // Skip vanished files/folders

    if (stat.isDirectory()) cleanDir(full, tree);
    else if (full.endsWith('.js') && isEmptyExportJs(full)) {
      // Remove .js and related .map file, tracking both
      safeUnlinkSync(full, tree);
      safeUnlinkSync(full + '.map', tree);
    }
  }

  // Clean up empty folders after files removal
  safeRmdirSyncIfEmpty(dir, tree);
};

const deletedTree = new TreeNode();
cleanDir(DIST_DIR, deletedTree);

if (!deletedTree.isEmpty) {
  console.log('Removing empty js and associate map files:');
  deletedTree.print();
} else {
  console.log('No matching files or folders deleted.');
}

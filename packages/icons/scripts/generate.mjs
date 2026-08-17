// scripts/generate.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// react-icons' exports map doesn't expose "./package.json" directly,
// so resolve the root entry instead, then walk up to the package root.
const riEntryUrl = import.meta.resolve('react-icons');
const riEntryPath = fileURLToPath(riEntryUrl);

// riEntryPath is something like .../node_modules/react-icons/index.mjs
// walk up until we find package.json
let dir = path.dirname(riEntryPath);
let riPkgPath;
while (true) {
  const candidate = path.join(dir, 'package.json');
  if (fs.existsSync(candidate)) {
    riPkgPath = candidate;
    break;
  }
  const parent = path.dirname(dir);
  if (parent === dir) {
    throw new Error('Could not locate react-icons package.json');
  }
  dir = parent;
}

const riPkg = JSON.parse(fs.readFileSync(riPkgPath, 'utf-8'));

const SKIP = new Set(['.', './lib']);
const sets = Object.keys(riPkg.exports)
  .filter((key) => !SKIP.has(key))
  .map((key) => key.replace('./', ''));

const srcDir = path.join(root, 'src');
fs.mkdirSync(srcDir, { recursive: true });

const exportsMap = {
  '.': {
    types: './dist/index.d.ts',
    import: './dist/index.js',
  },
};

for (const set of sets) {
  fs.writeFileSync(
    path.join(srcDir, `${set}.ts`),
    `export * from 'react-icons/${set}';\n`
  );
  exportsMap[`./${set}`] = {
    types: `./dist/${set}.d.ts`,
    import: `./dist/${set}.js`,
  };
}

const pkgJsonPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
pkg.exports = exportsMap;
fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Generated ${sets.length} icon set files + exports map.`);
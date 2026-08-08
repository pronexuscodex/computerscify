import { copyFile, mkdir } from 'node:fs/promises';

const SOURCE_DIR = new URL('../node_modules/pyodide/', import.meta.url);
const DEST_DIR = new URL('../public/pyodide/', import.meta.url);

// Only the runtime files needed in the browser; excludes README, console.html, and .d.ts sources.
const ASSETS = [
  'pyodide.js',
  'pyodide.js.map',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'pyodide-lock.json',
  'python_stdlib.zip',
];

await mkdir(DEST_DIR, { recursive: true });

await Promise.all(
  ASSETS.map((file) => copyFile(new URL(file, SOURCE_DIR), new URL(file, DEST_DIR)))
);

console.log(`Copied ${ASSETS.length} Pyodide runtime assets to public/pyodide/`);

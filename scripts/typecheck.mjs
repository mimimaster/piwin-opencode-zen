import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = process.env.PIWIN_SOURCE_ROOT;
const require = createRequire(sourceRoot ? resolve(sourceRoot, 'package.json') : import.meta.url);
const ts = require('typescript');
const options = {
  allowJs: true, checkJs: true, noEmit: true, strict: true,
  noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, skipLibCheck: true,
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
};
if (sourceRoot) {
  options.typeRoots = [resolve(sourceRoot, 'node_modules/@types')];
  options.baseUrl = packageRoot;
  options.paths = {};
  for (const name of ['@earendil-works/pi-ai', '@earendil-works/pi-ai/compat', '@earendil-works/pi-coding-agent']) {
    const packageName = name.split('/').slice(0, 2).join('/');
    const installedRoot = resolve(sourceRoot, 'packages/agent-host/node_modules', packageName);
    const manifest = JSON.parse(readFileSync(resolve(installedRoot, 'package.json'), 'utf8'));
    const entry = name === packageName ? '.' : './compat';
    const typePath = manifest.exports[entry].types;
    options.paths[name] = [resolve(installedRoot, typePath)];
  }
}
const program = ts.createProgram(['index.ts', 'src/index.js', 'src/zen-request.js', 'src/zen-stream.js'].map((path) => resolve(packageRoot, path)), options);
const diagnostics = ts.getPreEmitDiagnostics(program);
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCanonicalFileName: (path) => path, getCurrentDirectory: () => packageRoot, getNewLine: () => '\n' }));
  process.exitCode = 1;
} else console.log('Strict typecheck passed (no emit).');

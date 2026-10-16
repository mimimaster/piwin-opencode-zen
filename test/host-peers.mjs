// Optional local development against an existing piwin checkout, without installing peers.
import { registerHooks } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const sourceRoot = process.env.PIWIN_SOURCE_ROOT;
if (sourceRoot) {
  const hostParent = pathToFileURL(resolve(sourceRoot, 'packages/agent-host/package.json')).href;
  const packageRoot = new URL('../', import.meta.url).href;
  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (context.parentURL?.startsWith(packageRoot) && specifier.startsWith('@earendil-works/')) {
        return nextResolve(specifier, { ...context, parentURL: hostParent });
      }
      return nextResolve(specifier, context);
    },
  });
}

/**
 * Launcher so "node server/index.js" from root finds server/node_modules.
 * Changes into server/ then runs server/index.js.
 */
import { chdir } from 'process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const serverDir = join(__dirname, 'server');
chdir(serverDir);

await import(pathToFileURL(join(serverDir, 'index.js')).href);

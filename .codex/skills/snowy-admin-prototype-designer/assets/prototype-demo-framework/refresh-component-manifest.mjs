import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = dirname(fileURLToPath(import.meta.url));
const sha256 = value => createHash('sha256').update(value).digest('hex');

const hashFile = async (root, file) => ({ file, sha256: sha256(await readFile(resolve(root, file))) });

export async function refreshComponentManifest(targetRoot = defaultRoot) {
  const root = resolve(targetRoot);
  const manifestPath = resolve(root, 'component-manifest.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const entryFile = manifest.entry || 'index.html';
  const entry = await readFile(resolve(root, entryFile), 'utf8');
  const componentFiles = [...entry.matchAll(/<script\s+src=["']components\/([^"']+\.js)["']><\/script>/g)]
    .map(match => match[1]);
  if (!componentFiles.includes('registry.js')) {
    throw new Error('index.html must import components/registry.js');
  }

  const components = [];
  for (const file of componentFiles) {
    const raw = await readFile(resolve(root, 'components', file));
    const source = raw.toString('utf8');
    const declaredName = source.match(/\bname:\s*['"]([^'"]+)['"]/)?.[1]
      || source.match(/SnowyPrototypeComponents\.([A-Za-z0-9_]+)/)?.[1];
    const name = file === 'registry.js' ? 'registry' : declaredName;
    if (!name) throw new Error(`Unable to determine component name: ${file}`);
    components.push({ name, file, sha256: sha256(raw) });
  }

  manifest.version = 'snowy-runtime-components-v1';
  manifest.entry = entryFile;
  manifest.entrySha256 = sha256(Buffer.from(entry, 'utf8'));
  manifest.styles = await Promise.all((manifest.styles || []).map(item => hashFile(root, item.file)));
  manifest.app = await Promise.all((manifest.app || []).map(item => hashFile(root, item.file)));
  manifest.components = components;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  return manifest;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  refreshComponentManifest(process.argv[2] || defaultRoot)
    .then(manifest => console.log(`PASS refreshed ${manifest.components.length - 1} runtime components`))
    .catch(error => {
      console.error(`FAIL ${error.message}`);
      process.exitCode = 1;
    });
}

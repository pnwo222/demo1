import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(root, 'component-manifest.json');
const sha256 = value => createHash('sha256').update(value).digest('hex');

const runtimeFiles = manifest => [
  { file: manifest.entry, sha256: manifest.entrySha256 },
  { file: manifest.contract, sha256: manifest.contractSha256 },
  ...manifest.styles,
  ...manifest.app,
  ...manifest.components.map(item => ({ ...item, file: `components/${item.file}` })),
];

export async function validatePrototypeComponents() {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.version !== 'snowy-runtime-components-v1') {
    throw new Error(`Unsupported component manifest: ${manifest.version}`);
  }
  for (const item of runtimeFiles(manifest)) {
    const content = await readFile(resolve(root, item.file));
    if (sha256(content) !== item.sha256) {
      throw new Error(`Runtime component changed without manifest update: ${item.file}`);
    }
  }
  return manifest;
}

export async function buildPrototype(outputDirectory) {
  const manifest = await validatePrototypeComponents();
  const outputRoot = resolve(outputDirectory);
  await mkdir(outputRoot, { recursive: true });
  await copyFile(manifestPath, resolve(outputRoot, 'component-manifest.json'));
  for (const item of runtimeFiles(manifest)) {
    const target = resolve(outputRoot, item.file);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(resolve(root, item.file), target);
  }
  return outputRoot;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const outputArg = process.argv[2];
  const action = outputArg ? buildPrototype(outputArg) : validatePrototypeComponents().then(() => root);
  action
    .then(output => console.log(`PASS runtime component prototype: ${output}`))
    .catch(error => {
      console.error(`FAIL ${error.message}`);
      process.exitCode = 1;
    });
}

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { COMPONENT_KIT_VERSION, createComponentRegistry, serializeComponentRegistry } from './src/component-registry.js';
import { assertValidPrototypeSchema } from './src/schema-validator.js';

const root = dirname(fileURLToPath(import.meta.url));
const sourceFiles = {
  shell: resolve(root, 'src/shell.html'),
  coreCss: resolve(root, 'src/snowy-core.css'),
  annotationCss: resolve(root, 'src/annotation.css'),
  components: resolve(root, 'src/snowy-components.js'),
  annotation: resolve(root, 'src/annotation-runtime.js'),
  app: resolve(root, 'src/demo-app.js'),
};

const sha256 = value => createHash('sha256').update(value, 'utf8').digest('hex');
const escapeJsonForHtml = value => JSON.stringify(value).replace(/</g, '\\u003c');

export async function buildPrototype({ schemaPath, outputPath }) {
  const [shell, coreCss, annotationCss, componentsJs, annotationJs, appJs, schemaRaw] = await Promise.all([
    readFile(sourceFiles.shell, 'utf8'), readFile(sourceFiles.coreCss, 'utf8'),
    readFile(sourceFiles.annotationCss, 'utf8'), readFile(sourceFiles.components, 'utf8'),
    readFile(sourceFiles.annotation, 'utf8'), readFile(sourceFiles.app, 'utf8'),
    readFile(resolve(schemaPath), 'utf8'),
  ]);
  const schema = JSON.parse(schemaRaw);
  const registry = createComponentRegistry(schema.extensions || []);
  assertValidPrototypeSchema(schema, registry);
  const manifest = {
    version: COMPONENT_KIT_VERSION,
    components: serializeComponentRegistry(registry),
    sourceHashes: {
      coreCss: sha256(coreCss.trim()), annotationCss: sha256(annotationCss.trim()),
      components: sha256(componentsJs.trim()), annotation: sha256(annotationJs.trim()), app: sha256(appJs.trim()),
    },
  };
  const replacements = {
    DOCUMENT_TITLE: schema.system.title || schema.system.name || 'Snowy 后管原型',
    SNOWY_CORE_CSS: coreCss.trim(), ANNOTATION_CSS: annotationCss.trim(),
    COMPONENT_MANIFEST: escapeJsonForHtml(manifest), PROTOTYPE_SCHEMA_JSON: escapeJsonForHtml(schema),
    SNOWY_COMPONENTS_JS: componentsJs.trim(), ANNOTATION_RUNTIME_JS: annotationJs.trim(), DEMO_APP_JS: appJs.trim(),
  };
  let html = shell;
  for (const [key, value] of Object.entries(replacements)) html = html.replace(`{{${key}}}`, value);
  if (/\{\{[A-Z0-9_]+\}\}/.test(html)) throw new Error('Unresolved shell placeholder');
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(resolve(outputPath), html, 'utf8');
  return { outputPath: resolve(outputPath), manifest, schema };
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 2) values[argv[index]] = argv[index + 1];
  return values;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  const schemaPath = args['--schema'] || resolve(root, 'src/demo-schema.json');
  const outputPath = args['--output'] || resolve(root, 'index.html');
  buildPrototype({ schemaPath, outputPath })
    .then(result => console.log(`PASS built ${result.outputPath}`))
    .catch(error => { console.error(`FAIL ${error.message}`); process.exitCode = 1; });
}

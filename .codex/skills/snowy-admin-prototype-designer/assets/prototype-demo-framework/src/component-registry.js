export const COMPONENT_KIT_VERSION = 'snowy-prototype-kit-v1';

const coreComponents = [
  ['SnowyShell', 'layout'],
  ['SnowyMenu', 'layout'],
  ['SnowyTabs', 'layout'],
  ['QueryForm', 'page'],
  ['PageToolbar', 'page'],
  ['DataTable', 'page'],
  ['TablePagination', 'page'],
  ['FormDrawer', 'overlay'],
  ['DetailDrawer', 'overlay'],
  ['ConfirmModal', 'overlay'],
  ['ImportModal', 'overlay'],
  ['ImagePreview', 'overlay'],
  ['Input', 'query'],
  ['Textarea', 'query'],
  ['Select', 'query'],
  ['TreeSelect', 'query'],
  ['DateRange', 'query'],
  ['DateTime', 'query'],
  ['NumberInput', 'query'],
  ['Text', 'display'],
  ['MaskedText', 'display'],
  ['Amount', 'display'],
  ['StatusTag', 'display'],
  ['Switch', 'display'],
  ['Image', 'display'],
  ['Avatar', 'display'],
  ['Attachment', 'display'],
  ['Progress', 'display'],
  ['Badge', 'display'],
  ['LongText', 'display'],
  ['ImageUpload', 'form'],
  ['FileUpload', 'form'],
  ['ImportUpload', 'form'],
  ['LinkAction', 'action'],
  ['ButtonAction', 'action'],
  ['DangerAction', 'action'],
  ['IconAction', 'action'],
  ['AnnotationLayer', 'infrastructure'],
];

export function createComponentRegistry(extensions = []) {
  const registry = new Map();
  for (const [name, category] of coreComponents) {
    registry.set(name, { name, category, source: 'core' });
  }
  for (const extension of extensions) {
    if (!extension || !extension.name) throw new Error('extension component name is required');
    if (registry.has(extension.name)) throw new Error(`duplicate component ${extension.name}`);
    if (!extension.baseComponent || !registry.has(extension.baseComponent)) {
      throw new Error(`extension ${extension.name} requires a registered baseComponent`);
    }
    registry.set(extension.name, {
      ...extension,
      category: extension.category || registry.get(extension.baseComponent).category,
      source: extension.source || 'extension',
    });
  }
  return registry;
}

export function serializeComponentRegistry(registry) {
  return Array.from(registry.values()).map(({ name, category, source, baseComponent }) => ({ name, category, source, ...(baseComponent ? { baseComponent } : {}) }));
}

const fieldSections = ['queryFields', 'columns', 'detailFields', 'createFields', 'editFields'];
const actionSections = ['toolbarActions', 'rowActions'];

function validateComponentItems(page, section, items, registry, errors) {
  if (!Array.isArray(items)) {
    errors.push(`${page.id}.${section} must be an array`);
    return;
  }
  const seen = new Set();
  items.forEach((item, index) => {
    const location = `${page.id}.${section}[${index}]`;
    if (!item || typeof item !== 'object') {
      errors.push(`${location} must be an object`);
      return;
    }
    const identity = item.key || item.dataIndex;
    if (!identity) errors.push(`${location}.key is required`);
    if (identity && seen.has(identity)) errors.push(`${page.id}.${section} duplicate key ${identity}`);
    if (identity) seen.add(identity);
    if (!item.component) {
      errors.push(`${location}.component is required`);
    } else if (!registry.has(item.component)) {
      errors.push(`${location} unknown component ${item.component}`);
    }
  });
}

export function validatePrototypeSchema(schema, registry) {
  const errors = [];
  if (!schema || typeof schema !== 'object') return { ok: false, errors: ['schema must be an object'] };
  if (schema.version !== 1) errors.push('schema.version must be 1');
  if (!Array.isArray(schema.pages) || !schema.pages.length) {
    errors.push('schema.pages must contain at least one page');
    return { ok: false, errors };
  }

  const pageIds = new Set();
  schema.pages.forEach((page, pageIndex) => {
    if (!page || typeof page !== 'object') {
      errors.push(`pages[${pageIndex}] must be an object`);
      return;
    }
    if (!page.id) errors.push(`pages[${pageIndex}].id is required`);
    if (page.id && pageIds.has(page.id)) errors.push(`duplicate page id ${page.id}`);
    if (page.id) pageIds.add(page.id);
    for (const key of ['title', 'route', 'permission', 'pageType', 'requirement']) {
      if (!page[key]) errors.push(`${page.id || `pages[${pageIndex}]`}.${key} is required`);
    }
    if (!Array.isArray(page.menuPath) || !page.menuPath.length) {
      errors.push(`${page.id}.menuPath must be a non-empty array`);
    }
    for (const section of fieldSections) {
      validateComponentItems(page, section, page[section], registry, errors);
    }
    for (const section of actionSections) {
      validateComponentItems(page, section, page[section], registry, errors);
    }
    if (!Array.isArray(page.rows)) errors.push(`${page.id}.rows must be an array`);
    if (!Array.isArray(page.annotations)) errors.push(`${page.id}.annotations must be an array`);
  });
  return { ok: errors.length === 0, errors };
}

export function assertValidPrototypeSchema(schema, registry) {
  const result = validatePrototypeSchema(schema, registry);
  if (!result.ok) throw new Error(`Invalid prototype schema:\n${result.errors.join('\n')}`);
  return schema;
}

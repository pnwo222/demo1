(function (global) {
  'use strict';

  const pages = [...global.UnicardSchoolPages, ...global.UnicardPlatformPages];
  const annotations = [];
  for (const page of pages) {
    const primaryField = page.tableFields[0];
    annotations.push(Object.freeze({
      id: `${page.id}-primary-field`,
      pageId: page.id,
      nodeKey: `${page.id}:table:${primaryField.key}`,
      title: `${primaryField.label}展示`,
      summary: `${primaryField.label}按“${primaryField.shape}”展示；来源为${primaryField.source}。`,
      source: primaryField.source,
    }));
    const sensitiveField = page.tableFields.find(field => field.sensitive);
    if (sensitiveField) {
      annotations.push(Object.freeze({
        id: `${page.id}-sensitive-${sensitiveField.key}`,
        pageId: page.id,
        nodeKey: `${page.id}:table:${sensitiveField.key}`,
        title: '敏感字段展示',
        summary: `${sensitiveField.label}在列表脱敏；明文查看和导出需要独立权限并记录审计。`,
        source: sensitiveField.source,
      }));
    }
    const controlledAction = page.actions.find(action => action.kind === 'controlled' || action.kind === 'danger');
    if (controlledAction) {
      annotations.push(Object.freeze({
        id: `${page.id}-action-${controlledAction.name}`,
        pageId: page.id,
        nodeKey: `${page.id}:action:${controlledAction.name}`,
        title: `${controlledAction.name}权限`,
        summary: `${controlledAction.name}仅对${controlledAction.roles.join('、')}可见，并在执行前二次确认。`,
        source: controlledAction.source,
      }));
    }
  }

  global.UnicardPageAnnotations = Object.freeze(annotations);
})(window);

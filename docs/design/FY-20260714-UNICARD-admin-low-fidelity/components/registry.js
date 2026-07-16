(function (global) {
  const components = global.SnowyPrototypeComponents || {};
  global.registerSnowyPrototypeComponents = function registerSnowyPrototypeComponents(app) {
    app.component('snowy-annotation-toolbar', components.SnowyAnnotationToolbar);
    app.component('snowy-shell', components.SnowyShell);
    app.component('snowy-banner-query-form', components.SnowyBannerQueryForm);
    app.component('snowy-banner-data-table', components.SnowyBannerDataTable);
    app.component('snowy-banner-page', components.SnowyBannerPage);
    app.component('snowy-menu-resource-page', components.SnowyMenuResourcePage);
    app.component('snowy-component-preset-page', components.SnowyComponentPresetPage);
    app.component('snowy-node-comment-composer', components.SnowyNodeCommentComposer);
    app.component('snowy-requirement-drawer', components.SnowyRequirementDrawer);
    app.component('snowy-content-form-drawer', components.SnowyContentFormDrawer);
    app.component('snowy-menu-form-drawer', components.SnowyMenuFormDrawer);
    app.component('snowy-import-modal', components.SnowyImportModal);
    app.component('snowy-column-settings-modal', components.SnowyColumnSettingsModal);
    app.component('snowy-annotation-editor-modal', components.SnowyAnnotationEditorModal);
    app.component('snowy-image-preview-modal', components.SnowyImagePreviewModal);
  };
})(window);

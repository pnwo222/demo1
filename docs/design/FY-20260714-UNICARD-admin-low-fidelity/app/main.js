(function (global) {
  const app = Vue.createApp({
    setup() {
      const context = global.createSnowyPrototypeContext();
      Vue.provide('snowyPrototypeContext', context);
      return context;
    },
    template: `
      <a-layout class="app-shell" :class="{ 'annotation-cursor': annotationEnabled && !nodeCommentOpen }">
        <snowy-annotation-toolbar></snowy-annotation-toolbar>
        <snowy-unicard-shell></snowy-unicard-shell>
        <snowy-requirement-drawer></snowy-requirement-drawer>
        <snowy-content-form-drawer></snowy-content-form-drawer>
        <snowy-menu-form-drawer></snowy-menu-form-drawer>
        <snowy-import-modal></snowy-import-modal>
        <snowy-column-settings-modal></snowy-column-settings-modal>
        <snowy-annotation-editor-modal></snowy-annotation-editor-modal>
        <snowy-image-preview-modal></snowy-image-preview-modal>
        <snowy-unicard-business-drawers></snowy-unicard-business-drawers>
      </a-layout>
    `
  });
  global.registerSnowyPrototypeComponents(app);
  app.use(antd);
  app.mount('#app');
})(window);

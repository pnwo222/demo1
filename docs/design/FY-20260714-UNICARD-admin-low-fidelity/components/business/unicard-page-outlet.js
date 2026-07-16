(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardPageOutlet = {
    name: 'SnowyUnicardPageOutlet',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <snowy-unicard-dashboard-pages v-if="activeBusinessPage.componentKey==='dashboard'" />
      <snowy-unicard-content-pages v-else-if="activeBusinessPage.componentKey==='content'" />
      <snowy-unicard-readonly-pages v-else-if="activeBusinessPage.componentKey==='readonly'" />
      <snowy-unicard-log-monitor-pages v-else-if="activeBusinessPage.componentKey==='logMonitor'" />
      <snowy-unicard-permission-guide-pages v-else-if="activeBusinessPage.componentKey==='permissionGuide'" />
      <snowy-unicard-governance-pages v-else-if="activeBusinessPage.componentKey==='governance'" />
      <snowy-unicard-role-grant-page v-else-if="activeBusinessPage.componentKey==='roleGrant'" />
      <snowy-unicard-audit-page v-else-if="activeBusinessPage.componentKey==='audit'" />
      <a-result v-else class="unicard-empty-error" status="error" title="页面组件未登记" :sub-title="activeBusinessPage.id+' 未映射到明确业务组件'" />`
  };
})(window);

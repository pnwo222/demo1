(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardPermissionGuidePages = {
    name: 'SnowyUnicardPermissionGuidePages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">Snowy 菜单资源、按钮权限与组织数据范围映射</div></div><a-tag color="blue">只读说明</a-tag></div>
        <a-alert message="菜单可见性由路由权限、按钮权限和组织数据范围共同控制；未授权入口隐藏，服务端仍需拒绝越权。" type="info" show-icon />
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <a-card class="table-card" :bordered="false"><a-table :columns="businessColumns" :data-source="permissionGuideRows" :pagination="businessPagination" row-key="_key" :scroll="{x:1200}"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a @click="openBusinessDetail(record)">查看权限说明</a></template><template v-else-if="['可见角色','按钮权限'].includes(column.key)"><a-space wrap><a-tag v-for="tag in String(record[column.key]).split('、')" :key="tag" color="blue">{{ tag }}</a-tag></a-space></template><template v-else-if="['路由路径','权限标识'].includes(column.key)"><a-typography-text code>{{ record[column.key] }}</a-typography-text></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
      </section>`
  };
})(window);

(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardAuditPage = {
    name: 'SnowyUnicardAuditPage',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">审核中心</h1><div class="unicard-page-caption">宁波一卡通审核数据只读对接视图</div></div><div class="unicard-role-list"><a-tag color="blue">平台管理员</a-tag><a-tag color="gold">审核人员</a-tag></div></div>
        <a-alert message="当前页面只展示来源系统审核数据；实际审核动作需在接口契约确认后另行设计。" type="info" show-icon />
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <a-card class="table-card" :bordered="false"><div class="unicard-toolbar"><span>审核数据按来源系统同步，只读展示</span><a-button @click="refreshBusinessRows">刷新</a-button></div><a-table :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a @click="openBusinessDetail(record)">查看审核数据详情</a></template><template v-else-if="businessField(column.key).shape.includes('状态')"><a-tag :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
      </section>`
  };
})(window);

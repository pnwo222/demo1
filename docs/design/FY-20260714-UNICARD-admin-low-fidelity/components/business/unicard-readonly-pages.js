(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardReadonlyPages = {
    name: 'SnowyUnicardReadonlyPages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">{{ activeBusinessPage.menuPath }}</div></div><div class="unicard-role-list"><a-tag v-for="role in activeBusinessPage.roles" :key="role" color="cyan">{{ role }}</a-tag></div></div>
        <div v-if="activeBusinessPage.pageType==='分组入口'" class="unicard-group-grid"><a-card v-for="(field,index) in activeBusinessPage.tableFields" :key="field.key" class="unicard-group-card" @click="navigateBusinessGroup(index)"><a-statistic :title="field.label" :value="businessMetricValue(index)" /><a-button type="link">进入页面 →</a-button></a-card></div>
        <template v-else>
          <a-alert v-if="activeBusinessPage.tableFields.some(field=>field.sensitive)" message="敏感字段已脱敏展示；明文查看与导出按独立权限审计。" type="warning" show-icon />
          <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields.slice(0,6)" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear :placeholder="'请输入'+field.label" /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
          <a-card class="table-card" :bordered="false"><div class="unicard-toolbar"><div class="unicard-toolbar-left"><a-button v-for="action in primaryBusinessActions" :key="action.name" :type="action.kind==='primary'?'primary':'default'" @click="runBusinessAction(action.name)">{{ action.name }}</a-button></div><a-tag color="default">同步只读</a-tag></div><a-table :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key" :scroll="{x:1200}"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a @click="openBusinessDetail(record)">查看详情</a></template><template v-else-if="businessField(column.key).sensitive"><span class="unicard-sensitive">{{ record[column.key] }}</span></template><template v-else-if="businessField(column.key).shape.includes('状态')"><a-tag :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
        </template>
      </section>`
  };
})(window);

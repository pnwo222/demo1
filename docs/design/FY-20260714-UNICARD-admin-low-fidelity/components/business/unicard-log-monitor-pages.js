(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardLogMonitorPages = {
    name: 'SnowyUnicardLogMonitorPages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">{{ activeBusinessPage.menuPath }}</div></div><div class="unicard-role-list"><a-tag v-for="role in activeBusinessPage.roles" :key="role" color="purple">{{ role }}</a-tag></div></div>
        <div class="unicard-status-strip"><div v-for="(state,index) in activeBusinessPage.states.slice(0,4)" :key="state.name" class="unicard-status-item"><a-badge :status="index===0?'success':index===1?'warning':'error'" :text="state.name" /><strong>{{ businessMetricValue(index) }}</strong></div></div>
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields.slice(0,5)" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear :placeholder="'请输入'+field.label" /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <a-card class="table-card" :bordered="false"><div class="unicard-toolbar"><span>最近上报：2026-07-16 09:30:18</span><a-space><a-button @click="refreshBusinessRows">刷新</a-button><a-tag color="green">自动刷新 30s</a-tag></a-space></div><a-table :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key" :scroll="{x:1100}"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a @click="openBusinessDetail(record)">查看详情</a></template><template v-else-if="businessField(column.key).shape.includes('状态')||businessField(column.key).shape.includes('告警')"><a-tag :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else-if="businessField(column.key).sensitive"><span class="unicard-sensitive">{{ record[column.key] }}</span></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
      </section>`
  };
})(window);

(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardDashboardPages = {
    name: 'SnowyUnicardDashboardPages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header">
          <div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">{{ activeBusinessPage.menuPath }}</div></div>
          <div class="unicard-role-list"><a-tag v-for="role in activeBusinessPage.roles" :key="role" color="blue">{{ role }}</a-tag></div>
        </div>
        <a-card class="query-card" :bordered="false">
          <div class="unicard-query-grid">
            <a-form-item v-for="field in activeBusinessPage.queryFields" :key="field.key" :label="field.label"><a-range-picker v-if="field.shape.includes('日期')" v-model:value="businessQuery[field.key]" style="width:100%" /><a-select v-else v-model:value="businessQuery[field.key]" allow-clear :placeholder="'请选择'+field.label" :options="businessSelectOptions(field)" /></a-form-item>
            <div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div>
          </div>
        </a-card>
        <div class="unicard-metric-grid">
          <a-card v-for="(field,index) in activeBusinessPage.tableFields.slice(0,4)" :key="field.key" class="unicard-metric-card" :bordered="false" @click="runBusinessAction('查看指标详情')"><div class="unicard-metric-label">{{ field.label }}</div><div class="unicard-metric-value">{{ businessMetricValue(index) }}</div><div class="unicard-metric-trend">较上期 +{{ 3+index }}.{{ index }}%</div></a-card>
        </div>
        <div class="unicard-chart-grid">
          <a-card class="table-card unicard-chart" title="趋势分析" :bordered="false"><div class="unicard-bar-list"><div v-for="(height,index) in [48,72,58,86,68,94,78]" :key="index" class="unicard-bar" :style="{height:height+'%'}"><span>{{ index+10 }}日</span></div></div></a-card>
          <a-card class="table-card" title="业务概览" :bordered="false"><a-list size="small" :data-source="activeBusinessPage.tableFields.slice(0,5)"><template #renderItem="{item,index}"><a-list-item><span>{{ item.label }}</span><a-tag :color="index===4?'orange':'green'">{{ index===4?'待关注':'正常' }}</a-tag></a-list-item></template></a-list><a-button block @click="runBusinessAction('报表导出')">报表导出</a-button></a-card>
        </div>
      </section>`
  };
})(window);

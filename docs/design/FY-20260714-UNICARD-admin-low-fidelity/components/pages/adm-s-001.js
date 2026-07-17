(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyAdmS001Page = {
    name: 'SnowyAdmS001Page',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page explicit-business-page" data-page-id="ADM-S-001">
        <div class="query-card" @mousemove.capture="hoverNodeForComment" @click.capture="selectNodeForComment">
          <div class="unicard-page-header">
            <div><h1 class="unicard-page-title">业务首页</h1><div class="unicard-page-caption">高校一卡通 / 学校端 / 业务首页 · 数据看板</div></div>
            <div class="unicard-role-list"><a-tag color="blue">学校管理员</a-tag></div>
          </div>
          <a-form layout="vertical">
            <a-row :gutter="16"><a-col :xs="24" :md="8"><a-form-item label="统计周期"><a-range-picker v-model:value="businessQuery['统计周期']" style="width:100%" /></a-form-item></a-col></a-row>
            <a-space><a-button type="primary" @click="searchBusinessRows">⌕ 查询</a-button><a-button @click="resetBusinessQuery">重置</a-button></a-space>
          </a-form>
        </div>
        <div class="table-card">
          <div class="unicard-toolbar">
            <div class="unicard-toolbar-left"><a-button type="primary" @click="runBusinessAction('报表导出')">报表导出</a-button></div>
            <div class="unicard-toolbar-right">
              <span class="annotation-host unicard-field-rule" data-annotation-id="ADM-S-001-primary-field"><span class="muted">主字段：专区用户数据</span><button v-if="hasAnnotation('ADM-S-001-primary-field')" class="annotation-pin" type="button" @click.stop="showAnnotation('ADM-S-001-primary-field')">1</button></span>
              <a-tooltip title="刷新"><a-button shape="circle" @click="refreshBusinessRows">↻</a-button></a-tooltip>
            </div>
          </div>
          <snowy-unicard-school-dashboard-charts></snowy-unicard-school-dashboard-charts>
          <a-table row-key="_key" :columns="[{title:'专区用户数据',dataIndex:'专区用户数据',key:'c0',width:150,ellipsis:true},{title:'校园用户数据',dataIndex:'校园用户数据',key:'c1',width:150,ellipsis:true},{title:'图表',dataIndex:'图表',key:'c2',width:150,ellipsis:true},{title:'报表',dataIndex:'报表',key:'c3',width:150,ellipsis:true},{title:'操作',key:'op',fixed:'right',width:210}]" :data-source="businessRows" :pagination="{current:businessPagination.current,pageSize:businessPagination.pageSize,total:businessRows.length,showSizeChanger:true,showTotal:t=>'共 '+t+' 条'}" :scroll="{x:1000}" @change="changeBusinessPage">
            <template #bodyCell="{column,record}"><template v-if="column.key==='op'"><a @click="runBusinessAction('查看指标详情',record)">查看指标详情</a></template></template>
          </a-table>
        </div>
        <a-drawer v-model:open="businessDrawerOpen" :title="businessDrawerTitle" width="560" destroy-on-close>
          <a-descriptions bordered :column="1" size="small"><a-descriptions-item label="专区用户数据">{{ businessDetailRecord['专区用户数据']||'—' }}</a-descriptions-item><a-descriptions-item label="校园用户数据">{{ businessDetailRecord['校园用户数据']||'—' }}</a-descriptions-item><a-descriptions-item label="统计口径">本校专区注册、校园身份同步、日活跃及社保卡码应用统计</a-descriptions-item><a-descriptions-item label="更新时间">2026-07-17 10:30</a-descriptions-item></a-descriptions>
          <template #footer><div style="text-align:right"><a-button @click="businessDrawerOpen=false">关闭</a-button></div></template>
        </a-drawer>
      </section>`
  };
})(window);

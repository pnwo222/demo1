(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardGovernancePages = {
    name: 'SnowyUnicardGovernancePages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">{{ activeBusinessPage.menuPath }}</div></div><div class="unicard-role-list"><a-tag color="blue">平台管理员</a-tag><a-tag>Snowy 资源权限</a-tag></div></div>
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <div class="resource-layout">
          <a-card v-if="['ADM-P-002','ADM-P-006'].includes(activeBusinessPage.id)" class="resource-tree-card" :bordered="false" :title="activeBusinessPage.id==='ADM-P-002'?'学校组织树':'菜单资源树'"><a-tree :tree-data="governanceTreeData" default-expand-all :selected-keys="governanceTreeSelection" @select="selectGovernanceTree" /></a-card>
          <a-card class="table-card" :bordered="false" style="min-width:0;flex:1"><div class="unicard-toolbar"><div class="unicard-toolbar-left"><a-button v-for="action in primaryBusinessActions" :key="action.name" :type="action.kind==='primary'?'primary':'default'" :danger="action.kind==='danger'" @click="runBusinessAction(action.name)">{{ action.name }}</a-button></div><a-button @click="refreshBusinessRows">刷新</a-button></div><a-table @change="changeBusinessPage" :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key" :scroll="{x:1100}"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a-dropdown><a>操作 ▾</a><template #overlay><a-menu><a-menu-item v-for="action in rowBusinessActions" :key="action.name" @click="runBusinessAction(action.name,record)">{{ action.name }}</a-menu-item></a-menu></template></a-dropdown></template><template v-else-if="businessField(column.key).shape.includes('状态')"><a-switch v-if="businessField(column.key).shape.includes('开关')" :checked="record[column.key]!=='停用'" @change="runBusinessAction('切换状态',record)" /><a-tag v-else :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else-if="businessField(column.key).shape.includes('标签')"><a-tag color="blue">{{ record[column.key] }}</a-tag></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
        </div>
      </section>`
  };
})(window);

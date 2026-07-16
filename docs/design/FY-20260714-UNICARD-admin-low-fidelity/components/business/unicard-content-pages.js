(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardContentPages = {
    name: 'SnowyUnicardContentPages',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">{{ activeBusinessPage.title }}</h1><div class="unicard-page-caption">{{ activeBusinessPage.menuPath }}</div></div><div class="unicard-role-list"><a-tag v-for="role in activeBusinessPage.roles" :key="role" color="blue">{{ role }}</a-tag></div></div>
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields.slice(0,5)" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear :placeholder="'请输入'+field.label" /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <a-card class="table-card" :bordered="false">
          <div class="unicard-toolbar"><div class="unicard-toolbar-left"><a-button v-for="action in primaryBusinessActions" :key="action.name" :type="action.kind==='primary'?'primary':'default'" :danger="action.kind==='danger'" @click="runBusinessAction(action.name)">{{ action.name }}</a-button></div><div class="unicard-toolbar-right"><a-button @click="refreshBusinessRows">刷新</a-button><a-button @click="openBusinessColumnSettings">列设置</a-button></div></div>
          <a-table :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key" :scroll="{x:1100}"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a-space><a v-for="action in rowBusinessActions" :key="action.name" @click="runBusinessAction(action.name,record)">{{ action.name }}</a></a-space></template><template v-else-if="businessField(column.key).shape.includes('图片')"><img class="unicard-thumbnail" :src="businessImage" alt="业务图片" @click="previewBusinessImage(record,column.key)" /></template><template v-else-if="businessField(column.key).shape.includes('状态')"><a-tag :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else>{{ record[column.key] }}</template></template></a-table>
        </a-card>
      </section>`
  };
})(window);

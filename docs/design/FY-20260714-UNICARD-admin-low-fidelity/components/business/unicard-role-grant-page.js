(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardRoleGrantPage = {
    name: 'SnowyUnicardRoleGrantPage',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <section class="unicard-page" :data-page-id="activeBusinessPage.id">
        <div class="unicard-page-header"><div><h1 class="unicard-page-title">角色管理</h1><div class="unicard-page-caption">角色 CRUD、菜单资源树授权与组织数据范围分离</div></div><a-tag color="red">高风险权限操作</a-tag></div>
        <a-alert message="授权变更必须校验操作者可授权范围，禁止自我提权，并记录变更前后权限。" type="warning" show-icon />
        <a-card class="query-card" :bordered="false"><div class="unicard-query-grid"><a-form-item v-for="field in activeBusinessPage.queryFields" :key="field.key" :label="field.label"><a-input v-model:value="businessQuery[field.key]" allow-clear /></a-form-item><div class="unicard-query-actions"><a-button @click="resetBusinessQuery">重置</a-button><a-button type="primary" @click="searchBusinessRows">查询</a-button></div></div></a-card>
        <a-card class="table-card" :bordered="false"><div class="unicard-toolbar"><div class="unicard-toolbar-left"><a-button v-for="action in primaryBusinessActions" :key="action.name" :type="action.kind==='primary'?'primary':'default'" :danger="action.kind==='danger'" @click="runBusinessAction(action.name)">{{ action.name }}</a-button></div></div><a-table :columns="businessColumns" :data-source="businessRows" :pagination="businessPagination" row-key="_key"><template #bodyCell="{column,record}"><template v-if="column.key==='__actions'"><a-space><a @click="openBusinessDetail(record)">详情</a><a @click="openRoleGrant(record)">授权</a></a-space></template><template v-else-if="businessField(column.key).shape.includes('状态')"><a-tag :color="businessStatusColor(record[column.key])">{{ record[column.key] }}</a-tag></template><template v-else>{{ record[column.key] }}</template></template></a-table></a-card>
        <a-drawer v-model:open="roleGrantOpen" title="角色授权" width="720" :destroy-on-close="true"><a-tabs><a-tab-pane key="menu" tab="菜单与按钮权限"><a-tree v-model:checked-keys="roleGrantCheckedKeys" checkable default-expand-all :tree-data="roleGrantTreeData" /></a-tab-pane><a-tab-pane key="data" tab="组织数据范围"><a-radio-group v-model:value="roleGrantScope"><a-space direction="vertical"><a-radio value="self">仅本人数据</a-radio><a-radio value="org">本组织及下级</a-radio><a-radio value="custom">自定义组织范围</a-radio></a-space></a-radio-group><a-tree v-if="roleGrantScope==='custom'" v-model:checked-keys="roleGrantOrgKeys" checkable default-expand-all :tree-data="governanceTreeData" style="margin-top:16px" /></a-tab-pane><a-tab-pane key="change" tab="变更核对"><a-descriptions bordered :column="1"><a-descriptions-item label="变更前权限">{{ roleGrantBefore }}</a-descriptions-item><a-descriptions-item label="变更后权限">{{ roleGrantAfter }}</a-descriptions-item></a-descriptions></a-tab-pane></a-tabs><template #extra><a-space><a-button @click="roleGrantOpen=false">取消</a-button><a-button type="primary" @click="saveRoleGrant">确认授权</a-button></a-space></template></a-drawer>
      </section>`
  };
})(window);

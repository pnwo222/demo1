(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyMenuResourcePage = {
    name: 'SnowyMenuResourcePage',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `              <section v-else-if="currentPage === 'menuResource'" class="tree-layout">
                <div class="tree-card annotation-host">
                  <button v-if="hasAnnotation('menu-tree')" class="annotation-pin" type="button" @click.stop="showAnnotation('menu-tree')">1</button>
                  <a-space style="margin-bottom:12px">
                    <a-button type="primary" size="small" @click="menuDrawerOpen = true"><span class="mini-icon">＋</span>新增</a-button>
                    <a-button size="small" @click="refresh"><span class="mini-icon">↻</span>刷新</a-button>
                  </a-space>
                  <div class="resource-node" :class="{active: activeResource === '内容管理'}" @click="setResource('内容管理')">内容管理 <span>3</span></div>
                  <div class="resource-node" :class="{active: activeResource === '首页 Banner'}" @click="setResource('首页 Banner')">　首页 Banner <span>6</span></div>
                  <div class="resource-node" :class="{active: activeResource === '通知公告'}" @click="setResource('通知公告')">　通知公告 <span>4</span></div>
                  <div class="resource-node" :class="{active: activeResource === '师生管理'}" @click="setResource('师生管理')">师生管理 <span>9</span></div>
                </div>
                <div class="table-card annotation-host">
                  <button v-if="hasAnnotation('menu-detail')" class="annotation-pin" type="button" style="right:36px" @click.stop="showAnnotation('menu-detail')">2</button>
                  <h1 class="page-title">菜单资源</h1>
                  <a-descriptions bordered size="small" :column="2">
                    <a-descriptions-item label="当前菜单">{{ activeResource }}</a-descriptions-item>
                    <a-descriptions-item label="可见角色">管理员、运营人员</a-descriptions-item>
                    <a-descriptions-item label="路由地址">/content/banner</a-descriptions-item>
                    <a-descriptions-item label="操作范围">查询、新增、编辑、删除、导入、导出</a-descriptions-item>
                  </a-descriptions>
                  <a-divider />
                  <a-space class="annotation-host">
                    <button v-if="hasAnnotation('menu-actions')" class="annotation-pin" type="button" @click.stop="showAnnotation('menu-actions')">3</button>
                    <a-button type="primary" @click="menuDrawerOpen = true">编辑菜单</a-button>
                    <a-button @click="topAction('授权')">角色授权</a-button>
                    <a-button danger @click="removeRow({ id: -1, title: activeResource })">删除菜单</a-button>
                  </a-space>
                </div>
              </section>`
  };
})(window);

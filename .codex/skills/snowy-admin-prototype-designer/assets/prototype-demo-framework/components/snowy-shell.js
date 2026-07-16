(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyShell = {
    name: 'SnowyShell',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-layout-sider class="snowy-sider" :width="232" :collapsed="collapsed" collapsible :trigger="null">
            <div class="brand">
              <div class="brand-mark">
                <img v-if="prototypeMeta.logoImage" :src="prototypeMeta.logoImage" alt="Logo" style="width:100%;height:100%;object-fit:cover;border-radius:8px" />
                <span v-else>{{ prototypeMeta.logoText }}</span>
              </div>
              <span v-show="!collapsed">{{ prototypeMeta.systemName }}</span>
            </div>
            <a-menu
              mode="inline"
              theme="dark"
              :items="menuItems"
              :selected-keys="selectedKeys"
              :open-keys="openKeys"
              @click="setPage"
              @openChange="onOpenChange"
            />
          </a-layout-sider>
          <a-layout>
            <header class="snowy-header">
              <div class="header-left">
                <span class="icon-action" title="折叠菜单" @click="collapsed = !collapsed">
                  <span class="mini-icon">{{ collapsed ? '☰' : '≡' }}</span>
                </span>
                <a-breadcrumb>
                  <a-breadcrumb-item>首页</a-breadcrumb-item>
                  <a-breadcrumb-item>业务运营</a-breadcrumb-item>
                  <a-breadcrumb-item>{{ pageTitle }}</a-breadcrumb-item>
                </a-breadcrumb>
              </div>
              <div class="header-right">
                <span class="icon-action" title="刷新" @click="topAction('刷新')"><span class="mini-icon">↻</span></span>
                <span class="icon-action" title="全屏" @click="topAction('全屏')"><span class="mini-icon">⛶</span></span>
                <span class="icon-action" title="通知" @click="topAction('通知')"><span class="mini-icon">●</span></span>
                <a-avatar style="background:#1677ff">管</a-avatar>
                <span>管理员</span>
              </div>
            </header>
            <div class="tabs-row">
              <a-tag color="blue">首页</a-tag>
              <a-tag color="processing">{{ activeTab }}</a-tag>
            </div>
            <a-layout-content class="content" @mousemove.capture="hoverNodeForComment" @mouseleave="clearHoverNode" @click.capture="selectNodeForComment">
              <snowy-banner-page v-if="currentPage === 'banner'"></snowy-banner-page>
              <snowy-menu-resource-page v-else-if="currentPage === 'menuResource'"></snowy-menu-resource-page>
              <snowy-component-preset-page v-else></snowy-component-preset-page>
              <snowy-node-comment-composer></snowy-node-comment-composer>
            </a-layout-content>
          </a-layout>`
  };
})(window);

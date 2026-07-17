(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardShell = {
    name: 'SnowyUnicardShell',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <a-layout-sider class="snowy-sider" :width="232" :collapsed="collapsed" collapsible :trigger="null">
        <div class="brand"><div class="brand-mark"><span>{{ prototypeMeta.logoText }}</span></div><span v-show="!collapsed">{{ prototypeMeta.systemName }}</span></div>
        <a-menu mode="inline" theme="dark" :items="menuItems" :selected-keys="selectedKeys" :open-keys="openKeys" @click="setPage" @openChange="onOpenChange" />
      </a-layout-sider>
      <a-layout class="unicard-shell">
        <header class="snowy-header">
          <div class="header-left"><span class="icon-action" title="折叠菜单" @click="collapsed=!collapsed"><span class="mini-icon">{{ collapsed?'☰':'≡' }}</span></span><a-breadcrumb><a-breadcrumb-item>首页</a-breadcrumb-item><a-breadcrumb-item>{{ activeBusinessPage.id.startsWith('ADM-S-')?'学校端':'平台端' }}</a-breadcrumb-item><a-breadcrumb-item>{{ pageTitle }}</a-breadcrumb-item></a-breadcrumb></div>
          <div class="header-right"><a href="coverage.html" target="_blank">覆盖矩阵</a><span class="icon-action" title="刷新" @click="refreshBusinessRows"><span class="mini-icon">↻</span></span><span class="icon-action" title="全屏" @click="topAction('全屏')"><span class="mini-icon">⛶</span></span><span class="icon-action" title="通知" @click="topAction('通知')"><span class="mini-icon">●</span></span><a-select v-model:value="currentRole" style="width:132px" :options="availableRoleOptions" /><a-avatar style="background:#1677ff">管</a-avatar></div>
        </header>
        <div class="tabs-row"><a-tag color="blue">高校一卡通</a-tag><a-tag color="processing">{{ activeTab }}</a-tag></div>
        <div class="unicard-page-nav" aria-label="页面快捷导航"><a-button v-for="page in businessPages" :key="page.id" size="small" :type="currentPage===page.id?'primary':'default'" :class="'prototype-menu-'+page.id" @click="setPage({key:page.id})">{{ page.title }}</a-button></div>
        <main class="content" @mousemove.capture="hoverNodeForComment" @mouseleave="clearHoverNode" @click.capture="selectNodeForComment"><snowy-unicard-page-outlet></snowy-unicard-page-outlet><snowy-unicard-node-comment-composer></snowy-unicard-node-comment-composer></main>
      </a-layout>`
  };
})(window);

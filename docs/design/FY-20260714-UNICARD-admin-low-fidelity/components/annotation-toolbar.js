(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyAnnotationToolbar = {
    name: 'SnowyAnnotationToolbar',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <div class="annotation-toolbar" :class="{ collapsed: annotationToolbarCollapsed }">
            <button class="annotation-tool-button icon-only" type="button" :title="annotationToolbarCollapsed ? '展开标注工具栏' : '隐藏标注工具栏'" @click="annotationToolbarCollapsed = !annotationToolbarCollapsed">
              <svg v-if="annotationToolbarCollapsed" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 6h8M6 12h12M9 18h6" stroke-width="2" stroke-linecap="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 14l5-5 5 5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <template v-if="!annotationToolbarCollapsed">
              <span class="annotation-tool-meta">
                <span class="annotation-tool-dot" :class="{ active: annotationEnabled }"></span>
                标注模式
              </span>
              <button class="annotation-tool-button" :class="{ primary: annotationEnabled }" type="button" @click="toggleAnnotationMode">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v5A2.5 2.5 0 0 1 16.5 15H12l-4 4v-4h-.5A2.5 2.5 0 0 1 5 12.5v-5Z" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M8.5 9h7M8.5 11.5H13" stroke-width="1.8" stroke-linecap="round" />
                </svg>
                {{ annotationEnabled ? '关闭' : '开启' }}
              </button>
              <button class="annotation-tool-button" type="button" title="查看和编辑当前页面整体需求" @click="openRequirementDrawer">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 3.5h8l4 4V20H6V3.5Z" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M14 3.5V8h4M9 12h6M9 15.5h6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                页面需求
              </button>
              <button class="annotation-tool-button" type="button" title="另存为包含当前标注的 HTML" @click="saveAsAnnotatedHtml">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 4h9l3 3v13H6V4Z" stroke-width="1.8" stroke-linejoin="round" />
                  <path d="M9 4v5h6V4M9 16h6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                另存为
              </button>
              <button class="annotation-tool-button danger" type="button" title="删除当前页面全部用户标注和修改" @click="deleteAllAnnotations">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                全部删除
              </button>
            </template>
          </div>`
  };
})(window);

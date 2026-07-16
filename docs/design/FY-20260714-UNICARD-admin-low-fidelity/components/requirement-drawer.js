(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyRequirementDrawer = {
    name: 'SnowyRequirementDrawer',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-drawer :title="requirementDrawerTitle" :z-index="2200" width="520" v-model:open="requirementDrawerOpen">
            <a-textarea
              v-if="requirementEditing"
              v-model:value="requirementDraft"
              :auto-size="{ minRows: 12, maxRows: 24 }"
              placeholder="请输入当前页面的整体需求描述"
              autofocus
            />
            <div v-else class="annotation-editable requirement-preview">
              {{ requirementDraft || '暂无整体需求描述' }}
              <button class="annotation-edit-action" type="button" title="编辑整体需求描述" @click.stop="requirementEditing = true">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 20h9" stroke-width="1.8" stroke-linecap="round" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-width="1.8" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
            <template #footer>
              <div style="display:flex;justify-content:flex-end;gap:8px">
                <a-button v-if="requirementEditing" @click="cancelRequirementEdit">取消</a-button>
                <a-button v-else @click="requirementDrawerOpen = false">关闭</a-button>
                <a-button v-if="requirementDirty" type="primary" :disabled="!requirementDraft.trim()" @click="savePageRequirement">保存</a-button>
              </div>
            </template>
          </a-drawer>`
  };
})(window);

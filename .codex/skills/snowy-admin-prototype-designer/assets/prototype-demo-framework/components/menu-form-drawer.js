(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyMenuFormDrawer = {
    name: 'SnowyMenuFormDrawer',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-drawer title="菜单表单" width="520" v-model:open="menuDrawerOpen">
            <a-form layout="vertical">
              <a-form-item label="上级菜单"><a-select v-model:value="menuForm.parent"><a-select-option value="内容管理">内容管理</a-select-option><a-select-option value="系统能力">系统能力</a-select-option></a-select></a-form-item>
              <a-form-item label="显示名称"><a-input v-model:value="menuForm.name" /></a-form-item>
              <a-form-item label="路由地址"><a-input v-model:value="menuForm.path" /></a-form-item>
              <a-form-item label="权限名称"><a-input v-model:value="menuForm.permissionName" /></a-form-item>
              <a-form-item label="是否可见"><a-switch v-model:checked="menuForm.visible" /></a-form-item>
              <a-form-item label="排序"><a-input-number v-model:value="menuForm.sort" style="width:100%" /></a-form-item>
            </a-form>
            <template #footer>
              <a-space><a-button @click="menuDrawerOpen = false">取消</a-button><a-button type="primary" @click="saveMenu">保存</a-button></a-space>
            </template>
          </a-drawer>`
  };
})(window);

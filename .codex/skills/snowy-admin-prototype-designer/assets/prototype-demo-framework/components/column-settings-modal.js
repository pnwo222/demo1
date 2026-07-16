(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyColumnSettingsModal = {
    name: 'SnowyColumnSettingsModal',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-modal title="列设置" v-model:open="columnOpen" ok-text="确定" cancel-text="取消" @ok="columnOpen = false">
            <a-checkbox-group v-model:value="checkedColumns" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
              <a-checkbox value="title">标题</a-checkbox>
              <a-checkbox value="cover">封面图</a-checkbox>
              <a-checkbox value="category">栏目</a-checkbox>
              <a-checkbox value="position">发布位置</a-checkbox>
              <a-checkbox value="sort">排序</a-checkbox>
              <a-checkbox value="audit">发布状态</a-checkbox>
              <a-checkbox value="status">是否显示</a-checkbox>
              <a-checkbox value="attachment">附件</a-checkbox>
              <a-checkbox value="createdAt">创建时间</a-checkbox>
              <a-checkbox value="action">操作</a-checkbox>
            </a-checkbox-group>
          </a-modal>`
  };
})(window);

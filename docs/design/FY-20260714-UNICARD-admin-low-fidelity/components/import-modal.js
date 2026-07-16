(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyImportModal = {
    name: 'SnowyImportModal',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-modal title="导入数据" v-model:open="importOpen" ok-text="开始导入" cancel-text="取消" @ok="saveImport">
            <a-alert type="info" show-icon message="请选择 Excel 文件，导入后展示成功和失败明细。" style="margin-bottom:12px" />
            <a-upload-dragger :before-upload="() => false" accept=".xlsx,.xls">
              <p class="ant-upload-drag-icon"><span class="mini-icon" style="font-size:28px">⇧</span></p>
              <p class="ant-upload-text">点击或拖拽文件到此区域</p>
            </a-upload-dragger>
          </a-modal>`
  };
})(window);

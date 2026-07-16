(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyImagePreviewModal = {
    name: 'SnowyImagePreviewModal',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-modal :title="previewTitle" v-model:open="previewOpen" :footer="null">
            <img v-if="previewImage" :src="previewImage" style="width:100%;border-radius:4px" alt="图片预览" />
          </a-modal>`
  };
})(window);

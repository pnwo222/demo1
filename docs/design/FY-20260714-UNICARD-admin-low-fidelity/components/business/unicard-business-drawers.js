(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardBusinessDrawers = {
    name: 'SnowyUnicardBusinessDrawers',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <div>
        <a-drawer class="unicard-business-drawer" v-model:open="businessDrawerOpen" :title="businessDrawerTitle" width="620" :destroy-on-close="true">
          <a-form v-if="businessDrawerMode!=='detail'" layout="vertical">
            <a-form-item v-for="field in activeBusinessPage.formFields" :key="field.key" :label="field.label" :required="['图片标题','应用名称','公告标题','文章标题','活动标题','学校名称','用户账号','角色名称','菜单名称'].includes(field.label)">
              <template v-if="field.shape.includes('图片')||['上传图片','展示图片','封面图片','活动图片','应用图标','图标'].includes(field.label)">
                <a-upload list-type="picture-card" :file-list="businessUploadFiles" :before-upload="beforeBusinessUpload" @preview="previewBusinessUpload" @remove="removeBusinessUpload" accept="image/*"><div v-if="businessUploadFiles.length<1"><div style="font-size:20px">＋</div><div>选择图片</div></div></a-upload>
                <a-space><a-button size="small" @click="previewBusinessImage()">预览图片</a-button><a-button size="small" danger @click="removeBusinessUpload">移除图片</a-button></a-space>
              </template>
              <a-input-number v-else-if="field.shape==='数字'||field.label==='排序'||field.label==='优先级'" v-model:value="businessForm[field.key]" style="width:100%" />
              <a-textarea v-else-if="field.label.includes('内容')" v-model:value="businessForm[field.key]" :rows="5" />
              <a-switch v-else-if="field.shape.includes('开关')||field.label.includes('状态')" v-model:checked="businessForm[field.key]" />
              <a-input v-else v-model:value="businessForm[field.key]" :placeholder="'请输入'+field.label" />
            </a-form-item>
          </a-form>
          <a-descriptions v-else bordered :column="1" size="small"><a-descriptions-item v-for="field in activeBusinessPage.detailFields" :key="field.key" :label="field.label"><span :class="{'unicard-sensitive':field.sensitive}">{{ businessDetailRecord[field.key]||'—' }}</span></a-descriptions-item></a-descriptions>
          <template #footer><a-space><a-button @click="businessDrawerOpen=false">取消</a-button><a-button v-if="businessDrawerMode!=='detail'" type="primary" @click="saveBusinessForm">保存</a-button><a-button v-else @click="businessDrawerOpen=false">关闭</a-button></a-space></template>
        </a-drawer>
        <a-modal v-model:open="businessPreviewOpen" title="图片预览" :footer="null"><img :src="businessPreviewImage" alt="图片预览" style="width:100%;max-height:520px;object-fit:contain" /></a-modal>
      </div>`
  };
})(window);

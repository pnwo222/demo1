(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyContentFormDrawer = {
    name: 'SnowyContentFormDrawer',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-drawer :title="drawerMode === 'detail' ? '内容详情' : drawerMode === 'edit' ? '编辑内容' : '新增内容'" width="560" v-model:open="drawerOpen">
            <div class="annotation-host" style="height:0">
              <button v-if="hasAnnotation('banner-drawer-cover')" class="annotation-pin" type="button" style="top:-18px;right:0" @click.stop="showAnnotation('banner-drawer-cover')">6</button>
            </div>
            <a-form layout="vertical">
              <a-form-item label="标题" required>
                <a-input v-model:value="formState.title" :disabled="drawerMode === 'detail'" placeholder="请输入标题" />
              </a-form-item>
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-form-item label="栏目">
                    <a-select v-model:value="formState.category" :disabled="drawerMode === 'detail'">
                      <a-select-option value="首页 Banner">首页 Banner</a-select-option>
                      <a-select-option value="通知公告">通知公告</a-select-option>
                      <a-select-option value="专业介绍">专业介绍</a-select-option>
                      <a-select-option value="招生服务">招生服务</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="发布位置">
                    <a-select v-model:value="formState.position" :disabled="drawerMode === 'detail'">
                      <a-select-option value="后台首页">后台首页</a-select-option>
                      <a-select-option value="学校专区">学校专区</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="12">
                <a-col :span="12"><a-form-item label="排序"><a-input-number v-model:value="formState.sort" :disabled="drawerMode === 'detail'" style="width:100%" /></a-form-item></a-col>
                <a-col :span="12"><a-form-item label="状态"><a-switch v-model:checked="formState.status" :disabled="drawerMode === 'detail'" /></a-form-item></a-col>
              </a-row>
              <a-form-item label="封面图">
                <a-upload
                  list-type="picture-card"
                  :file-list="formState.uploadFiles"
                  :before-upload="beforeCoverUpload"
                  @preview="previewCover"
                  @remove="removeCover"
                  accept="image/*"
                  :disabled="drawerMode === 'detail'"
                >
                  <div v-if="drawerMode !== 'detail' && formState.uploadFiles.length < 1">
                    <div style="font-size:20px">＋</div>
                    <div>选择图片</div>
                  </div>
                </a-upload>
              </a-form-item>
              <a-form-item label="内容摘要">
                <a-textarea v-model:value="formState.summary" :disabled="drawerMode === 'detail'" :rows="4" placeholder="请输入内容摘要" />
              </a-form-item>
            </a-form>
            <template #footer>
              <a-space>
                <a-button @click="drawerOpen = false">取消</a-button>
                <a-button v-if="drawerMode !== 'detail'" type="primary" @click="saveForm">保存</a-button>
              </a-space>
            </template>
          </a-drawer>`
  };
})(window);

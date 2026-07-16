(function (global) {
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyAnnotationEditorModal = {
    name: 'SnowyAnnotationEditorModal',
    setup() {
      return Vue.inject('snowyPrototypeContext');
    },
    template: `          <a-modal
            :title="annotationEditorMode === 'add' ? '新增标注' : '注释 ' + annotationForm.index"
            v-model:open="annotationEditorOpen"
            :z-index="2300"
            ok-text="保存"
            cancel-text="取消"
            @ok="saveAnnotation"
          >
            <template #footer>
              <div class="annotation-modal-footer">
                <a-button
                  v-if="annotationEditorMode === 'edit'"
                  danger
                  :title="annotationDeleteLabel"
                  :aria-label="annotationDeleteLabel"
                  @click="deleteAnnotation"
                >
                  删除
                </a-button>
                <span v-else></span>
                <div class="annotation-modal-actions">
                  <a-button @click="annotationEditorOpen = false">取消</a-button>
                  <a-button v-if="annotationDirty" type="primary" @click="saveAnnotation">保存</a-button>
                </div>
              </div>
            </template>
            <a-form v-if="annotationEditorMode === 'add'" layout="vertical">
              <a-form-item label="序号">
                <a-input-number v-model:value="annotationForm.index" :min="1" style="width:100%" />
              </a-form-item>
              <a-form-item label="标题" required>
                <a-input v-model:value="annotationForm.title" placeholder="请输入具体需求点标题" />
              </a-form-item>
              <a-form-item label="内容" required>
                <a-textarea v-model:value="annotationForm.summary" :auto-size="{ minRows: 2, maxRows: 8 }" placeholder="请输入评论内容或具体规则" />
              </a-form-item>
              <a-form-item label="详细说明">
                <a-textarea v-model:value="annotationForm.detail" :rows="4" placeholder="请输入详细说明、来源或待确认点" />
              </a-form-item>
            </a-form>
            <div v-else class="annotation-detail-view">
              <div class="annotation-detail-title">
                <div style="flex:1">
                  <a-input
                    v-if="annotationEditingField === 'title'"
                    v-model:value="annotationForm.title"
                    @blur="annotationEditingField = ''"
                    @pressEnter="annotationEditingField = ''"
                    autofocus
                  />
                  <div v-else class="annotation-editable">
                    <strong>{{ annotationForm.title || '注释' }}</strong>
                    <button class="annotation-edit-action" type="button" title="编辑标题" @click.stop="annotationEditingField = 'title'">
                      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 20h9" stroke-width="1.8" stroke-linecap="round" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-width="1.8" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <a-textarea
                  v-if="annotationEditingField === 'summary'"
                  v-model:value="annotationForm.summary"
                  :auto-size="{ minRows: 2, maxRows: 8 }"
                  @blur="annotationEditingField = ''"
                  autofocus
                />
                <div v-else class="annotation-editable">
                  {{ annotationForm.summary || '点击填写内容' }}
                  <button class="annotation-edit-action" type="button" title="编辑内容" @click.stop="annotationEditingField = 'summary'">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 20h9" stroke-width="1.8" stroke-linecap="round" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-width="1.8" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="annotationForm.detail || annotationEditingField === 'detail'">
                <a-textarea
                  v-if="annotationEditingField === 'detail'"
                  v-model:value="annotationForm.detail"
                  :rows="4"
                  @blur="annotationEditingField = ''"
                  autofocus
                />
                <div v-else class="annotation-editable muted">
                  {{ annotationForm.detail }}
                  <button class="annotation-edit-action" type="button" title="编辑详细说明" @click.stop="annotationEditingField = 'detail'">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 20h9" stroke-width="1.8" stroke-linecap="round" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke-width="1.8" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </a-modal>`
  };
})(window);

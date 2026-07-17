(function (global) {
  'use strict';
  global.SnowyPrototypeComponents = global.SnowyPrototypeComponents || {};
  global.SnowyPrototypeComponents.SnowyUnicardNodeCommentComposer = {
    name: 'SnowyUnicardNodeCommentComposer',
    setup() { return Vue.inject('snowyPrototypeContext'); },
    template: `
      <div v-if="nodeCommentOpen" class="node-comment-mask" role="button" aria-label="关闭评论弹窗" @click="clearNodeSelection"></div>
      <div v-if="annotationEnabled" class="node-comment-popover" :class="{ multiline: nodeCommentMultiline }" :style="nodeCommentStyle" @click.stop>
        <div class="node-comment-input">
          <button class="node-comment-cancel" type="button" title="取消评论" @click="clearNodeSelection">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          </button>
          <a-textarea ref="nodeCommentInputRef" v-model:value="nodeCommentText" :auto-size="{ minRows: 1, maxRows: 4 }" :placeholder="nodeCommentEditingId ? '修改评论...' : '添加评论...'" />
          <button type="button" class="node-comment-submit" :class="{ ready: nodeCommentText.trim() }" :disabled="!nodeCommentText.trim()" :style="nodeCommentText.trim() ? { backgroundColor: '#272636', color: '#fff' } : { backgroundColor: '#f2f4f7', color: '#475467' }" :title="nodeCommentText.trim() ? (nodeCommentEditingId ? '保存修改' : '添加注释') : '请输入注释内容'" @click="saveNodeComment">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5" stroke-width="2.4" stroke-linecap="round" /><path d="M6.5 10.5 12 5l5.5 5.5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
        </div>
      </div>`
  };
})(window);

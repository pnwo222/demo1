<script setup lang="ts">
import { showConfirmDialog, showNotify, showToast } from 'vant'
import OpenModal from '@/components/OpenModal/index.vue'
import DemoSection from './DemoSection.vue'

const showActionSheet = ref(false)
const showPopup = ref(false)
const showModal = ref(false)
const actions = [
  { name: '保存草稿' },
  { name: '提交审核', color: '#2d65f0' },
]

function openConfirm() {
  showConfirmDialog({
    title: '操作确认',
    message: '确认提交当前演示数据吗？',
  }).then(() => showToast('已确认')).catch(() => undefined)
}
</script>

<template>
  <DemoSection title="反馈与浮层" description="Toast、通知、确认框、动作面板、弹出层和项目底部弹窗。">
    <div class="action-grid">
      <van-button size="small" @click="showToast('操作成功')">
        Toast
      </van-button>
      <van-button size="small" @click="showNotify({ type: 'success', message: '数据已更新' })">
        通知
      </van-button>
      <van-button size="small" @click="openConfirm">
        确认框
      </van-button>
      <van-button size="small" @click="showActionSheet = true">
        动作面板
      </van-button>
      <van-button size="small" @click="showPopup = true">
        侧边弹层
      </van-button>
      <van-button size="small" type="primary" @click="showModal = true">
        项目弹窗
      </van-button>
    </div>

    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    />
    <van-popup v-model:show="showPopup" position="right" :style="{ width: '82%', height: '100%' }">
      <div class="side-popup">
        <h3>侧边弹层</h3>
        <p>适合承载详情、筛选条件或轻量编辑内容。</p>
        <van-button block type="primary" @click="showPopup = false">
          完成
        </van-button>
      </div>
    </van-popup>
    <OpenModal :show="showModal" title="项目底部弹窗" @close="showModal = false">
      <div class="project-modal">
        <p>这是项目封装的 OpenModal 组件，可放置自定义业务内容。</p>
        <van-button block round type="primary" @click="showModal = false">
          知道了
        </van-button>
      </div>
    </OpenModal>
  </DemoSection>
</template>

<style scoped lang="less">
.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.side-popup,
.project-modal {
  padding: 24px;

  h3 {
    margin: 0 0 12px;
    font-size: 18px;
  }

  p {
    margin-bottom: 24px;
    font-size: 14px;
    line-height: 22px;
    color: #646566;
  }
}
</style>

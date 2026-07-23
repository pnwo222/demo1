<script setup lang="ts">
import type { UploaderFileListItem } from 'vant'
import PasswordTip from '@/components/PasswordTip/index.vue'
import UploadFile from '@/components/UploadFile/index.vue'
import DemoSection from './DemoSection.vue'

const form = reactive({
  name: '',
  phone: '',
  password: '',
  agreed: false,
  enabled: true,
  count: 1,
  gender: '1',
})
const files = ref<string[]>([])

function handleLocalUpload(item: UploaderFileListItem) {
  const file = item.file
  if (!file)
    return

  item.status = 'uploading'
  item.message = '读取中'
  const reader = new FileReader()
  reader.onload = () => {
    item.url = String(reader.result)
    item.status = 'done'
    item.message = ''
  }
  reader.onerror = () => {
    item.status = 'failed'
    item.message = '读取失败'
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <DemoSection title="表单与录入" description="复用项目密码强度和上传组件；演示上传仅在本地预览，不请求业务接口。">
    <van-form>
      <van-cell-group inset>
        <van-field v-model="form.name" label="姓名" placeholder="请输入姓名" clearable />
        <van-field v-model="form.phone" label="手机号" type="tel" maxlength="11" placeholder="请输入手机号" clearable />
        <van-field v-model="form.password" label="密码" type="password" placeholder="请输入密码" clearable />
        <div class="password-tip">
          <PasswordTip :value="form.password" />
        </div>
        <van-field label="性别">
          <template #input>
            <van-radio-group v-model="form.gender" direction="horizontal">
              <van-radio name="1">
                男
              </van-radio>
              <van-radio name="2">
                女
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="数量">
          <template #input>
            <van-stepper v-model="form.count" min="1" max="10" />
          </template>
        </van-field>
        <van-field label="启用">
          <template #input>
            <van-switch v-model="form.enabled" size="22" />
          </template>
        </van-field>
      </van-cell-group>

      <div class="upload-area">
        <div class="upload-area__title">
          图片上传
        </div>
        <UploadFile
          v-model="files"
          accept="image/*"
          :max-count="3"
          :after-read="handleLocalUpload"
        />
      </div>

      <div class="agreement">
        <van-checkbox v-model="form.agreed" shape="square">
          我已阅读并同意相关条款
        </van-checkbox>
      </div>
      <van-button block round type="primary" :disabled="!form.agreed">
        提交
      </van-button>
    </van-form>
  </DemoSection>
</template>

<style scoped lang="less">
.password-tip {
  padding: 0 16px 8px 90px;
}

.upload-area {
  padding: 16px;
  margin-top: 12px;
  background: #fff;

  &__title {
    margin-bottom: 10px;
    font-size: 14px;
    color: #323233;
  }
}

.agreement {
  padding: 16px 2px;
  font-size: 13px;
}
</style>

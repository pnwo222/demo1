<script setup lang='ts'>
import { ref } from 'vue'
import { useUserInfo } from '@/hooks/system/useUser'

const { userInfo } = useUserInfo()

const form = ref({
  avatar: '',
  company: '',
  position: '',
  address: '',
  mobile: userInfo.value.phone,
  email: userInfo.value.email,
})

const disabled = ref(false)

function onSubmit() {
  console.log('submit')
}
</script>

<template>
  <div class="info pb-100">
    <div class="step1 f-cell">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.avatar"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="avatar"
            label="个人照片"
            placeholder="请填写个人照片"
          >
            <template #input>
              <upload-file v-model="form.avatar" max-count="1" />
            </template>
          </van-field>
          <van-field
            v-model="form.company"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="company"
            label="公司名称"
            placeholder="请填写公司名称"
          />
          <van-field
            v-model="form.position"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="position"
            label="职务"
            placeholder="请填写职务"
          />
          <van-field
            v-model="form.mobile"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="mobile"
            label="联系电话"
            placeholder="请填写联系电话"
          />

          <van-field
            v-model="form.email"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="email"
            label="邮箱"
            placeholder="请填写邮箱"
          />

          <van-field
            v-model="form.address"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="address"
            label="公司地址"
            placeholder="请填写公司地址"
          />
        </van-cell-group>

        <div class="foot-btn fixed bottom-0 left-0 right-0 px-24 py-9 bg-#fff">
          <van-button type="primary" native-type="submit" block round>
            保存
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .info {
    width: 100%;

    .foot-btn {
      padding-bottom: calc(env(safe-area-inset-bottom) + 9px);
    }
  }
</style>

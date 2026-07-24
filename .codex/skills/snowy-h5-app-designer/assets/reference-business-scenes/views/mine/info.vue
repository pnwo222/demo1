<script setup lang='ts'>
import { showSuccessToast } from 'vant'
import { ref } from 'vue'
import { updateUserInfo } from '@/api/user/user'
import { useUserInfo } from '@/hooks/system/useUser'
import { validatePhone } from '@/utils'

const { userInfo, userStore } = useUserInfo()
const form = ref({
  account: userInfo.value?.account,
  name: userInfo.value?.name,
  gender: userInfo.value?.gender,
  birthday: userInfo.value?.birthday,
  phone: userInfo.value?.phone,
  email: userInfo.value?.email,

  companyName: userInfo.value?.companyName,
  companyPosition: userInfo.value?.companyPosition,
  companyAddress: userInfo.value?.companyAddress,
})

const disabled = ref(true)
const loading = ref(false)

function onSubmit() {
  if (loading.value) return
  loading.value = true
  disabled.value = true
  updateUserInfo({
    phone: form.value.phone,
    email: form.value.email,
    companyName: form.value.companyName,
    companyPosition: form.value.companyPosition,
    companyAddress: form.value.companyAddress,
  }).then(async () => {
    await userStore.fetchUserInfo()
    form.value.phone = userInfo.value.phone
    const s = setTimeout(() => {
      loading.value = false
      clearTimeout(s)
      showSuccessToast('更新成功')
    }, 600)
  }).catch(() => {
    loading.value = false
    disabled.value = false
  })
}

function onEdit() {
  disabled.value = false
  form.value.phone = userInfo.value.realPhone
}
</script>

<template>
  <div class="info pb-100">
    <div class="step1 pt-10 f-cell">
      <van-form @submit="onSubmit">
        <van-cell-group inset title="基础信息">
          <van-cell title="用户账号" :value="form.account" />
          <van-cell title="用户姓名" :value="form.name" />
          <van-cell title="性别" :value="form.gender" />
          <van-cell title="出生日期" :value="form.birthday" />
        </van-cell-group>

        <van-cell-group inset title="联系信息">
          <van-field
            v-model="form.phone"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="mobile"
            label="联系电话"
            :type="disabled ? 'text' : 'number'"
            placeholder="请填写联系电话"
            :rules="[{ required: true, message: '请填写联系电话' }, { validator: validatePhone, message: '请填写正确的联系电话' }]"
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
        </van-cell-group>

        <!-- 仅校友展示 -->
        <van-cell-group inset title="工作信息">
          <van-field
            v-model="form.companyName"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="companyName"
            label="单位名称"
            placeholder="请填写单位名称"
          />
          <van-field
            v-model="form.companyPosition"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="companyPosition"
            label="职务"
            placeholder="请填写职务"
          />
          <van-field
            v-model="form.companyAddress"
            input-align="right"
            :disabled="disabled"
            error-message-align="right"
            name="companyAddress"
            label="公司地址"
            placeholder="请填写公司地址"
          />
        </van-cell-group>

        <div class="foot-btn fixed bottom-0 left-0 right-0 px-24 py-9 bg-#fff">
          <van-button v-if="disabled && !loading" type="primary" native-type="submit" block round @click="onEdit">
            编辑
          </van-button>
          <van-button v-else :loading="loading" type="primary" native-type="submit" block round>
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

    :deep(.van-field__control:disabled) {
      -webkit-text-fill-color: #999;
    }
  }
</style>

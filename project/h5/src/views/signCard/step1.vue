<script setup lang='ts'>
import { createApiPicker } from '@/components/OpenApiPicker'
import { createDatePicker } from '@/components/OpenDatePicker'
import { useStorage } from '@/hooks/system/useStorage'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'
import { NATION_ARR } from './nation'

const { userInfo } = useUserInfo()

const form = ref({
  mobile: userInfo.value?.phone,
  nation: userInfo.value?.nation,
  idCardStartDate: '',
  idCardEndDate: '',
  homeAddress: `浙江省宁波市江北区风华路495号 浙江纺织服装职业技术学院 ${userInfo.value.stuClassName || ''}`,
})

if (useStorage.ss.get('signCardInfo')) {
  form.value = useStorage.ss.get('signCardInfo')
}

const { open } = createApiPicker({
  value: form,
  field: 'nation',
  props: {
    title: '选择民族',
    columns: NATION_ARR,
  },
})

const { open: openDatePicker } = createDatePicker({
  value: form,
  field: 'idCardStartDate',
  props: {
    title: '证件生效日期',
  },
})

const { open: openEndDatePicker } = createDatePicker({
  value: form,
  field: 'idCardEndDate',
  type: 2,
  props: {
    title: '证件有效期至',
  },
})

function onSubmit() {
  useStorage.ss.set('signCardInfo', form.value)
  router.push('/sign-card/step2')
}
</script>

<template>
  <div class="step1 pt-10 f-cell">
    <van-form @submit="onSubmit">
      <van-cell-group inset title="基础信息">
        <van-cell title="姓名" :value="userInfo?.name" />
        <van-field
          v-model="form.mobile"
          input-align="right"
          error-message-align="right"
          name="mobile"
          label="手机号"
          placeholder="手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <van-field
          v-model="form.nation"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="nation"
          label="民族"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="open"
        />

        <van-field
          v-model="form.homeAddress"
          label-align="top"
          type="textarea"
          name="homeAddress"
          disabled
          label="通信地址"
          placeholder="通信地址"
          :rules="[{ required: true, message: '请填写通信地址' }]"
        />
      </van-cell-group>

      <van-cell-group inset title="证件信息">
        <van-cell title="证件类型" value="身份证" />
        <van-cell title="证件号码" :value="userInfo?.idCardNumber" />
        <van-field
          v-model="form.idCardStartDate"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="idCardStartDate"
          label="证件生效日期"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openDatePicker"
        />
        <van-field
          v-model="form.idCardEndDate"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="idCardEndDate"
          label="证件有效期至"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openEndDatePicker"
        />
      </van-cell-group>

      <div class="pl-24 pr-24 w-100% mt-20 pb-[env(safe-area-inset-bottom)]">
        <van-button round block type="primary" native-type="submit">
          下一步
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped lang='less'>
  .step1 {
    width: 100%;
    min-height: 560px;
    padding-bottom: 60px;
  }
</style>

<style>
.van-field__control:disabled {
  -webkit-text-fill-color: #999 !important;
}
</style>

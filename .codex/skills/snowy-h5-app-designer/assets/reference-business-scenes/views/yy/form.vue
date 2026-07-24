<script setup lang='ts'>
import type { Ref } from 'vue'
import type { IVisitRecord } from '@/api/index/yy/types'
import dayjs from 'dayjs'
import { ykt } from 'icard-jssdk'
import { cloneDeep } from 'lodash-es'
import { showDialog, showSuccessToast, showToast } from 'vant'
import { apply, getDepart, geTeacher, getVisitPage } from '@/api/index/yy'
// import { getCat } from '@/api/user/user'
import { createApiPicker } from '@/components/OpenApiPicker'
import { createDatePicker } from '@/components/OpenDatePicker'
import { createTimePicker } from '@/components/OpenTimePicker'
import { useStorage } from '@/hooks/system/useStorage'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'
import { px2vw } from '@/utils/index'
import { reason } from './data'

const { userInfo, hasSbCard } = useUserInfo()

if (!hasSbCard.value) {
  showDialog({
    message: '您尚未绑定社保卡，为避免影响后续的功能使用，请先绑定社保卡',
    confirmButtonText: '立即绑定',
    showCancelButton: true,
  }).then(() => {
    router.push({
      path: '/card',
    })
  }).catch(() => {
    ykt.closePage()
  })
}

const form = ref({
  // mobile: userInfo.value.phone,
  startTime: '',
  endTime: '',
  // name: userInfo.value.name,
  visitUnit: '',
  intervieweeName: '',
  intervieweeCode: '',
  visitDept: '',
  visitDeptCode: '',
  visitFor: '',
  _visitFor: '',
  visitForExplain: '',
  estimateArrivalTime: '',
  selfPromise: false,
  symptom: '',
  plateNumber: '',
})

const disabled = computed(() => {
  return !!router.currentRoute.value.query.read
})

if (!disabled.value) {
  // 有历史记录
  getVisitPage().then((res) => {
    if (res.records.length) {
      form.value.visitUnit = res.records[0].visitUnit
    }
  })
}

if (disabled.value) {
  form.value = useStorage.ss.get('yyDetail')
  nextTick(() => {
    form.value.intervieweeName = useStorage.ss.get('yyDetail').intervieweeName
  })
}

const { open: openManPicker } = createApiPicker({
  value: form,
  field: 'intervieweeCode',
  showLabelField: 'intervieweeName',
  searchKeyField: 'name',
  showSearch: true,
  api: geTeacher,
  autoFetch: false,
  resultField: '',
  emptyText: '请输入搜索关键词',
  requiredSearchKeyword: true,
  formatData: (data) => {
    return data.records.map((item: any) => ({
      ...item,
      text: item.xm,
      value: item.gh,
    }))
  },
  props: {
    title: '被访人',
  },
  onConfirm(v) {
    console.log(v)
    const d = v.selectedOptions[0]
    form.value.visitDeptCode = d.dwh
    form.value.visitDept = d.dwmc
    // form.value.intervieweeName = v.selectedOptions[0].text
  },
})

// const { open: openVisitDeptPicker } = createApiPicker({
//   value: form,
//   field: 'visitDeptCode',
//   showLabelField: 'visitDept',
//   showSearch: true,
//   filter: true,
//   api: getDepart,
//   resultField: '',
//   formatData: (data) => {
//     return data.map((item: any) => ({
//       text: item.dwmc,
//       value: item.dwh,
//     }))
//   },
//   props: {
//     title: '拜访部门',
//   },
//   onConfirm(v) {
//     // form.value.visitDept = v.selectedOptions[0].text
//   },
// })

const { open: openReasonPicker } = createApiPicker({
  value: form,
  field: 'visitFor',
  showLabelField: '_visitFor',
  resultField: '',
  props: {
    title: '拜访事由',
    columns: reason,
  },
  onConfirm(v) {
    const d = v.selectedOptions?.[0]?.text
    console.log(d)
    if (v.selectedValues[0] !== 4) {
      form.value.visitForExplain = d
    }
    else {
      form.value.visitForExplain = ''
    }
  },
})

const { open: openDatePicker, vnode: startTimeVNode } = createDatePicker({
  value: form,
  field: 'startTime',
  props: {
    title: '开始日期',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
  onConfirm: (v) => {
    // eslint-disable-next-line ts/no-use-before-define
    endTimeVNode.props.props.minDate = new Date(dayjs(form.value.startTime).valueOf())

    // if (form.value.startTime > form.value.endTime && form.value.endTime) {
    //   form.value.endTime = form.value.startTime
    // }
  },
})

const { open: openEndDatePicker, vnode: endTimeVNode } = createDatePicker({
  value: form,
  field: 'endTime',
  props: {
    title: '结束日期',
    minDate: new Date(),
    maxDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
  },
  onConfirm: () => {
    startTimeVNode.props.props.maxDate = new Date(dayjs(form.value.endTime).valueOf())
    // if (form.value.startTime > form.value.endTime && form.value.startTime) {
    //   form.value.endTime = form.value.startTime
    // }
  },
})

const { open: openExpectTimeDatePicker } = createTimePicker({
  value: form,
  field: 'estimateArrivalTime',
  props: {
    title: '预计到校时间',
  },
})

const loading = ref(false)

function onSubmit() {
  if (!form.value.selfPromise) {
    showToast('请同意本人承诺')
    return
  }

  if (loading.value) return
  const formData = cloneDeep(form.value)

  apply({
    ...formData,
    selfPromise: formData.selfPromise ? 1 : 0,
    estimateArrivalTime: `${`${formData.startTime} ${formData.estimateArrivalTime}`}:00`,
  }).then(() => {
    showSuccessToast('提交成功')
    router.push('/yy/index')
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="yy-form pt-10 f-cell" :class="{ 'pointer-events-none': disabled }">
    <van-form :label-width="px2vw(100)" scroll-to-error :disabled="disabled" @submit="onSubmit">
      <van-cell-group inset>
        <template #title>
          <span class="color-#F64946">*</span> 访客信息
        </template>
        <van-cell title="姓名" :value="userInfo?.name" />
        <van-field
          v-model="form.visitUnit"
          input-align="right"
          error-message-align="right"
          name="visitUnit"
          label="来访单位"
          placeholder="请填写来访单位"
          :rules="[{ required: true, message: '请填写来访单位' }]"
        />
      </van-cell-group>

      <van-cell-group inset>
        <template #title>
          <span class="color-#F64946">*</span> 预约信息
        </template>
        <van-field
          v-model="form.intervieweeName"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="intervieweeName"
          label="被访人"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openManPicker"
        >
          <template #input>
            <input
              v-model="form.intervieweeName"
              readonly
              class="van-field__control van-field__control--right"
              type="text"
              :disabled="disabled"
              placeholder="请选择"
            >
          </template>
        </van-field>

        <van-cell title="拜访部门" :value="form.visitDept" />

        <!-- <van-field
          v-model="form.visitDept"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="visitDept"
          label="拜访部门"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openVisitDeptPicker"
        >
          <template #input>
            <input
              v-model="form.visitDept"
              readonly
              class="van-field__control van-field__control--right"
              type="text"
              :disabled="disabled"
              placeholder="请选择"
            >
          </template>
        </van-field> -->

        <van-field
          v-model="form.visitFor"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="visitFor"
          label="拜访事由"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openReasonPicker"
        >
          <template #input>
            <input
              v-model="form._visitFor"
              readonly
              class="van-field__control van-field__control--right"
              type="text"
              :disabled="disabled"
              placeholder="请选择"
            >
          </template>
        </van-field>

        <van-field
          v-if="Number(form.visitFor) === 4"
          v-model="form.visitForExplain"
          input-align="right"
          error-message-align="right"
          name="visitForExplain"
          label="其他事由"
          placeholder="请填写其他事由"
          :rules="[{ required: true, message: '请填写其他事由' }]"
        />

        <van-field
          v-model="form.startTime"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="startTime"
          label="开始日期"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openDatePicker"
        />
        <van-field
          v-model="form.endTime"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="endTime"
          label="结束日期"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openEndDatePicker"
        />

        <van-field
          v-model="form.estimateArrivalTime"
          is-link
          input-align="right"
          error-message-align="right"
          readonly
          name="estimateArrivalTime"
          label="预计到校时间"
          placeholder="请选择"
          :rules="[{ required: true, message: '请选择' }]"
          @click="openExpectTimeDatePicker"
        />
      </van-cell-group>

      <van-cell-group inset title="其他信息">
        <van-field
          label-width="100%"
          label-align="top"
          input-align="left"
          error-message-align="center"
          name="symptom"
          placeholder=""
          :rules="[{ required: true, message: '请选择' }]"
        >
          <template #label>
            <span class="color-#F64946 mr-4">*</span> 是否有发热、咳嗽、腹泻等症状
          </template>
          <template #input>
            <van-radio-group v-model="form.symptom" class="mt-12" direction="horizontal">
              <van-radio :name="2" class="mr-60!">
                是
              </van-radio>
              <van-radio :name="1">
                否
              </van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="form.plateNumber"
          :required="false"
          input-align="right"
          error-message-align="right"
          name="plateNumber"
          label="车牌号"
          placeholder="请填写车牌号"
          :rules="[{ required: false, message: '请填写车牌号' }]"
        />
      </van-cell-group>

      <van-cell-group inset title="">
        <van-cell>
          <van-checkbox v-model="form.selfPromise" class="text-left!">
            本人承诺：以上填写数据真实有效，本人为申报信息真实性负责。
          </van-checkbox>
        </van-cell>
      </van-cell-group>

      <div class="pl-24 pr-24 w-100% mt-20 pb-40 pb-[env(safe-area-inset-bottom)]">
        <van-button v-if="!disabled" round block type="primary" native-type="submit">
          提交申请
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style scoped lang='less'>
.yy-form {
  width: 100%;
  min-height: 560px;
}
</style>

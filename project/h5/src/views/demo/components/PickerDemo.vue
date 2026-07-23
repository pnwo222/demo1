<script setup lang="ts">
import OpenApiPicker from '@/components/OpenApiPicker/index.vue'
import OpenDatePicker from '@/components/OpenDatePicker/index.vue'
import OpenMjDatePicker from '@/components/OpenMjDatePicker/index.vue'
import OpenTimePicker from '@/components/OpenTimePicker/index.vue'
import OpenXfDatePicker from '@/components/OpenXfDatePicker/index.vue'
import DemoSection from './DemoSection.vue'

const pickerValue = reactive({
  campus: 'main',
  date: '2026-07-23',
  time: '09:30',
  startDate: '2026-07-17',
  endDate: '2026-07-23',
})
const campusOptions = [
  { text: '主校区', value: 'main' },
  { text: '东校区', value: 'east' },
  { text: '西校区', value: 'west' },
]
const currentPicker = ref('')
const campusName = computed(() => campusOptions.find(item => item.value === pickerValue.campus)?.text)

function closePicker() {
  currentPicker.value = ''
}

function confirmCampus(value: any) {
  pickerValue.campus = value.selectedValues[0]
  closePicker()
}

function confirmDate(value: any) {
  pickerValue.date = value.selectedValues.join('-')
  closePicker()
}

function confirmTime(value: any) {
  pickerValue.time = value.selectedValues.join(':')
  closePicker()
}

function confirmRange(value: any) {
  pickerValue.startDate = value.selectedValues.join('-')
  pickerValue.endDate = value.selectedValues2.join('-')
  closePicker()
}
</script>

<template>
  <DemoSection title="选择器" description="项目内封装的选项、日期、时间和业务日期范围选择器。">
    <van-cell-group inset>
      <van-cell title="校区选择" :value="campusName" is-link @click="currentPicker = 'api'" />
      <van-cell title="日期选择" :value="pickerValue.date" is-link @click="currentPicker = 'date'" />
      <van-cell title="时间选择" :value="pickerValue.time" is-link @click="currentPicker = 'time'" />
      <van-cell
        title="记录日期范围"
        :label="`${pickerValue.startDate} 至 ${pickerValue.endDate}`"
        is-link
        @click="currentPicker = 'mj'"
      />
      <van-cell
        title="消费日期范围"
        :label="`${pickerValue.startDate} 至 ${pickerValue.endDate}`"
        is-link
        @click="currentPicker = 'xf'"
      />
    </van-cell-group>

    <OpenApiPicker
      :show="currentPicker === 'api'"
      :value="{ value: pickerValue }"
      field="campus"
      :props="{ title: '选择校区', columns: campusOptions }"
      @confirm="confirmCampus"
      @close="closePicker"
    />
    <OpenDatePicker
      :show="currentPicker === 'date'"
      :value="{ value: pickerValue }"
      field="date"
      :props="{ title: '选择日期' }"
      @confirm="confirmDate"
      @close="closePicker"
    />
    <OpenTimePicker
      :show="currentPicker === 'time'"
      :value="{ value: pickerValue }"
      field="time"
      :props="{ title: '选择时间' }"
      @confirm="confirmTime"
      @close="closePicker"
    />
    <OpenMjDatePicker
      :show="currentPicker === 'mj'"
      :value="{ value: pickerValue }"
      field="startDate"
      field2="endDate"
      :props="{ title: '选择记录时间' }"
      @confirm="confirmRange"
      @close="closePicker"
    />
    <OpenXfDatePicker
      :show="currentPicker === 'xf'"
      :value="{ value: pickerValue }"
      field="startDate"
      field2="endDate"
      :props="{ title: '选择消费时间' }"
      @confirm="confirmRange"
      @close="closePicker"
    />
  </DemoSection>
</template>

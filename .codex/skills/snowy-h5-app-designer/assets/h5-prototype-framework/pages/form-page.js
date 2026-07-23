window.H5FormPage = {
  name: 'H5FormPage',
  template: `
    <main class="h5-page form-page" data-page-id="form" data-annotation-key="form-page">
      <van-nav-bar title="访客预约" left-arrow @click-left="$emit('navigate', 'home')" />
      <van-form @submit="submit" data-annotation-key="visit-form">
        <van-cell-group inset title="访客信息">
          <van-field v-model="form.name" name="name" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
          <van-field v-model="form.mobile" name="mobile" type="tel" label="手机号" placeholder="请输入手机号" :rules="[{ required: true, message: '请输入手机号' }]" />
        </van-cell-group>
        <van-cell-group inset title="预约信息">
          <van-field v-model="form.target" readonly is-link label="被访人" placeholder="请选择" @click="showPicker = true" />
          <van-field v-model="form.date" readonly is-link label="来访日期" placeholder="请选择" @click="showDate = true" />
          <van-field v-model="form.reason" rows="2" autosize type="textarea" label="来访事由" placeholder="请输入来访事由" />
        </van-cell-group>
        <div class="agreement"><van-checkbox v-model="form.agreed">本人承诺填写信息真实有效</van-checkbox></div>
        <div class="safe-action"><van-button block round type="primary" native-type="submit">提交申请</van-button></div>
      </van-form>
      <van-popup v-model:show="showPicker" position="bottom">
        <van-picker title="选择被访人" :columns="people" @confirm="confirmPerson" @cancel="showPicker = false" />
      </van-popup>
      <van-popup v-model:show="showDate" position="bottom">
        <van-date-picker title="选择来访日期" @confirm="confirmDate" @cancel="showDate = false" />
      </van-popup>
    </main>
  `,
  setup() {
    const form = Vue.reactive({ name: '', mobile: '', target: '', date: '', reason: '', agreed: false })
    const showPicker = Vue.ref(false)
    const showDate = Vue.ref(false)
    const people = [{ text: '王老师', value: 'wang' }, { text: '李老师', value: 'li' }]
    const confirmPerson = ({ selectedOptions }) => {
      form.target = selectedOptions[0].text
      showPicker.value = false
    }
    const confirmDate = ({ selectedValues }) => {
      form.date = selectedValues.join('-')
      showDate.value = false
    }
    const submit = () => {
      if (!form.agreed) return vant.showToast('请先阅读并同意承诺')
      vant.showSuccessToast('提交成功')
    }
    return { form, showPicker, showDate, people, confirmPerson, confirmDate, submit }
  }
}

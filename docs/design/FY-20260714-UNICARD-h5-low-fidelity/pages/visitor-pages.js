window.H5VisitorApplyPage = {
  name: 'H5VisitorApplyPage',
  emits: ['navigate'],
  template: `
    <main class="h5-page" data-page-id="visitor-apply">
      <van-nav-bar title="访客预约" left-arrow @click-left="$emit('navigate','home')" />
      <van-form @submit="submit" class="page-form">
        <van-cell-group inset>
          <van-field v-model="form.name" name="姓名" label="姓名" placeholder="请输入访客姓名" :rules="required('请输入姓名')" />
          <div data-annotation-key="visitor-sensitive-fields">
            <van-field v-model="form.idCard" name="身份证号" label="身份证号" maxlength="18" placeholder="请输入身份证号" :rules="idRules" />
            <van-field v-model="form.phone" name="手机号" label="手机号" type="tel" maxlength="11" placeholder="请输入手机号" :rules="phoneRules" />
          </div>
          <van-field v-model="form.company" name="单位" label="单位" placeholder="请输入来访单位" :rules="required('请输入单位')" />
          <van-field v-model="form.reason" is-link readonly name="来访事由" label="来访事由" placeholder="请选择" @click="reasonPicker=true" :rules="required('请选择来访事由')" />
          <van-field v-model="form.target" name="被访人" label="被访人" placeholder="请输入被访人姓名" :rules="required('请输入被访人')" />
          <van-field v-model="form.department" is-link readonly name="被访部门" label="被访部门" placeholder="请选择" @click="departmentPicker=true" :rules="required('请选择被访部门')" />
          <van-field v-model="form.visitTime" is-link readonly name="来访时间" label="来访时间" placeholder="请选择" @click="timePicker=true" :rules="required('请选择来访时间')" />
          <div data-annotation-key="visitor-passage-fields">
            <van-field v-model="form.passage" is-link readonly name="通行方式" label="通行方式" placeholder="请选择" @click="passagePicker=true" :rules="required('请选择通行方式')" />
            <van-field v-if="form.passage==='驾车'" v-model="form.plate" name="车牌号" label="车牌号" placeholder="例如：浙B12345" :rules="required('驾车来访请填写车牌号')" />
          </div>
        </van-cell-group>
        <div class="form-tip">提交即表示您同意访客信息仅用于本次预约审核与校园通行。</div>
        <div class="sticky-action"><van-button round block type="primary" native-type="submit">提交预约</van-button></div>
      </van-form>
      <van-action-sheet data-page-id="visitor-apply" v-model:show="reasonPicker" :actions="reasonActions" @select="pick('reason',$event)" />
      <van-action-sheet data-page-id="visitor-apply" v-model:show="departmentPicker" :actions="departmentActions" @select="pick('department',$event)" />
      <van-action-sheet data-page-id="visitor-apply" v-model:show="passagePicker" :actions="passageActions" @select="pick('passage',$event)" />
      <van-popup data-page-id="visitor-apply" v-model:show="timePicker" position="bottom"><van-date-picker title="选择来访日期" :min-date="minDate" @confirm="pickDate" @cancel="timePicker=false" /></van-popup>
    </main>`,
  setup(_, { emit }) {
    const form = Vue.reactive({ name:'张访客', idCard:'330203199812121234', phone:'13800138000', company:'宁波新材料科技有限公司', reason:'', target:'王老师', department:'', visitTime:'', passage:'', plate:'' })
    const reasonPicker=Vue.ref(false), departmentPicker=Vue.ref(false), passagePicker=Vue.ref(false), timePicker=Vue.ref(false)
    const required = message => [{ required:true, message }]
    const idRules=[{ required:true, message:'请输入身份证号' }, { pattern:/^\d{17}[\dXx]$/, message:'身份证号格式不正确' }]
    const phoneRules=[{ required:true, message:'请输入手机号' }, { pattern:/^1\d{10}$/, message:'手机号格式不正确' }]
    const reasonActions=[{name:'招生咨询'},{name:'项目交流'},{name:'参观校园'}]
    const departmentActions=[{name:'招生就业处'},{name:'信息技术学院'},{name:'党政办公室'}]
    const passageActions=[{name:'步行'},{name:'驾车'}]
    const pick=(key, action)=>{ form[key]=action.name; ({reason:reasonPicker,department:departmentPicker,passage:passagePicker}[key]).value=false }
    const pickDate=({selectedValues})=>{ form.visitTime=`${selectedValues.join('-')} 09:30`; timePicker.value=false }
    const submit=()=>vant.showConfirmDialog({title:'确认提交预约？',message:`${form.visitTime} · ${form.department}\\n提交后将进入审核。`}).then(()=>{vant.showToast('预约已提交，等待审核'); emit('navigate','visitor-records')}).catch(()=>{})
    return {form,required,idRules,phoneRules,reasonPicker,departmentPicker,passagePicker,timePicker,reasonActions,departmentActions,passageActions,minDate:new Date(),pick,pickDate,submit}
  }
}

window.H5VisitorRecordsPage = {
  name:'H5VisitorRecordsPage', emits:['navigate'],
  template:`
    <main class="h5-page" data-page-id="visitor-records">
      <van-nav-bar title="预约记录" left-arrow right-text="新增" @click-left="$emit('navigate','mine')" @click-right="$emit('navigate','visitor-apply')" />
      <van-tabs v-model:active="active" sticky data-annotation-key="visitor-status-tabs">
        <van-tab v-for="status in statuses" :key="status" :title="status">
          <section class="card-list" data-annotation-key="visitor-record-list">
            <button class="record-card" v-for="item in filtered(status)" :key="item.id" @click="open(item)">
              <div><strong>{{item.reason}}</strong><van-tag :type="tagType(item.status)">{{item.status}}</van-tag></div>
              <p>{{item.date}}</p><p>被访人：{{item.target}} · {{item.dept}}</p>
            </button>
            <van-empty v-if="!filtered(status).length" description="暂无预约记录" />
          </section>
        </van-tab>
      </van-tabs>
    </main>`,
  setup(_, {emit}) {
    const active=Vue.ref(0), statuses=['全部','待审核','已通过','未通过']
    const filtered=status=>status==='全部'?window.H5PrototypeData.visitorRecords:window.H5PrototypeData.visitorRecords.filter(x=>x.status===status)
    const tagType=status=>({已通过:'success',待审核:'primary',未通过:'danger'}[status])
    const open=item=>{window.H5PrototypeData.selectedVisitor=item; emit('navigate','visitor-detail')}
    return {active,statuses,filtered,tagType,open}
  }
}

window.H5VisitorDetailPage = {
  name:'H5VisitorDetailPage', emits:['navigate'],
  template:`
    <main class="h5-page" data-page-id="visitor-detail">
      <van-nav-bar title="预约详情" left-arrow @click-left="$emit('navigate','visitor-records')" />
      <section class="status-hero" :class="'is-'+item.status">
        <van-icon :name="item.status==='已通过'?'passed':item.status==='未通过'?'close':'clock-o'" size="40" />
        <strong>{{item.status}}</strong><span>{{statusText}}</span>
      </section>
      <van-cell-group inset title="预约信息" data-annotation-key="visitor-detail-sensitive">
        <van-cell title="访客姓名" value="张访客" />
        <van-cell title="身份证号" value="330203********1234" />
        <van-cell title="手机号" value="138****8000" />
        <van-cell title="来访单位" value="宁波新材料科技有限公司" />
        <van-cell title="来访事由" :value="item.reason" />
        <van-cell title="被访人" :value="item.target" />
        <van-cell title="被访部门" :value="item.dept" />
        <van-cell title="来访时间" :value="item.date" />
        <van-cell title="通行方式" value="步行" />
      </van-cell-group>
      <div class="safe-actions"><van-button block round @click="refresh">刷新审核状态</van-button></div>
    </main>`,
  setup(){
    const item=Vue.reactive(window.H5PrototypeData.selectedVisitor||window.H5PrototypeData.visitorRecords[0])
    const statusText=Vue.computed(()=>({已通过:'请在预约时间内到校通行',待审核:'审核结果将通过服务消息通知',未通过:'请核对信息后重新发起预约'}[item.status]))
    const refresh=()=>vant.showToast('已是最新审核状态')
    return {item,statusText,refresh}
  }
}

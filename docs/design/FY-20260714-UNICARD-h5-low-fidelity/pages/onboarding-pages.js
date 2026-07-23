window.H5OnboardingPage = {
  name:'H5OnboardingPage', emits:['navigate'],
  template:`
    <main class="h5-page onboarding-page">
      <van-nav-bar title="校园启航" left-arrow @click-left="$emit('navigate','home')" />
      <section class="launch-hero" data-annotation-key="onboarding-identity"><img src="./images/fy-logo.png"><div><h1>欢迎加入纺院</h1><p>完成线上认证，开启校园生活</p></div></section>
      <section class="step-card" data-annotation-key="onboarding-steps">
        <div v-for="(step,index) in steps" :key="step.title" :class="{done:index<1,current:index===1}">
          <i>{{index<1?'✓':index+1}}</i><span><strong>{{step.title}}</strong><small>{{step.desc}}</small></span>
        </div>
      </section>
      <div class="safe-actions"><van-button round block type="primary" @click="$emit('navigate','onboarding-verify')">开始办理</van-button></div>
    </main>`,
  setup(){return {steps:[{title:'账号激活',desc:'使用一卡通 APP 登录身份'},{title:'身份核验',desc:'比对招生录取信息'},{title:'社保卡服务',desc:'绑定已有卡或预约办卡'},{title:'完成启航',desc:'查看办理结果'}]}}
}

window.H5OnboardingVerifyPage = {
  name:'H5OnboardingVerifyPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="新生身份核验" left-arrow @click-left="$emit('navigate','onboarding')" />
      <van-notice-bar left-icon="info-o" text="请填写与招生录取信息一致的身份资料。" />
      <van-form @submit="$emit('navigate','onboarding-card')" class="page-form" data-annotation-key="onboarding-verify-form">
        <van-cell-group inset>
          <van-field v-model="name" label="姓名" placeholder="请输入姓名" :rules="[{required:true,message:'请输入姓名'}]" />
          <van-field v-model="idCard" label="身份证号" maxlength="18" placeholder="请输入身份证号" :rules="idRules" />
          <van-field v-model="candidate" label="考生号" placeholder="请输入考生号" :rules="[{required:true,message:'请输入考生号'}]" />
          <van-field v-model="phone" label="录取手机号" type="tel" maxlength="11" placeholder="请输入录取手机号" :rules="phoneRules" />
        </van-cell-group>
        <div class="safe-actions"><van-button round block type="primary" native-type="submit">核验并继续</van-button></div>
      </van-form>
    </main>`,
  setup(){return {name:Vue.ref('张同学'),idCard:Vue.ref('330203200801011234'),candidate:Vue.ref('26330203123456'),phone:Vue.ref('13800138000'),idRules:[{required:true,message:'请输入身份证号'},{pattern:/^\d{17}[\dXx]$/,message:'身份证号格式不正确'}],phoneRules:[{required:true,message:'请输入手机号'},{pattern:/^1\d{10}$/,message:'手机号格式不正确'}]}}
}

window.H5OnboardingCardPage = {
  name:'H5OnboardingCardPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="社保卡服务" left-arrow @click-left="$emit('navigate','onboarding-verify')" />
      <section class="card-choice" data-annotation-key="onboarding-card-sensitive">
        <h2>请选择您的情况</h2>
        <button @click="bindShow=true"><van-icon name="card" size="30"/><span><strong>已有浙江省社保卡</strong><small>核验卡号并绑定校园身份</small></span><van-icon name="arrow"/></button>
        <button @click="$emit('navigate','onboarding-apply-card')"><van-icon name="add-square" size="30"/><span><strong>暂无社保卡</strong><small>在线提交材料预约办理</small></span><van-icon name="arrow"/></button>
      </section>
      <van-popup v-model:show="bindShow" round position="bottom">
        <div class="bottom-form"><h2>绑定社保卡</h2><van-field v-model="cardNo" label="社保卡号" placeholder="请输入社保卡号"/><van-field v-model="phone" label="预留手机号" placeholder="请输入预留手机号"/><van-button block round type="primary" @click="bind">确认绑定</van-button></div>
      </van-popup>
    </main>`,
  setup(_, {emit}){const bindShow=Vue.ref(false),cardNo=Vue.ref('A3302 0012 3456 7890'),phone=Vue.ref('13800138000'); const bind=()=>{bindShow.value=false;window.H5PrototypeData.onboardingResult='bind-success';emit('navigate','onboarding-result')};return{bindShow,cardNo,phone,bind}}
}

window.H5OnboardingApplyCardPage = {
  name:'H5OnboardingApplyCardPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="预约办理社保卡" left-arrow @click-left="$emit('navigate','onboarding-card')" />
      <van-notice-bar wrapable text="请上传清晰、完整的身份证正反面和本人证件照。原型文件仅在本地预览。" />
      <section class="upload-card" data-annotation-key="card-material-upload">
        <h2>办卡材料</h2>
        <label>身份证正面</label><van-uploader v-model="front" :max-count="1" :after-read="preview" />
        <label>身份证反面</label><van-uploader v-model="back" :max-count="1" :after-read="preview" />
        <label>本人证件照</label><van-uploader v-model="photo" :max-count="1" :after-read="preview" />
      </section>
      <van-cell-group inset><van-field v-model="address" label="领卡网点" readonly is-link @click="siteShow=true"/><van-field v-model="phone" label="联系电话" type="tel"/></van-cell-group>
      <div class="safe-actions"><van-button round block type="primary" @click="submit">提交预约办卡</van-button></div>
      <van-action-sheet v-model:show="siteShow" :actions="sites" @select="selectSite"/>
    </main>`,
  setup(_, {emit}){
    const front=Vue.ref([{url:'./images/card-front.png'}]),back=Vue.ref([{url:'./images/card-back.png'}]),photo=Vue.ref([{url:'./images/id-photo.png'}])
    const address=Vue.ref('纺院校园服务中心'),phone=Vue.ref('13800138000'),siteShow=Vue.ref(false),sites=[{name:'纺院校园服务中心'},{name:'宁波市民卡服务中心'}]
    const preview=file=>{file.status='done';file.message='已选择'}
    const selectSite=action=>{address.value=action.name;siteShow.value=false}
    const submit=()=>{if(!front.value.length||!back.value.length||!photo.value.length)return vant.showToast('请补全办卡材料');window.H5PrototypeData.onboardingResult='apply-success';emit('navigate','onboarding-result')}
    return{front,back,photo,address,phone,siteShow,sites,preview,selectSite,submit}
  }
}

window.H5OnboardingResultPage = {
  name:'H5OnboardingResultPage', emits:['navigate'],
  template:`
    <main class="h5-page result-page" data-annotation-key="onboarding-result-status">
      <van-nav-bar title="办理结果" />
      <section v-if="success" class="result-box"><img src="./images/success.png" alt=""><h2>校园启航已完成</h2><p>{{description}}</p><div class="safe-actions"><van-button round block type="primary" @click="$emit('navigate','mine')">进入我的</van-button><van-button round block @click="$emit('navigate','home')">返回首页</van-button></div></section>
      <section v-else class="result-box"><van-icon name="warning-o" size="84" color="#f59e0b"/><h2>身份核验未通过</h2><p>录取信息不一致，请检查后重新提交。</p><div class="safe-actions"><van-button round block type="primary" @click="$emit('navigate','onboarding-verify')">重新核验</van-button></div></section>
    </main>`,
  setup(){const success=Vue.ref(window.H5PrototypeData.onboardingResult!=='fail');const description=Vue.computed(()=>window.H5PrototypeData.onboardingResult==='apply-success'?'办卡预约已提交，进度将通过服务消息通知。':'社保卡已完成绑定，可使用校园码。');return{success,description}}
}

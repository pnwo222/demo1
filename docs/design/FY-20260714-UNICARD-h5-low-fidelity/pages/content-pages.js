(function () {
  const data = window.H5PrototypeData
  const nav = (title, back) => `<van-nav-bar title="${title}" left-arrow @click-left="$emit('navigate','${back}')" />`

  window.H5SchoolProfilePage = {
    name: 'H5SchoolProfilePage',
    emits: ['navigate'],
    template: `
      <main class="h5-page detail-page" data-page-id="school-profile" data-annotation-key="school-profile-page">
        ${nav('学校简介', 'home')}
        <section class="article-cover campus-cover"><img src="./images/index-head.png" alt="校园风貌"></section>
        <article class="article-body" data-annotation-key="school-profile-sections">
          <h1>浙江纺织服装职业技术学院</h1>
          <section><h2>历史沿革</h2><p>学校扎根宁波、服务纺织服装产业发展，持续推进职业教育与区域产业协同创新。</p></section>
          <section><h2>办学理念</h2><p>坚持立德树人、产教融合，以学生成长和产业需求为导向培养高素质技术技能人才。</p></section>
          <section><h2>发展目标</h2><p>建设特色鲜明、国内一流、国际有影响的高水平职业院校。</p></section>
          <section><h2>师资力量</h2><p>拥有来自教学、科研和行业企业的“双师型”教师团队，持续服务人才培养与技术创新。</p></section>
          <section><h2>科研成果</h2><p>围绕纺织服装、数字创意和智能制造开展应用研究，推动成果转化与社会服务。</p></section>
        </article>
      </main>`
  }

  window.H5MajorsPage = {
    name: 'H5MajorsPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page list-page" data-page-id="majors" data-annotation-key="majors-page">
        ${nav('专业介绍', 'home')}
        <section class="sticky-search" data-annotation-key="major-search">
          <van-search v-model="keyword" shape="round" placeholder="搜索专业名称" @clear="keyword=''" />
          <button class="filter-chip" type="button" @click="picker=true">{{ college || '全部分院' }} <van-icon name="arrow-down" /></button>
        </section>
        <section v-if="filtered.length" class="major-list">
          <article v-for="item in filtered" :key="item.code" class="major-card" @click="open(item)">
            <div><span class="code">{{ item.code }}</span><h2>{{ item.name }}</h2><p>{{ item.college }}</p></div><van-icon name="arrow" />
          </article>
        </section>
        <van-empty v-else image="./images/empty.png" description="没有符合条件的专业"><van-button size="small" type="primary" @click="reset">清空筛选</van-button></van-empty>
        <van-popup v-model:show="picker" position="bottom" round>
          <van-picker title="选择所属分院" :columns="colleges" @confirm="confirmCollege" @cancel="picker=false" />
        </van-popup>
      </main>`,
    setup(_, { emit }) {
      const keyword = Vue.ref('')
      const college = Vue.ref('')
      const picker = Vue.ref(false)
      const colleges = [{ text: '全部分院', value: '' }, ...Array.from(new Set(data.majors.map(i => i.college))).map(v => ({ text: v, value: v }))]
      const filtered = Vue.computed(() => data.majors.filter(i => (!keyword.value || i.name.includes(keyword.value)) && (!college.value || i.college === college.value)))
      const confirmCollege = ({ selectedOptions }) => { college.value = selectedOptions[0].value; picker.value = false }
      const reset = () => { keyword.value = ''; college.value = '' }
      const open = item => { data.selectedMajor = item; emit('navigate', 'major-detail') }
      return { keyword, college, picker, colleges, filtered, confirmCollege, reset, open }
    }
  }

  window.H5MajorDetailPage = {
    name: 'H5MajorDetailPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page detail-page" data-page-id="major-detail" data-annotation-key="major-detail-page">
        ${nav('专业详情', 'majors')}
        <section class="major-hero" data-annotation-key="major-detail-core">
          <span>{{ major.college }}</span><h1>{{ major.name }}</h1><p>专业代码 {{ major.code }}</p>
        </section>
        <article class="article-body">
          <h2>专业介绍</h2><p>{{ major.desc }}</p>
          <h2>培养方向</h2><p>围绕岗位真实能力组织课程与实践，强化项目学习、实训实习和职业素养。</p>
          <h2>就业方向</h2><p>面向宁波及长三角相关产业企业，从事设计、技术、运营与项目管理工作。</p>
        </article>
      </main>`,
    setup() {
      return { major: data.selectedMajor || data.majors[0] }
    }
  }

  window.H5CampusMapPage = {
    name: 'H5CampusMapPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page map-page" data-page-id="campus-map" data-annotation-key="campus-map-page">
        ${nav('校园地图', 'home')}
        <section class="campus-map-card" data-annotation-key="campus-map-media" @click="preview=true">
          <svg viewBox="0 0 360 440" role="img" aria-label="校园场所分布图">
            <rect width="360" height="440" fill="#eaf4e8"/><path d="M40 18h80v404H40zM236 18h84v404h-84z" fill="#d7e9d2"/>
            <path d="M0 205h360v42H0zM160 0h42v440h-42z" fill="#d8dde4"/>
            <rect x="48" y="42" width="68" height="54" rx="5" fill="#7ea8e8"/><rect x="244" y="50" width="68" height="70" rx="5" fill="#f2b565"/>
            <rect x="50" y="278" width="66" height="92" rx="5" fill="#82c6a1"/><rect x="244" y="286" width="68" height="74" rx="5" fill="#c59ee3"/>
            <ellipse cx="181" cy="138" rx="48" ry="34" fill="#8fd2dd"/><circle cx="181" cy="226" r="8" fill="#2d65f0"/>
            <text x="82" y="74" text-anchor="middle">教学楼</text><text x="278" y="87" text-anchor="middle">图书馆</text>
            <text x="83" y="326" text-anchor="middle">学生公寓</text><text x="278" y="326" text-anchor="middle">体育馆</text>
            <text x="181" y="142" text-anchor="middle">中心广场</text><text x="181" y="260" text-anchor="middle" fill="#2d65f0">当前位置</text>
          </svg>
          <div class="map-hint"><van-icon name="enlarge" /> 点击查看全屏地图</div>
        </section>
        <section class="place-list">
          <h2>场所分布</h2>
          <van-cell v-for="place in places" :key="place.name" :title="place.name" :label="place.desc" :icon="place.icon" />
        </section>
        <van-image-preview v-model:show="preview" :images="[mapData]" />
      </main>`,
    setup() {
      const preview = Vue.ref(false)
      const mapData = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440"><rect width="360" height="440" fill="#eaf4e8"/><path d="M40 18h80v404H40zM236 18h84v404h-84z" fill="#d7e9d2"/><path d="M0 205h360v42H0zM160 0h42v440h-42z" fill="#d8dde4"/><rect x="48" y="42" width="68" height="54" rx="5" fill="#7ea8e8"/><rect x="244" y="50" width="68" height="70" rx="5" fill="#f2b565"/><rect x="50" y="278" width="66" height="92" rx="5" fill="#82c6a1"/><rect x="244" y="286" width="68" height="74" rx="5" fill="#c59ee3"/><ellipse cx="181" cy="138" rx="48" ry="34" fill="#8fd2dd"/><circle cx="181" cy="226" r="8" fill="#2d65f0"/><text x="82" y="74" text-anchor="middle">教学楼</text><text x="278" y="87" text-anchor="middle">图书馆</text><text x="83" y="326" text-anchor="middle">学生公寓</text><text x="278" y="326" text-anchor="middle">体育馆</text><text x="181" y="142" text-anchor="middle">中心广场</text></svg>')
      const places = [
        { name: '教学楼', desc: '1 号门向北 180 米', icon: 'hotel-o' },
        { name: '图书馆', desc: '中心广场东侧', icon: 'records-o' },
        { name: '学生公寓', desc: '校园西南生活区', icon: 'wap-home-o' },
        { name: '体育馆', desc: '校园东南运动区', icon: 'fire-o' }
      ]
      return { preview, mapData, places }
    }
  }

  window.H5AdmissionPage = {
    name: 'H5AdmissionPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page admission-page" data-page-id="admission" data-annotation-key="admission-page">
        ${nav('招生咨询', 'home')}
        <section class="contact-hero"><img src="./images/fy-logo.png" alt="学校标志"><div><h1>招生咨询服务</h1><p>工作日 08:30—16:30</p></div></section>
        <van-cell-group inset data-annotation-key="admission-contact-actions">
          <van-cell title="招生热线" value="0574-8632 8888" icon="phone-o" is-link @click="dial" />
          <van-cell title="传真" value="0574-8632 8800" icon="description" is-link @click="copyFax" />
        </van-cell-group>
        <section class="wechat-card">
          <h2>微信公众号</h2><div class="qr-code" @click="qr=true"><span>纺院招生</span></div><p>长按或点击放大二维码关注</p>
        </section>
        <van-dialog v-model:show="dialConfirm" title="拨打招生热线" show-cancel-button @confirm="dialDone">即将调用手机拨号能力：0574-8632 8888</van-dialog>
        <van-image-preview v-model:show="qr" :images="[qrImage]" />
      </main>`,
    setup() {
      const dialConfirm = Vue.ref(false)
      const qr = Vue.ref(false)
      const dial = () => { dialConfirm.value = true }
      const dialDone = () => vant.showToast('原型：已请求宿主拨号能力')
      const copyFax = async () => {
        try { await navigator.clipboard.writeText('0574-86328800'); vant.showSuccessToast('传真号码已复制') }
        catch (_) { vant.showToast('请手动记录：0574-8632 8800') }
      }
      const qrImage = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" fill="white"/><g fill="#111"><path d="M20 20h70v70H20zm15 15v40h40V35zM150 20h70v70h-70zm15 15v40h40V35zM20 150h70v70H20zm15 15v40h40v-40z"/><path d="M110 20h20v20h-20zm0 40h20v30h-20zm-10 50h30v20h-30zm50 0h20v20h-20zm40 0h30v20h-30zm-80 40h20v30h-20zm40 0h30v20h-30zm40 10h30v30h-30zm-80 40h30v20h-30zm50-10h20v30h-20z"/></g><text x="120" y="138" text-anchor="middle" font-size="13">纺院招生</text></svg>')
      return { dialConfirm, qr, dial, dialDone, copyFax, qrImage }
    }
  }

  window.H5NoticesPage = {
    name: 'H5NoticesPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page list-page" data-page-id="notices" data-annotation-key="notices-page">
        ${nav('通知公告', 'home')}
        <van-search v-model="keyword" shape="round" placeholder="搜索公告标题" data-annotation-key="notice-list-content" />
        <section v-if="filtered.length" class="notice-list">
          <article v-for="item in filtered" :key="item.id" class="notice-card" @click="open(item)">
            <div class="notice-meta"><span>{{ item.time }}</span><van-tag v-if="item.important" type="danger">重点</van-tag></div>
            <h2>{{ item.title }}</h2><p>{{ item.summary }}</p>
          </article>
        </section>
        <van-empty v-else image="./images/empty.png" description="暂无通知公告" />
      </main>`,
    setup(_, { emit }) {
      const keyword = Vue.ref('')
      const filtered = Vue.computed(() => data.notices.filter(i => i.title.includes(keyword.value)))
      const open = item => { data.selectedNotice = item; emit('navigate', 'notice-detail') }
      return { keyword, filtered, open }
    }
  }

  window.H5NoticeDetailPage = {
    name: 'H5NoticeDetailPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page detail-page" data-page-id="notice-detail" data-annotation-key="notice-detail-page">
        ${nav('公告详情', 'notices')}
        <article class="article-body" data-annotation-key="notice-detail-body">
          <h1>{{ item.title }}</h1><div class="article-meta">{{ item.time }} · 党政办公室</div>
          <p>{{ item.summary }}</p><p>请各位师生合理安排时间，提前了解校园服务开放情况。如有问题，可通过招生咨询或学校服务大厅联系。</p>
          <h2>相关附件</h2><van-cell title="暑期校园服务安排.pdf" icon="description" is-link @click="download" />
        </article>
      </main>`,
    setup() {
      const item = data.selectedNotice || data.notices[0]
      const download = () => vant.showToast('原型：附件下载需 APP 宿主能力')
      return { item, download }
    }
  }

  window.H5NewsPage = {
    name: 'H5NewsPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page list-page" data-page-id="news" data-annotation-key="news-page">
        ${nav('校园资讯', 'home')}
        <section class="news-list" data-annotation-key="news-list-cards">
          <article v-for="item in visible" :key="item.id" class="news-card" @click="open(item)">
            <img :src="item.image" :alt="item.title"><div><van-tag v-if="item.recommended" type="primary">首页推荐</van-tag><h2>{{ item.title }}</h2><p>{{ item.publisher }} · {{ item.time }}</p></div>
          </article>
        </section>
        <div class="load-more"><van-button size="small" plain type="primary" :disabled="visible.length>=news.length" @click="loadMore">加载更多</van-button></div>
      </main>`,
    setup(_, { emit }) {
      const news = data.news
      const count = Vue.ref(2)
      const visible = Vue.computed(() => news.slice(0, count.value))
      const loadMore = () => { count.value = news.length; vant.showSuccessToast('已加载全部资讯') }
      const open = item => { data.selectedNews = item; emit('navigate', 'news-detail') }
      return { news, visible, loadMore, open }
    }
  }

  window.H5NewsDetailPage = {
    name: 'H5NewsDetailPage',
    emits: ['navigate'],
    template: `
      <main class="h5-page detail-page" data-page-id="news-detail" data-annotation-key="news-detail-page">
        ${nav('资讯详情', 'news')}
        <article class="article-body" data-annotation-key="news-detail-body">
          <van-tag v-if="item.recommended" type="primary">首页推荐</van-tag><h1>{{ item.title }}</h1>
          <div class="article-meta">{{ item.publisher }} · {{ item.time }}</div>
          <img class="article-image" :src="item.image" :alt="item.title" @click="preview=true">
          <p>本次活动围绕学校人才培养、产教融合和校园文化建设展开，集中展示师生实践成果与创新项目。</p>
          <p>现场设置成果展示、互动体验和交流分享环节，进一步营造开放、协同、创新的校园氛围。</p>
        </article>
        <van-image-preview v-model:show="preview" :images="[item.image]" />
      </main>`,
    setup() {
      return { item: data.selectedNews || data.news[0], preview: Vue.ref(false) }
    }
  }
})()

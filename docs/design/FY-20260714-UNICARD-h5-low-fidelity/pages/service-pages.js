window.H5BooksPage = {
  name:'H5BooksPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="图书服务" left-arrow @click-left="$emit('navigate','home')" />
      <section class="book-hero" data-annotation-key="book-service-source">
        <h1>发现一本好书</h1>
        <van-search v-model="keyword" shape="round" placeholder="书名 / 作者 / ISBN" @search="search"/>
      </section>
      <van-tabs v-model:active="active">
        <van-tab title="新书推荐"><section class="book-list"><button v-for="book in books" :key="book.id" @click="open(book)"><img src="./images/book-cover.png"><span><strong>{{book.title}}</strong><small>{{book.author}} · {{book.publisher}}</small><em :class="{available:book.status==='在馆'}">{{book.status}}</em></span></button></section></van-tab>
        <van-tab title="借阅排行"><section class="rank-list"><button v-for="book in books" :key="book.id" @click="open(book)"><b>{{book.rank}}</b><span><strong>{{book.title}}</strong><small>{{book.author}} · {{book.number}}</small></span><van-icon name="arrow"/></button></section></van-tab>
      </van-tabs>
    </main>`,
  setup(_, {emit}){const keyword=Vue.ref(''),active=Vue.ref(0),books=window.H5PrototypeData.books;const search=()=>emit('navigate','book-results');const open=book=>{window.H5PrototypeData.selectedBook=book;emit('navigate','book-detail')};return{keyword,active,books,search,open}}
}

window.H5BookResultsPage = {
  name:'H5BookResultsPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="检索结果" left-arrow @click-left="$emit('navigate','books')" />
      <van-search v-model="keyword" show-action placeholder="书名 / 作者 / ISBN" @search="run"><template #action><button class="text-button" @click="run">搜索</button></template></van-search>
      <van-dropdown-menu><van-dropdown-item v-model="status" :options="statusOptions"/><van-dropdown-item v-model="sort" :options="sortOptions"/></van-dropdown-menu>
      <p class="result-count">共找到 {{filtered.length}} 本图书</p>
      <section class="book-list" data-annotation-key="book-result-list"><button v-for="book in filtered" :key="book.id" @click="open(book)"><img src="./images/book-cover.png"><span><strong>{{book.title}}</strong><small>作者：{{book.author}}</small><small>出版社：{{book.publisher}}</small><small>出版年月：{{book.year}}</small><small>索书号：{{book.number}}</small><em :class="{available:book.status==='在馆'}">{{book.status}}</em></span></button></section>
      <van-empty v-if="!filtered.length" description="未找到匹配图书"/>
    </main>`,
  setup(_, {emit}){const keyword=Vue.ref('设计'),status=Vue.ref('all'),sort=Vue.ref('relevance'),statusOptions=[{text:'全部状态',value:'all'},{text:'在馆',value:'在馆'},{text:'借出',value:'借出'}],sortOptions=[{text:'相关度',value:'relevance'},{text:'出版时间',value:'year'}];const filtered=Vue.computed(()=>window.H5PrototypeData.books.filter(x=>(status.value==='all'||x.status===status.value)&&(!keyword.value||`${x.title}${x.author}${x.publisher}`.includes(keyword.value))));const run=()=>vant.showToast(`找到 ${filtered.value.length} 本图书`);const open=book=>{window.H5PrototypeData.selectedBook=book;emit('navigate','book-detail')};return{keyword,status,sort,statusOptions,sortOptions,filtered,run,open}}
}

window.H5BookDetailPage = {
  name:'H5BookDetailPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="图书详情" left-arrow @click-left="$emit('navigate','book-results')" />
      <section class="book-detail-head"><img src="./images/book-cover.png"><div><h1>{{book.title}}</h1><p>{{book.author}}</p><van-tag :type="book.status==='在馆'?'success':'warning'">{{book.status}}</van-tag></div></section>
      <van-cell-group inset title="书目信息">
        <van-cell title="作者" :value="book.author"/><van-cell title="出版社" :value="book.publisher"/><van-cell title="出版年月" :value="book.year"/><van-cell title="索书号" :value="book.number"/>
      </van-cell-group>
      <van-cell-group inset title="馆藏信息" data-annotation-key="book-detail-availability">
        <van-cell title="借阅状态" :value="book.status"/><van-cell title="馆藏地" :label="book.location" is-link @click="vant.showToast('已定位到馆藏区域')"/>
      </van-cell-group>
      <section class="info-card"><h2>内容简介</h2><p>围绕专业学习与实践应用展开，内容结构清晰，适合作为课程参考与延伸阅读。</p></section>
    </main>`,
  setup(){return{book:window.H5PrototypeData.selectedBook||window.H5PrototypeData.books[0],vant}}
}

window.H5MinePage = {
  name:'H5MinePage', emits:['navigate'],
  template:`
    <main class="h5-page mine-page">
      <section class="mine-head" data-annotation-key="mine-user-summary">
        <img src="./images/avatar.png"><div><h1>张同学</h1><p>数字媒体技术 · 2026 级</p></div><van-icon name="setting-o" size="22" @click="$emit('navigate','profile')"/>
      </section>
      <section class="identity-card"><span>在校学生</span><strong>校园服务已激活</strong><small>一卡通账号：NB****1208</small></section>
      <section class="mine-groups" data-annotation-key="mine-service-groups">
        <h2>我的服务</h2>
        <div class="service-grid">
          <button v-for="item in services" :key="item.label" @click="$emit('navigate',item.page)"><span class="service-icon"><van-icon :name="item.icon"/></span><small>{{item.label}}</small></button>
        </div>
      </section>
      <van-cell-group inset>
        <van-cell title="个人资料" icon="contact-o" is-link @click="$emit('navigate','profile')"/><van-cell title="服务消息" icon="chat-o" value="2 条未读" is-link @click="$emit('navigate','messages')"/><van-cell title="帮助与反馈" icon="service-o" is-link @click="vant.showToast('客服热线：0574-86328888')"/>
      </van-cell-group>
    </main>`,
  setup(){return{vant,services:[{label:'预约记录',icon:'notes-o',page:'visitor-records'},{label:'校园卡包',icon:'card',page:'wallet'},{label:'图书服务',icon:'bookmark-o',page:'books'},{label:'校园启航',icon:'flag-o',page:'onboarding'},{label:'消费记录',icon:'balance-list-o',page:'wallet'},{label:'门禁记录',icon:'shield-o',page:'wallet'},{label:'我的账本',icon:'bill-o',page:'wallet'},{label:'校园码',icon:'qr',page:'wallet'}]}}
}

window.H5ProfilePage = {
  name:'H5ProfilePage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="个人资料" left-arrow @click-left="$emit('navigate','mine')" />
      <section class="avatar-panel"><img src="./images/avatar.png"><strong>张同学</strong><van-tag type="primary">在校学生</van-tag></section>
      <van-cell-group inset title="基础资料" data-annotation-key="profile-edit-scope">
        <van-cell title="姓名" value="张同学"/><van-cell title="身份证号" value="330203********1234"/><van-cell title="手机号" value="138****8000"/><van-cell title="学号" value="20261001208"/><van-cell title="院系" value="信息技术学院"/><van-cell title="专业" value="数字媒体技术"/><van-cell title="年级" value="2026 级"/>
      </van-cell-group>
      <van-cell-group inset title="身份差异"><van-cell title="当前身份" value="师生"/><van-cell title="访客可见范围" label="仅展示访客预约与通行相关服务"/></van-cell-group>
    </main>`
}

window.H5MessagesPage = {
  name:'H5MessagesPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="服务消息" left-arrow right-text="全部已读" @click-left="$emit('navigate','home')" @click-right="readAll" />
      <van-notice-bar left-icon="info-o" text="消息由宁波一卡通 APP 服务通道统一送达。" data-annotation-key="message-integration"/>
      <section class="message-list"><button v-for="msg in messages" :key="msg.id" :class="{unread:!msg.read}" @click="open(msg)"><i></i><span><strong>{{msg.title}}</strong><small>{{msg.content}}</small><time>{{msg.time}}</time></span><van-icon name="arrow"/></button></section>
    </main>`,
  setup(_, {emit}){const messages=Vue.reactive(window.H5PrototypeData.messages);const open=msg=>{msg.read=true;window.H5PrototypeData.selectedMessage=msg;emit('navigate','message-detail')};const readAll=()=>{messages.forEach(x=>x.read=true);vant.showToast('已全部标记为已读')};return{messages,open,readAll}}
}

window.H5MessageDetailPage = {
  name:'H5MessageDetailPage', emits:['navigate'],
  template:`
    <main class="h5-page">
      <van-nav-bar title="消息详情" left-arrow @click-left="$emit('navigate','messages')" />
      <article class="message-detail" data-annotation-key="message-detail-status"><h1>{{msg.title}}</h1><time>{{msg.time}}</time><p>{{msg.content}}</p><p>请进入对应服务查看详情，如有疑问请联系校园服务中心。</p></article>
      <div class="safe-actions"><van-button round block type="primary" @click="$emit('navigate',target)">查看相关服务</van-button></div>
    </main>`,
  setup(){const msg=window.H5PrototypeData.selectedMessage||window.H5PrototypeData.messages[0];return{msg,target:msg.title.includes('访客')?'visitor-records':msg.title.includes('图书')?'books':'wallet'}}
}

window.H5WalletPage = {
  name:'H5WalletPage', emits:['navigate'],
  template:`
    <main class="h5-page wallet-page">
      <van-nav-bar title="校园卡包" left-arrow @click-left="$emit('navigate','mine')" />
      <section v-if="bound" class="campus-card" data-annotation-key="wallet-integration">
        <div><img src="./images/fy-logo.png"><span>浙江纺织服装职业技术学院</span></div><p>校园卡</p><strong data-annotation-key="wallet-card-number">2026 **** 1208</strong><small>张同学 · 正常</small>
      </section>
      <section v-else class="unbound-card" data-annotation-key="wallet-integration"><van-icon name="card" size="52"/><h2>尚未绑定校园卡</h2><p>完成身份核验后绑定校园卡，使用校园码服务。</p><van-button round type="primary" @click="bindShow=true">立即绑定</van-button></section>
      <section v-if="bound" class="wallet-actions"><button @click="qrShow=true"><van-icon name="qr" size="30"/><strong>校园码</strong><small>校门通行与身份核验</small></button><button @click="vant.showToast('余额 ¥ 126.80')"><van-icon name="balance-o" size="30"/><strong>卡片余额</strong><small>¥ 126.80</small></button></section>
      <van-cell-group v-if="bound" inset><van-cell title="绑定手机号" value="138****8000"/><van-cell title="绑定状态" value="已绑定" value-class="success-text"/><van-cell title="解除绑定" is-link @click="unbind"/></van-cell-group>
      <van-popup v-model:show="bindShow" round position="bottom"><div class="bottom-form"><h2>绑定校园卡</h2><van-field v-model="studentNo" label="学号" placeholder="请输入学号"/><van-field v-model="idLast" label="身份证后六位" placeholder="请输入后六位"/><van-button block round type="primary" @click="bind">确认绑定</van-button><button class="simulate-fail" @click="fail">演示绑定失败</button></div></van-popup>
      <van-dialog v-model:show="qrShow" title="校园码" confirm-button-text="关闭"><div class="qr-box"><van-icon name="qr" size="160"/><p>动态码 28 秒后刷新</p></div></van-dialog>
    </main>`,
  setup(){const bound=Vue.ref(true),bindShow=Vue.ref(false),qrShow=Vue.ref(false),studentNo=Vue.ref('20261001208'),idLast=Vue.ref('011234');const bind=()=>{if(!studentNo.value||!idLast.value)return vant.showToast('请填写绑定信息');bound.value=true;bindShow.value=false;vant.showSuccessToast('绑定成功')};const fail=()=>vant.showFailToast('信息不匹配，绑定失败');const unbind=()=>vant.showConfirmDialog({title:'解除校园卡绑定？',message:'解除后将无法使用校园码。'}).then(()=>{bound.value=false}).catch(()=>{});return{vant,bound,bindShow,qrShow,studentNo,idLast,bind,fail,unbind}}
}

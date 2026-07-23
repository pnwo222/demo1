window.H5HomePage = {
  name:'H5HomePage', emits:['navigate'],
  template:`
    <main class="h5-page home-page" data-page-id="home" data-annotation-key="home-page">
      <section class="home-hero" data-annotation-key="home-content-source">
        <img src="./images/index-head.png" alt="校园风貌">
        <div><span>{{schoolName}}</span><h1>校园服务专区</h1><p>校园资讯、便民服务，一站直达</p></div>
      </section>
      <section class="mobile-card service-card">
        <div class="section-title"><strong>校园服务</strong><small>常用入口</small></div>
        <div class="service-grid">
          <button v-for="item in services" :key="item.title" @click="$emit('navigate',item.page)"><span class="service-icon" :style="{background:item.color}"><van-icon :name="item.icon"/></span><span>{{item.title}}</span></button>
        </div>
      </section>
      <button class="notice-strip" @click="$emit('navigate','notice-detail')">
        <strong>公告</strong><span>{{notices[0].title}}</span><van-icon name="arrow"/>
      </button>
      <section class="content-section">
        <div class="section-title"><strong>校园资讯</strong><button @click="$emit('navigate','news')">更多 <van-icon name="arrow"/></button></div>
        <button v-for="item in news.slice(0,2)" :key="item.id" class="news-item" @click="openNews(item)"><div><h2>{{item.title}}</h2><p>{{item.publisher}} · {{item.time}}</p></div><img :src="item.image" alt=""></button>
      </section>
      <section class="feature-banner" @click="$emit('navigate','onboarding')"><div><small>新生专属</small><h2>校园启航</h2><p>身份核验 · 社保卡服务 · 校园码</p></div><van-icon name="arrow" size="20"/></section>
    </main>`,
  setup(_, {emit}){
    const data=window.H5PrototypeData
    const services=[
      {title:'学校简介',icon:'wap-home-o',page:'school-profile',color:'#2d65f0'},
      {title:'专业介绍',icon:'award-o',page:'majors',color:'#8b5cf6'},
      {title:'校园地图',icon:'location-o',page:'campus-map',color:'#12a182'},
      {title:'招生服务',icon:'phone-o',page:'admission',color:'#f59e0b'},
      {title:'通知公告',icon:'volume-o',page:'notices',color:'#ef6c55'},
      {title:'访客预约',icon:'friends-o',page:'visitor-apply',color:'#1677ff'},
      {title:'图书服务',icon:'bookmark-o',page:'books',color:'#9b6b43'},
      {title:'校园卡包',icon:'card',page:'wallet',color:'#1e80ff'}
    ]
    const openNews=item=>{data.selectedNews=item;emit('navigate','news-detail')}
    return{schoolName:data.schoolName,services,notices:data.notices,news:data.news,openNews}
  }
}

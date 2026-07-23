window.H5HomePage = {
  name: 'H5HomePage',
  template: `
    <main class="h5-page home-page" data-page-id="home" data-annotation-key="home-page">
      <section class="home-hero" data-annotation-key="home-hero">
        <div class="home-hero__eyebrow">{{ schoolName }}</div>
        <h1>校园服务</h1>
        <p>常用服务与校园动态</p>
      </section>
      <section class="mobile-card service-card" data-annotation-key="home-service-grid">
        <div class="section-title"><strong>常用服务</strong><button type="button">全部</button></div>
        <div class="service-grid">
          <button v-for="item in services" :key="item.title" type="button" @click="$emit('navigate', item.page)">
            <span class="service-icon">{{ item.icon }}</span><span>{{ item.title }}</span>
          </button>
        </div>
      </section>
      <section class="notice-strip" data-annotation-key="home-notice">
        <strong>公告</strong><span>校园服务开放时间调整通知</span><van-icon name="arrow" />
      </section>
      <section class="content-section" data-annotation-key="home-news">
        <div class="section-title"><strong>校园资讯</strong><button type="button">更多</button></div>
        <article v-for="item in news" :key="item.title" class="news-item">
          <div><h2>{{ item.title }}</h2><p>{{ item.source }} · {{ item.date }}</p></div>
          <img :src="item.image" alt="">
        </article>
      </section>
    </main>
  `,
  setup() {
    const schoolName = window.H5PrototypeData.schoolName
    const services = [
      { title: '消费记录', icon: '账', page: 'records' },
      { title: '访客预约', icon: '访', page: 'form' },
      { title: '校园码', icon: '码', page: 'home' },
      { title: '图书服务', icon: '书', page: 'home' }
    ]
    const news = [
      { title: '校园文化活动报名开始', source: '校园资讯', date: '07-23', image: 'https://picsum.photos/seed/campus-1/220/140' },
      { title: '暑期图书馆服务安排', source: '图书馆', date: '07-22', image: 'https://picsum.photos/seed/campus-2/220/140' }
    ]
    return { schoolName, services, news }
  }
}

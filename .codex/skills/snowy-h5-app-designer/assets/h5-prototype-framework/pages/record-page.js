window.H5RecordPage = {
  name: 'H5RecordPage',
  template: `
    <main class="h5-page record-page" data-page-id="records" data-annotation-key="record-page">
      <van-nav-bar title="消费记录" left-arrow @click-left="$emit('navigate', 'home')" />
      <section class="record-summary" data-annotation-key="record-summary">
        <span>本月支出（元）</span><strong>286.50</strong>
      </section>
      <section class="record-filter" data-annotation-key="record-filter">
        <button type="button" @click="showFilter = true">2026年7月 <van-icon name="arrow-down" /></button>
        <span>共 4 笔</span>
      </section>
      <section class="record-list" data-annotation-key="record-list">
        <article v-for="item in records" :key="item.id" class="record-item">
          <span class="record-icon">{{ item.icon }}</span>
          <div><h2>{{ item.title }}</h2><p>{{ item.time }} · {{ item.place }}</p></div>
          <strong>-{{ item.amount }}</strong>
        </article>
      </section>
      <van-action-sheet v-model:show="showFilter" title="选择月份">
        <van-date-picker v-model="month" columns-type="year-month" @confirm="showFilter = false" @cancel="showFilter = false" />
      </van-action-sheet>
    </main>
  `,
  setup() {
    const showFilter = Vue.ref(false)
    const month = Vue.ref(['2026', '07'])
    const records = [
      { id: 1, icon: '餐', title: '第一食堂', time: '07-23 12:18', place: '一楼窗口', amount: '18.00' },
      { id: 2, icon: '超', title: '校园超市', time: '07-22 18:42', place: '生活区', amount: '36.50' },
      { id: 3, icon: '餐', title: '第二食堂', time: '07-21 11:56', place: '二楼窗口', amount: '22.00' }
    ]
    return { showFilter, month, records }
  }
}

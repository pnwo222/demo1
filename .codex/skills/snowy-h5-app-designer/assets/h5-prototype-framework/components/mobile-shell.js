window.H5MobileShell = {
  name: 'H5MobileShell',
  components: {
    H5HomePage: window.H5HomePage,
    H5RecordPage: window.H5RecordPage,
    H5FormPage: window.H5FormPage
  },
  template: `
    <div class="prototype-shell" data-annotation-key="global-shell">
      <component :is="pageComponent" @navigate="navigate" />
      <van-tabbar v-if="page === 'home'" v-model="tab" data-annotation-key="global-tabbar">
        <van-tabbar-item icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item icon="apps-o">服务</van-tabbar-item>
        <van-tabbar-item icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  `,
  setup() {
    const page = Vue.ref(window.H5PrototypeData.currentPage || 'home')
    const tab = Vue.ref(0)
    const pageComponent = Vue.computed(() => ({
      home: 'H5HomePage',
      records: 'H5RecordPage',
      form: 'H5FormPage'
    })[page.value] || 'H5HomePage')
    const navigate = (next) => {
      page.value = next
      window.H5PrototypeData.currentPage = next
      window.dispatchEvent(new CustomEvent('h5-prototype-page-change', { detail: { pageId: next } }))
      window.scrollTo({ top: 0 })
    }
    return { page, tab, pageComponent, navigate }
  }
}

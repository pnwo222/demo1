window.H5MobileShell = {
  name:'H5MobileShell',
  components:{
    H5HomePage:window.H5HomePage,H5SchoolProfilePage:window.H5SchoolProfilePage,H5MajorsPage:window.H5MajorsPage,H5MajorDetailPage:window.H5MajorDetailPage,
    H5CampusMapPage:window.H5CampusMapPage,H5AdmissionPage:window.H5AdmissionPage,H5NoticesPage:window.H5NoticesPage,H5NoticeDetailPage:window.H5NoticeDetailPage,
    H5NewsPage:window.H5NewsPage,H5NewsDetailPage:window.H5NewsDetailPage,H5VisitorApplyPage:window.H5VisitorApplyPage,H5VisitorRecordsPage:window.H5VisitorRecordsPage,
    H5VisitorDetailPage:window.H5VisitorDetailPage,H5OnboardingPage:window.H5OnboardingPage,H5OnboardingVerifyPage:window.H5OnboardingVerifyPage,
    H5OnboardingCardPage:window.H5OnboardingCardPage,H5OnboardingApplyCardPage:window.H5OnboardingApplyCardPage,H5OnboardingResultPage:window.H5OnboardingResultPage,
    H5BooksPage:window.H5BooksPage,H5BookResultsPage:window.H5BookResultsPage,H5BookDetailPage:window.H5BookDetailPage,H5MinePage:window.H5MinePage,
    H5ProfilePage:window.H5ProfilePage,H5MessagesPage:window.H5MessagesPage,H5MessageDetailPage:window.H5MessageDetailPage,H5WalletPage:window.H5WalletPage
  },
  template:`
    <div class="prototype-shell" data-annotation-key="global-shell">
      <component :is="pageComponent" @navigate="navigate"/>
      <van-tabbar v-if="tabPages.includes(page)" :model-value="tabValue" safe-area-inset-bottom data-annotation-key="global-tabbar" @change="changeTab">
        <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item name="messages" icon="chat-o" :badge="unread||''">消息</van-tabbar-item>
        <van-tabbar-item name="mine" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>`,
  setup(){
    const validPages=Object.keys(window.H5PrototypeData.pageRequirements)
    const normalize=()=>{const id=(location.hash||'#/home').replace(/^#\/?/,'');return validPages.includes(id)?id:'home'}
    const page=Vue.ref(normalize())
    const pageMap={
      home:'H5HomePage','school-profile':'H5SchoolProfilePage',majors:'H5MajorsPage','major-detail':'H5MajorDetailPage','campus-map':'H5CampusMapPage',admission:'H5AdmissionPage',
      notices:'H5NoticesPage','notice-detail':'H5NoticeDetailPage',news:'H5NewsPage','news-detail':'H5NewsDetailPage','visitor-apply':'H5VisitorApplyPage',
      'visitor-records':'H5VisitorRecordsPage','visitor-detail':'H5VisitorDetailPage',onboarding:'H5OnboardingPage','onboarding-verify':'H5OnboardingVerifyPage',
      'onboarding-card':'H5OnboardingCardPage','onboarding-apply-card':'H5OnboardingApplyCardPage','onboarding-result':'H5OnboardingResultPage',
      books:'H5BooksPage','book-results':'H5BookResultsPage','book-detail':'H5BookDetailPage',mine:'H5MinePage',profile:'H5ProfilePage',
      messages:'H5MessagesPage','message-detail':'H5MessageDetailPage',wallet:'H5WalletPage'
    }
    const pageComponent=Vue.computed(()=>pageMap[page.value]||'H5HomePage')
    const tabPages=['home','messages','mine'],tabValue=Vue.computed(()=>tabPages.includes(page.value)?page.value:'')
    const unread=Vue.computed(()=>window.H5PrototypeData.messages.filter(x=>!x.read).length)
    const navigate=next=>{if(!validPages.includes(next))next='home';page.value=next;window.H5PrototypeData.currentPage=next;if(location.hash!==`#/${next}`)history.pushState(null,'',`#/${next}`);window.dispatchEvent(new CustomEvent('h5-prototype-page-change',{detail:{pageId:next}}));window.scrollTo({top:0,behavior:'instant'})}
    const changeTab=next=>navigate(next)
    window.addEventListener('hashchange',()=>navigate(normalize()))
    window.H5Navigate=navigate
    return{page,pageComponent,tabPages,tabValue,unread,navigate,changeTab}
  }
}

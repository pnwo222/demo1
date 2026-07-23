const app = Vue.createApp({
  components: { H5MobileShell: window.H5MobileShell },
  template: '<H5MobileShell />'
})
app.use(vant)
app.mount('#app')
window.H5AnnotationRuntime.init(window.H5PrototypeData)

import Vue from 'vue'
import router from './routes'
import App from './App'

// import 'res/iconfont/iconfont.css'

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
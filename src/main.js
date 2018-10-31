// 转义插件    
import 'babel-polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import VueAxios from 'vue-axios'
import Axios from 'axios'
import 'jquery'

// 加载 all.css
import './assets/css/all.css'

import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名 滚动条
Vue.component('happy-scroll', HappyScroll)
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

Vue.config.productionTip = false
Vue.use(VueAxios, Axios)
Vue.use(ElementUI)

import cookiesFn from './utils/cookies'
Vue.prototype.cookiesFn = cookiesFn
Vue.prototype.url = 'http://test.geointech.cn'
import msg from './utils/msg'
Vue.prototype.msg = msg.msg
Vue.prototype.alertFrame = msg.alertFrame
Vue.prototype.$ = $

/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

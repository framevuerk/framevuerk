import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from '../dist/framevuerk-en.js'
import moment from 'moment-jalaali'
import 'font-awesome/css/font-awesome.css'
import 'shabnam-font/dist/font-face.css'
import './index.html'

import main from './main.vue'
import fvMain from './components/fvMain.vue'

framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(framevuerk)

// routes
const router = new VueRouter({
  routes: [
    {
      name: '',
      path: '/'
    },
    {
      name: 'fvMain',
      path: '/components/fvMain',
      component: fvMain
    },
    {
      name: 'notfound',
      path: '/*'
    }
  ]
})
export default new Vue({
  router,
  render: h => h(main)
}).$mount('#app')

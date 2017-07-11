import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from 'framevuerk'
import moment from 'moment-jalaali'
import 'font-awesome/css/font-awesome.css'
import './index.html'

import './index.html'
import main from './pages/main'
// Components Page
import fvMain from './pages/component_fvMain'

framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(framevuerk)

// Routes
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
 

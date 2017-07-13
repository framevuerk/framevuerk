import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from 'framevuerk'
import moment from 'moment-jalaali'
import 'font-awesome/css/font-awesome.css'

import './index.html'
import main from './pages/main'
// Components Page
import fvMain from './pages/component_fvMain'
import fvHeader from './pages/component_fvHeader'
import fvSidebar from './pages/component_fvSidebar'
import fvFooter from './pages/component_fvFooter'

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
      name: 'fvHeader',
      path: '/components/fvHeader',
      component: fvHeader
    },
    {
      name: 'fvSidebar',
      path: '/components/fvSidebar',
      component: fvSidebar
    },
    {
      name: 'fvFooter',
      path: '/components/fvFooter',
      component: fvFooter
    },
    {
      name: 'notfound',
      path: '/*'
    }
  ]
})
export default new Vue({
  data () {
    return {
      mainClass: ['fv-col-lg-10', 'fv-col-offset-lg-1', 'fv-col-xl-8', 'fv-col-offset-xl-2'],
      githubRepo: 'https://github.com/nainemom/framevuerk'
    }
  },
  router,
  render: h => h(main)
}).$mount('#app')

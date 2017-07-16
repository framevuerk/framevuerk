import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from 'framevuerk'
import moment from 'moment-jalaali'
import 'font-awesome/css/font-awesome.css'

import './index.html'
import './assets/favicon.ico'
import main from './pages/main'
import welcome from './pages/welcome'
// Components Page
import fvMain from './pages/component_fvMain'
import fvHeader from './pages/component_fvHeader'
import fvSidebar from './pages/component_fvSidebar'
import fvFooter from './pages/component_fvFooter'
import fvContent from './pages/component_fvContent'
import fvDialog from './pages/component_fvDialog'

framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(framevuerk)

// Routes
const router = new VueRouter({
  routes: [
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
      name: 'fvContent',
      path: '/components/fvContent',
      component: fvContent
    },
    {
      name: 'fvFooter',
      path: '/components/fvFooter',
      component: fvFooter
    },
    {
      name: 'fvDialog',
      path: '/components/fvDialog',
      component: fvDialog
    },
    {
      name: 'welcome',
      path: '/*',
      component: welcome
    }
  ]
})
export default new Vue({
  data () {
    return {
      mainClass: ['fv-col-lg-10', 'fv-col-offset-lg-1', 'fv-col-xl-8', 'fv-col-offset-xl-2'],
      githubRepo: 'https://github.com/nainemom/framevuerk',
      npmRepo: 'https://www.npmjs.com/package/framevuerk'
    }
  },
  router,
  render: h => h(main)
}).$mount('#app')

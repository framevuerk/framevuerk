import './google-analytics.js.none'
import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from 'framevuerk'
import moment from 'moment-jalaali'
import hammer from 'hammerjs'
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'
import 'font-awesome/css/font-awesome.css'

import './doc.html'
import './index.html'
import './favicon.ico'
import './CNAME.none'
import main from './pages/main'
// Components Page
import fvMain from './pages/component_fvMain'
import fvHeader from './pages/component_fvHeader'
import fvSidebar from './pages/component_fvSidebar'
import fvFooter from './pages/component_fvFooter'
import fvContent from './pages/component_fvContent'
import fvDialog from './pages/component_fvDialog'
import fvMenu from './pages/component_fvMenu'
import fvButton from './pages/component_fvButton'
import fvInput from './pages/component_fvInput'
import fvTextarea from './pages/component_fvTextarea'
import fvSelect from './pages/component_fvSelect'
import fvDatepicker from './pages/component_fvDatepicker'
import fvSwitch from './pages/component_fvSwitch'
import fvCheck from './pages/component_fvCheck'
import fvFilepicker from './pages/component_fvFilepicker'
import fvForm from './pages/component_fvForm'
import fvTable from './pages/component_fvTable'
import fvImg from './pages/component_fvImg'

import include from './pages/installation_include'
import usage from './pages/installation_usage'

framevuerk.use(hammer)
framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(VueHighlightJS)
Vue.use(framevuerk)


// Routes
const router = new VueRouter({
  routes: [
    {
      name: 'Include',
      path: '/installation/include',
      component: include
    },
    {
      name: 'Usage',
      path: '/installation/usage',
      component: usage
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
      name: 'fvMenu',
      path: '/components/fvMenu',
      component: fvMenu
    },
    {
      name: 'fvButton',
      path: '/components/fvButton',
      component: fvButton
    },
    {
      name: 'fvInput',
      path: '/components/fvInput',
      component: fvInput
    },
    {
      name: 'fvTextarea',
      path: '/components/fvTextarea',
      component: fvTextarea
    },
    {
      name: 'fvSelect',
      path: '/components/fvSelect',
      component: fvSelect
    },
    {
      name: 'fvDatepicker',
      path: '/components/fvDatepicker',
      component: fvDatepicker
    },
    {
      name: 'fvSwitch',
      path: '/components/fvSwitch',
      component: fvSwitch
    },
    {
      name: 'fvCheck',
      path: '/components/fvCheck',
      component: fvCheck
    },
    {
      name: 'fvFilepicker',
      path: '/components/fvFilepicker',
      component: fvFilepicker
    },
    {
      name: 'fvForm',
      path: '/components/fvForm',
      component: fvForm
    },
    {
      name: 'fvTable',
      path: '/components/fvTable',
      component: fvTable
    },
    {
      name: 'fvImg',
      path: '/components/fvImg',
      component: fvImg
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
      githubRepo: 'https://github.com/framevuerk/framevuerk',
      npmRepo: 'https://www.npmjs.com/package/framevuerk'
    }
  },
  router,
  methods: {
    routeChange (path) {
      const url = `doc.html#${path}`
      global.ga('send', 'pageview', url)
    }
  },
  created () {
    this.routeChange(this.$route.path)
  },
  watch: {
    '$route.path' (path) {
      this.routeChange(path)
    }
  },
  render: h => h(main)
}).$mount('#app')

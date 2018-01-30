import './google-analytics.js.none'
import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import framevuerk from '../dist/framevuerk-en.js'
import '../dist/framevuerk-en.css'
import moment from 'moment-jalaali'
import hammer from 'hammerjs'
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/agate.css'
import 'font-awesome/css/font-awesome.css'

import './index.html.none'
import './favicon.ico'
import './CNAME.none'
import main from './pages/main'

framevuerk.use(hammer)
framevuerk.use(moment)
Vue.use(VueRouter)
Vue.use(VueHighlightJS)
Vue.use(framevuerk)

// Routes
const routes = require('./routes.js')('app')
const router = new VueRouter({
  // mode: 'history',
  routes
})

new Vue({
  data () {
    return {
      mainClass: ['fv-col-lg-10', 'fv-col-offset-lg-1', 'fv-col-xl-8', 'fv-col-offset-xl-2'],
      githubRepo: 'https://github.com/framevuerk/framevuerk',
      npmRepo: 'https://www.npmjs.com/package/framevuerk'
    }
  },
  router,
  methods: {
    log (d1, d2, d3) {
      console.log(d1, d2, d3)
    },
    routeChange (path) {
      const url = `doc.html#${path}`
      if (global.ga) {
        global.ga('send', 'pageview', url)
      }
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

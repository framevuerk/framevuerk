import Vue from 'vue/dist/vue.esm';
import Framevuerk from 'framevuerk';
import VueRouter from 'vue-router';
import VueComponentStyle from 'vue-component-style';
import VueHighlightJS from 'vue-highlightjs';
import App from './App.vue';
import routes from './routes';
import 'font-awesome/css/font-awesome.min.css';
import 'highlight.js/styles/a11y-dark.css';

Vue.config.productionTip = false;
Vue.use(VueComponentStyle);
Vue.use(Framevuerk);
Vue.use(VueRouter);
Vue.use(VueHighlightJS);
// Vue.use(Meta)

const router = new VueRouter({
  routes,
});
// console.log(framevuerk);

new Vue({
  router,
  data() {
    return {
      sidebar: false,
    };
  },
  methods: {
    routeChange(path) {
      if (window.ga) {
        window.ga('send', 'pageview', path.replace('#', ''));
      }
    },
  },
  created() {
    this.routeChange(this.$route.path);
    this.$watch('$route.path', this.routeChange);
  },
  render: (h) => h(App),
}).$mount('#app');

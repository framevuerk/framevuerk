/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
// import Vue from 'vue/dist/vue.esm';
// import Framevuerk from 'framevuerk';
// import VueRouter from 'vue-router';
// import VueComponentStyle from 'vue-component-style';
// import VueHighlightJS from 'vue-highlightjs';
// import App from './App.vue';
// import routes from './routes';
// import 'font-awesome/css/font-awesome.min.css';
// import 'highlight.js/styles/a11y-dark.css';


Promise.all([
  import(/* webpackChunkName: "vue" */ 'vue/dist/vue.esm'),
  import(/* webpackChunkName: "framevuerk" */ 'framevuerk'),
  import(/* webpackChunkName: "vuerouter" */ 'vue-router'),
  import(/* webpackChunkName: "vuecomponentstyle" */ 'vue-component-style'),
  import(/* webpackChunkName: "vuehighlightjs" */ 'vue-highlightjs'),
  import(/* webpackChunkName: "app" */ './App.vue'),
  import(/* webpackChunkName: "routes" */ './routes'),
  import(/* webpackChunkName: "fontawesomestyle" */ 'font-awesome/css/font-awesome.min.css'),
  import(/* webpackChunkName: "highlightjsstyle" */ 'highlight.js/styles/a11y-dark.css'),
]).then(([
  { default: Vue },
  { default: Framevuerk },
  { default: VueRouter },
  { default: VueComponentStyle },
  { default: VueHighlightJS },
  { default: App },
  { default: routes },
]) => {
  // eslint-disable-next-line no-param-reassign
  Vue.config.productionTip = false;
  Vue.use(VueComponentStyle);
  Vue.use(Framevuerk);
  Vue.use(VueRouter);
  Vue.use(VueHighlightJS);

  const router = new VueRouter({
    routes,
  });

  new Vue({
    router,
    data() {
      return {
        sidebar: false,
      };
    },
    created() {
      this.$watch('$route.path', {
        imidiate: true,
        handler: this.routeChange,
      });
    },
    methods: {
      routeChange(path) {
        if (window.ga) {
          window.ga('send', 'pageview', path.replace('#', ''));
        }
      },
    },
    render: (h) => h(App),
  }).$mount('#app');
});

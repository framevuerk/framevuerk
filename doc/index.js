
import Vue from 'vue';//vue/dist/vue.js';
import VueRouter from 'vue-router';
import framevuerk from '../dist/framevuerk-en.js';
import moment from 'moment-jalaali';
import 'font-awesome/css/font-awesome.css';
import 'shabnam-font/dist/font-face.css';

framevuerk.use(moment);
Vue.use(VueRouter);
Vue.use(framevuerk);

import index from './index.vue';

import fvMain from './components/fvMain.vue';


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
});
const app = new Vue({
    router,
    render: h => h(index)
}).$mount('#app');

export default app;

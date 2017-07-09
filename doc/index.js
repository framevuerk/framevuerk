
import Vue from 'vue';//vue/dist/vue.js';
import VueRouter from 'vue-router';
import framevuerk from '../dist/framevuerk-en.js';
import moment from 'moment-jalaali';
import 'font-awesome/css/font-awesome.css';
import 'shabnam-font/dist/font-face.css';
import './index.html';

framevuerk.use(moment);
Vue.use(VueRouter);
Vue.use(framevuerk);

import main from './main.vue';

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
global.app = new Vue({
    data(){
        return {
            components: {

            }
        }
    },
    computed: {

    },
    router,
    render: h => h(main)
}).$mount('#app');

export default app;

import Home from './pages/Home.vue';
import GetStarted from './pages/GetStarted.vue';
import Component from './pages/Component.vue';

export default [
  { path: '/', component: Home },
  { path: '/get-started', component: GetStarted },
  { path: '/components/:component', component: Component },
];

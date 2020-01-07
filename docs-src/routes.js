import Home from './pages/Home.vue';
import Component from './pages/Component.vue';

export default [
  { path: '/', component: Home },
  { path: '/components/:component', component: Component },
];

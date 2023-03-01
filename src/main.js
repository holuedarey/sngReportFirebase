import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import VueRouter from 'vue-router';
import Users from './Users.vue';
import Attendance from './Attendance.vue';

import { firestorePlugin } from 'vuefire'

// import NotFound from './NotFound.vue'

Vue.use(VueRouter);

const routes = [
  {path: '/users', component : Users},
  {path: '/', component : Attendance}
];
const router = new VueRouter({routes});
Vue.use(firestorePlugin);

Vue.config.productionTip = false

new Vue({
  el:'#app',
  render: h => h(App),
  router,
})

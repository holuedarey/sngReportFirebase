import Vue from 'vue';
import App from './App.vue';
import './plugins/element.js';
import VueRouter from 'vue-router';
import Users from './Users.vue';
import Attendance from './Attendance.vue';
import Location from './Location.vue';
import axios from 'axios';


// import NotFound from './NotFound.vue'

Vue.use(VueRouter);

const routes = [
  {path: '/users', component : Users},
  {path: '/', component : Attendance},
  {path: '/location', component : Location}

];
const router = new VueRouter({routes});

// axios.defaults.withCredentials = true
axios.defaults.baseURL = 'https://sngapp.herokuapp.com/api/v1/';
Vue.config.productionTip = false
new Vue({
  el:'#app',
  render: h => h(App),
  router,
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const Index = resolve => require(['./pages/index'], resolve);

export default new Router({
  routes: [
    {path:'/', component: Index }
  ]
})
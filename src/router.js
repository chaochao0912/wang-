import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/user/Users.vue'
import Roles from './components/rights/Roles.vue'
import Rights from './components/rights/Rights.vue'
import Categories from './components/products/Categories.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '/users', name: 'users', component: Users },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/categories', name: 'categories', component: Categories }

      ]
    }

  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  console.log(token)
  // console.log(to)
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})

export default router

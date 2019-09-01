import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false
// 只要vue相关 基于vue的插件 才可以Vue.use
Vue.use(ElementUI)

// 将axios方法 挂载到vue原型上，所有vue实例都可以直接使用
Vue.prototype.$axios = axios

// 配置axios 默认请求的基础地址，将来所有的请求，都会在前面拼上这个地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器, 每次只要请求了, 都会被拦截到
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 每次真正请求出去之前, 都带上 token, 拼到请求头中
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 只要是响应的 meta.status ===401 说明token失效了(伪造了，过期的)
  // 清除无效的token 拦截到登录去
  if (response.meta.status === 401) {
    localStorage.removeItem('token')
    response.meta.msg = '登录状态已失效，请重新登录'
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

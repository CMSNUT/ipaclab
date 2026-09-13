import { defineClientConfig } from 'vuepress/client'

// import Layout from './layouts/Layout.vue'
// import SafetyAlert from './components/SafetyAlert.vue'



export default defineClientConfig({
  // 1. 覆盖布局，使用主题插槽
  // layouts: {
  //   Layout,
  // },

  // 2. 增强 Vue 应用
  enhance({ app, router, siteData }) {
    // app: Vue 应用实例
    // router: Vue Router 实例
    // siteData: 站点数据

    // 注册全局组件
    // app.component('MyComponent', MyComponent)

    // 注册全局组件
    // app.component('SafetyAlert', SafetyAlert)

    // // 路由守卫（可选）
    // router.beforeEach((to, from, next) => {
    //   next()
    // })
    
  },

  // 3. 注册全局组件
  setup() {
    // Vue 根组件的 setup 方法
  }
})
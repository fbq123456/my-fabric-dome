import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
const app = createApp(App)
import Layout from './components/Layout.vue'
import ConsolePage from './components/ConsolePage.vue'
const routes = [
  { path: '/', component: Layout },
  { path: '/about', component: ConsolePage },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
app.use(router)
app.mount('#app')

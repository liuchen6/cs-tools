import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ToolPage from '../tools/ToolPage.vue'
import { tools } from '../data/tools-registry.js'

const toolRoutes = tools.map(t => ({
  path: t.path,
  name: t.title,
  component: ToolPage,
  meta: { title: t.title },
}))

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'CS Breakout Tools' } },
  ...toolRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | CS Breakout Tools` : 'CS Breakout Tools'
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
// import About from '../views/About.vue'
import HelloWorld from '../components/HelloWorld.vue'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
//   { path: '/about', name: 'About', component: About },
  { path: '/:pathWacht(.*)*', name: 'not-found', component: HelloWorld }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

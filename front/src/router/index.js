import Vue from 'vue'
import VueRouter from 'vue-router'
import Encounter from '../views/Encounter.vue'
import Ranking from '../views/Ranking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Encounter',
    meta: { horizontalScroll: false },
    component: Encounter
  },
  {
    path: '/ranking',
    name: 'Ranking',
    meta: { horizontalScroll: true },
    component: Ranking
  }
]

const router = new VueRouter({
  routes
})

export default router

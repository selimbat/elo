import Vue from 'vue'
import VueRouter from 'vue-router'
import Encounter from '../views/Encounter.vue'
import Ranking from '../views/Ranking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Encounter',
    component: Encounter
  },
  {
    path: '/ranking',
    name: 'Ranking',
    component: Ranking
  }
]

const router = new VueRouter({
  routes
})

export default router

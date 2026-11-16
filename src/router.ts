import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import StudioView from './views/StudioView.vue'
import DemoMenuView from './views/DemoMenuView.vue'
import EformelMenuView from './views/EformelMenuView.vue'
import FeederMenuView from './views/FeederMenuView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/eformel', name: 'eformel', component: EformelMenuView },
    { path: '/demo', name: 'demo', component: DemoMenuView },
    { path: '/feeder', name: 'feeder', component: FeederMenuView },
    { path: '/studio', name: 'studio', component: StudioView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import StudioView from './views/StudioView.vue'
import DemoMenuView from './views/DemoMenuView.vue'
import EformelMenuView from './views/EformelMenuView.vue'
import FeederMenuView from './views/FeederMenuView.vue'

const DISABLED_TYPES = ['eformel_drivers', 'eformel_teams', 'eformel_quali', 'eformel_schedule']

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/eformel', name: 'eformel', component: EformelMenuView },
    { path: '/demo', name: 'demo', component: DemoMenuView },
    { path: '/feeder', name: 'feeder', component: FeederMenuView },
    {
      path: '/studio',
      name: 'studio',
      component: StudioView,
      // Graphic types that are switched off for now; old links/bookmarks land on Ergebnisse instead of an empty page.
      beforeEnter: (to) => {
        if (DISABLED_TYPES.includes(String(to.query.type))) return { path: '/studio', query: { type: 'eformel_results' } }
      },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

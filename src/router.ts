import { createRouter, createWebHistory } from 'vue-router'
import Landing from './components/Landing.vue'
import Studio from './components/Studio.vue'
import Demo from './components/demo/demo.vue'
import eformel from './components/eformel/eformel.vue'
import Feeder from './components/feeder/feeder.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: Landing },
    { path: '/eformel', name: 'eformel', component: eformel },
    { path: '/demo', name: 'demo', component: Demo },
    { path: '/feeder', name: 'feeder', component: Feeder },
    { path: '/studio', name: 'studio', component: Studio },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const manualRoutes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../pages/index.vue'),
  }, {
    path: '/multiplayer/',
    name: 'Multiplayer',
    component: () => import('../pages/multiplayer.vue'),
  }, {
    path: '/create-room/',
    name: 'CreateRoom',
    component: () => import('../pages/createRoom.vue'),
  }, {
    path: '/lobby/:roomId/',
    name: 'Lobby',
    component: () => import('../pages/lobby.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...manualRoutes,
  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router

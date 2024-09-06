/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../pages/index.vue'),
    }, {
      path: '/oneplayer',
      name: 'oneplayer',
      component: () => import('../pages/oneplayer.vue'),
      children: [
        {
          name: 'OneplayerGame',
          path: 'game',
          component: () => import('../pages/game.vue'),
          props: {
            isOneplayerMode: true
          }
        }
      ]
    }, {
      path: '/multiplayer/',
      name: 'multiplayer',
      component: () => import('../pages/multiplayer.vue'),
      children: [
        {
          name: 'MultiplayerGame',
          path: 'game/:roomName',
          component: import('../pages/game.vue'),
          props: {
            isMultiplayerMode: true
          }
        }
      ]
    }, {
      path: '/create-room',
      name: 'CreateRoom',
      component: () => import('../pages/createRoom.vue'),
    }, {
      path: '/join-room/:roomId?',
      name: 'JoinRoom',
      component: () => import('../pages/joinRoom.vue'),
    }, {
      path: '/lobby/:roomId',
      name: 'Lobby',
      component: () => import('../pages/lobby.vue'),
    }
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

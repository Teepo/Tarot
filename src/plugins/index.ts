/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
}

// Add the 'toArray' method to the Map interface
declare global {
  interface Map<K, V> {
    toArray(): V[];
  }
}

Map.prototype.toArray = function() {
  return Array.from(this.values());
};
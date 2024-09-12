import App from './App.vue'

import { createApp } from 'vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import colors from 'vuetify/lib/util/colors';

import router from './router'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            light: {
                colors: {
                    primary: '#1867C0',
                    secondary: '#5CBBF6',
                    'red-lighten-1' : colors.red.lighten1,
                    'green-lighten-1' : colors.green.lighten1
                },
            },
            dark: {
                colors: {
                    'red-lighten-1' : colors.red.lighten1,
                    'green-lighten-1' : colors.green.lighten1
                }
            }
        },
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi }
    },
    ssr: true,
});

const app = createApp(App)

app
.use(router)
.use(vuetify)
.mount('#app')

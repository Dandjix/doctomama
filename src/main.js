// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import store from './store'
import i18n from './i18n'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(store)
  .use(i18n)
  .mount('#app')

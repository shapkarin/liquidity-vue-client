import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vueLib from '@starport/vue'
import i18n from './i18n'

const app = createApp(App)
app.config.globalProperties._depsLoaded = true
// app.use(store).use(router).use(vueLib).use(i18n).mount('#app')
app.use(store).use(router).use(vueLib).mount('#app')

import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import router from './routes/index.js'
import Indo from './locales/indo.json'
import lnggris from './locales/inggris.json'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    legacy: false,
    messages: { indo: Indo, lnggris: lnggris},
    })


createApp(App).use(router).mount('#app').use(i18n)

import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. นำเข้า createPinia
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // 2. ลงทะเบียน Pinia ใช้งานในโปรเจกต์
app.use(router)

app.mount('#app')

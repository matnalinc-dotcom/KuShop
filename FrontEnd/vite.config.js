import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true, // อนุญาตให้เชื่อมต่อจากภายนอก/เครือข่าย
    port: 5173,
    allowedHosts: true, // 💡 อนุญาตให้เปิดผ่านโดเมนภายนอกอย่าง Cloudflare Tunnel ได้
    proxy: {
      // ส่งต่อ Request ไปยัง Backend พอร์ต 3000 อัตโนมัติ
      '/products': 'http://localhost:3000',
      '/members': 'http://localhost:3000',
      '/carts': 'http://localhost:3000',
      '/img_pd': 'http://localhost:3000',
      '/img_mem': 'http://localhost:3000',
      '/api-docs': 'http://localhost:3000'
    }
  }
})

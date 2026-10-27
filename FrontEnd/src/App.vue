<template>
  <!-- ส่วนของแถบเมนูด้านบน (ใช้งาน Bootstrap Navbar) -->
  <MainMenu></MainMenu>

  <!-- ส่วนแสดงผล Component ของแต่ละเส้นทาง Route -->
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue'
import MainMenu from './components/MainMenu.vue'
import { useMemStore } from '@/stores/memStore'

const memStore = useMemStore()

// สั่งเช็ก Cookie JWT กับ Backend ทันทีเมื่อเปิดหน้าเว็บ/รีเฟรช
onMounted(() => {
  memStore.checkAuth()
})
</script>

<style>
</style>
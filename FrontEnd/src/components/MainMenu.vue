<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">KuShop</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/product">Product</router-link>
          </li>
        </ul>

        <!-- แสดงเมื่อยังไม่ได้ Login -->
        <ul class="navbar-nav mb-2 mb-lg-0" v-if="!login">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>

        <!-- แสดงเมื่อ Login สำเร็จแล้ว -->
        <ul class="navbar-nav mb-2 mb-lg-0 align-items-center" v-else>
          <!-- 1. ปุ่มสรุปยอดตระกร้าสินค้า (CartInfo) -->
          <li class="nav-item pe-2">
            <CartInfo />
          </li>

          <!-- 2. ปุ่มลิงก์ไปหน้าประวัติตะกร้าสินค้า (CartList) -->
          <li class="nav-item pe-3">
            <router-link class="nav-link fw-bold" to="/cartlist">
              <i class="bi bi-cart-fill"></i> Cart
            </router-link>
          </li>

          <li class="nav-item">
            <span class="nav-link text-info">
              👤 {{ memName }} ({{ dutyId }})
            </span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light btn-sm ms-2" @click="handleLogout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import { useMemStore } from "@/stores/memStore"
import CartInfo from "./CartInfo.vue" // 👈 Import CartInfo เข้ามาใช้งาน

// กำหนดส่ง Cookie อัตโนมัติทุกครั้งที่เรียก axios
axios.defaults.withCredentials = true

const router = useRouter()
const memStore = useMemStore()

const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)
const login = ref(false)

// ฟังก์ชันดึงข้อมูลจาก Backend ตามโจทย์
const getMember = async () => {
  await axios
    .get("http://localhost:3000/members/detail")
    .then((res) => {
      member.value = res.data
      memEmail.value = member.value.memEmail
      memName.value = member.value.memName
      dutyId.value = member.value.dutyId
      login.value = member.value.login
    })
    .catch((err) => console.log(err.message))
}

// watch ดักจับการเปลี่ยนแปลงสถานะ Login ใน Store เพื่อดึงข้อมูลใหม่ทันที
watch(
  () => memStore.isLogin,
  () => {
    console.log("Watch Triggered")
    getMember()
  }
)

onMounted(async () => {
  await getMember()
})

const handleLogout = async () => {
  await memStore.logout()
  alert("ออกจากระบบเรียบร้อยแล้ว")
  router.push("/login")
}
</script>
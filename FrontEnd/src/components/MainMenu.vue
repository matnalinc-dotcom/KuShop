<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold text-success" to="/">
        <i class="bi bi-shop"></i> KuShop
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/product">
              <i class="bi bi-box-seam"></i> สินค้า (Products)
            </router-link>
          </li>

          <!-- 💡 ลิงก์เฉพาะ Admin -->
          <li class="nav-item" v-if="dutyId === 'admin'">
            <router-link class="nav-link text-warning fw-bold" to="/admin/members">
              <i class="bi bi-people-fill"></i> จัดการสมาชิก (Admin)
            </router-link>
          </li>

          <!-- API Document Online -->
          <li class="nav-item">
            <a class="nav-link text-info" href="/api-docs" target="_blank">
              <i class="bi bi-file-earmark-code"></i> API Docs
            </a>
          </li>
        </ul>

        <!-- แสดงเมื่อยังไม่ได้ Login -->
        <ul class="navbar-nav mb-2 mb-lg-0" v-if="!login">
          <li class="nav-item">
            <router-link class="nav-link" to="/login">
              <i class="bi bi-box-arrow-in-right"></i> เข้าสู่ระบบ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register">
              <i class="bi bi-person-plus"></i> สมัครสมาชิก
            </router-link>
          </li>
        </ul>

        <!-- แสดงเมื่อ Login สำเร็จแล้ว -->
        <ul class="navbar-nav mb-2 mb-lg-0 align-items-center" v-else>
          <!-- 1. ปุ่มสรุปยอดตระกร้าสินค้า (CartInfo) -->
          <li class="nav-item pe-2">
            <CartInfo />
          </li>

          <!-- 2. ปุ่มลิงก์ไปหน้าประวัติตะกร้าสินค้า (CartList) -->
          <li class="nav-item pe-2">
            <router-link class="nav-link fw-bold" to="/cartlist">
              <i class="bi bi-clock-history"></i> ประวัติสั่งซื้อ
            </router-link>
          </li>

          <!-- 3. ลิงก์โปรไฟล์ส่วนตัว -->
          <li class="nav-item pe-2">
            <router-link class="nav-link" to="/pagemember">
              <span
                class="badge"
                :class="dutyId === 'admin' ? 'bg-danger' : 'bg-success'"
              >
                {{ dutyId === 'admin' ? 'ADMIN' : 'MEMBER' }}
              </span>
              <span class="ms-1 text-white">👤 {{ memName }}</span>
            </router-link>
          </li>

          <li class="nav-item">
            <button class="btn btn-outline-danger btn-sm ms-2" @click="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Logout
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
import CartInfo from "./CartInfo.vue"

axios.defaults.withCredentials = true

const router = useRouter()
const memStore = useMemStore()

const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)
const login = ref(false)

const getMember = async () => {
  try {
    const res = await axios.get("/members/detail")
    member.value = res.data
    memEmail.value = member.value.memEmail
    memName.value = member.value.memName
    dutyId.value = member.value.dutyId
    login.value = member.value.login
  } catch (err) {
    console.log(err.message)
  }
}

watch(
  () => memStore.isLogin,
  () => {
    getMember()
  }
)

watch(
  () => memStore.dutyId,
  () => {
    getMember()
  }
)

onMounted(async () => {
  await getMember()
})

const handleLogout = async () => {
  await memStore.logout()
  login.value = false
  memEmail.value = null
  memName.value = null
  dutyId.value = null
  alert("ออกจากระบบเรียบร้อยแล้ว")
  router.push("/login")
}
</script>

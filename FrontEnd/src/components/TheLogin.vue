<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5 col-sm-12">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">เข้าสู่ระบบ (Login)</h3>

            <form @submit.prevent="handleLogin">
              <!-- Username / Email -->
              <div class="mb-3">
                <label for="username" class="form-label">Email / Username</label>
                <input
                  type="text"
                  id="username"
                  v-model="username"
                  class="form-control"
                  placeholder="เช่น admin@ku.th หรือ test001@gmail.com"
                  required
                />
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  v-model="password"
                  class="form-control"
                  placeholder="กรอกรหัสผ่าน"
                  required
                />
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2 mt-4">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  {{ loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
                </button>
              </div>
            </form>

            <!-- Message Alert -->
            <p
              v-if="message"
              class="text-center mt-3 fw-bold text-danger"
            >
              {{ message }}
            </p>

            <!-- Register Link -->
            <div class="text-center mt-3 border-top pt-3">
              <span class="text-muted">ยังไม่มีบัญชีผู้ใช้? </span>
              <router-link to="/register" class="text-decoration-none fw-bold">
                สมัครสมาชิกที่นี่
              </router-link>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useMemStore } from "@/stores/memStore"
import axios from "axios"

axios.defaults.withCredentials = true

const memStore = useMemStore()
const router = useRouter()

const username = ref("")
const password = ref("")
const login = ref(null)
const message = ref("")
const loading = ref(false)

const getMember = async () => {
  await axios.get("/members/detail")
    .then((res) => {
      login.value = res.data.login
    })
    .catch(err => console.log(err.message))
}

onMounted(async () => {
  await getMember()
  if (login.value) {
    router.push("/pagemember")
  }
})

const handleLogin = async () => {
  loading.value = true
  message.value = ""

  try {
    const res = await memStore.login(username.value, password.value)

    if (res.success) {
      router.push("/pagemember")
    } else {
      message.value = res.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
    }
  } catch (err) {
    console.error(err)
    message.value = "เกิดข้อผิดพลาดในการเชื่อมต่อ Server"
  } finally {
    loading.value = false
  }
}
</script>

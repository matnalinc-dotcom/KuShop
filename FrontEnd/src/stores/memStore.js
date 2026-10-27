import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = ''

export const useMemStore = defineStore('mem', {
  state: () => ({
    memEmail: '',
    memName: '',
    dutyId: '',
    isLogin: false
  }),

  getters: {
    isAdmin: (state) => state.dutyId === 'admin'
  },

  actions: {
    // 1. เข้าสู่ระบบ (Login)
    async login(loginName, password) {
      try {
        const res = await axios.post(
          `${API_URL}/members/login`,
          { loginName, password },
          { withCredentials: true }
        )

        if (res.data.login) {
          await this.checkAuth()
          return { success: true, dutyId: this.dutyId }
        }
        return { success: false, message: res.data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
      } catch (err) {
        console.error('Login error:', err)
        return { success: false, message: 'เกิดข้อผิดพลาดในการเชื่อมต่อ Server' }
      }
    },

    // 2. ตรวจสอบสถานะการล็อกอินและดึงข้อมูลสมาชิก (Detail)
    async checkAuth() {
      try {
        const res = await axios.get(`${API_URL}/members/detail`, {
          withCredentials: true
        })

        if (res.data.login) {
          this.memEmail = res.data.memEmail
          this.memName = res.data.memName
          this.dutyId = res.data.dutyId || 'member'
          this.isLogin = true
        } else {
          this.clearUser()
        }
      } catch (err) {
        this.clearUser()
      }
    },

    // 3. แก้ไขข้อมูลส่วนตัว (Update Profile)
    async updateProfile(memName, password) {
      try {
        const res = await axios.put(
          `${API_URL}/members/update`,
          { memEmail: this.memEmail, memName, password },
          { withCredentials: true }
        )
        if (res.data.success) {
          this.memName = memName
          return { success: true, message: res.data.message }
        }
        return { success: false, message: res.data.message }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },

    // 4. ออกจากระบบ (Logout)
    async logout() {
      try {
        await axios.get(`${API_URL}/members/logout`, {
          withCredentials: true
        })
      } catch (err) {
        console.error('Logout error:', err)
      } finally {
        this.clearUser()
      }
    },

    // ล้างข้อมูลสมาชิกใน Store
    clearUser() {
      this.memEmail = ''
      this.memName = ''
      this.dutyId = ''
      this.isLogin = false
    }
  }
})

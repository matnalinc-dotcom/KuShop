import { defineStore } from 'pinia'
import axios from 'axios'

// URL ของ Backend Lab 10
const API_URL = 'http://localhost:3000'

export const useMemStore = defineStore('mem', {
  state: () => ({
    memEmail: '',
    memName: '',
    dutyId: '',
    isLogin: false
  }),

  actions: {
    // 1. เข้าสู่ระบบ (Login)
    async login(loginName, password) {
      try {
        const res = await axios.post(
          `${API_URL}/members/login`,
          { loginName, password },
          { withCredentials: true } // 👈 สำคัญ! ให้ Browser รับ Cookie HTTP-only จาก Backend
        )

        if (res.data.login) {
          await this.checkAuth() // Login สำเร็จ ดึงข้อมูลสมาชิกทันที
          return true
        }
        return false
      } catch (err) {
        console.error('Login error:', err)
        return false
      }
    },

    // 2. ตรวจสอบสถานะการล็อกอินและดึงข้อมูลสมาชิก (Detail)
    async checkAuth() {
      try {
        const res = await axios.get(`${API_URL}/members/detail`, {
          withCredentials: true // 👈 สำคัญ! แนบ Cookie token ไปเช็กกับ Backend
        })

        if (res.data.login) {
          this.memEmail = res.data.memEmail
          this.memName = res.data.memName
          this.dutyId = res.data.dutyId
          this.isLogin = true
        } else {
          this.clearUser()
        }
      } catch (err) {
        this.clearUser()
      }
    },

    // 3. ออกจากระบบ (Logout)
    async logout() {
      try {
        await axios.get(`${API_URL}/members/logout`, {
          withCredentials: true // 👈 สั่งให้ Backend ลบ Cookie
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
<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4 text-center fw-bold text-primary">สมัครสมาชิก (Register)</h2>
    
    <form @submit.prevent="handleRegister" class="card p-4 shadow-sm border-0">
      <div class="mb-3">
        <label class="form-label fw-bold">Email (ใช้เป็น Login Name)</label>
        <input type="email" v-model="memEmail" class="form-control" required placeholder="example@gmail.com" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">ชื่อ - นามสกุล</label>
        <input type="text" v-model="memName" class="form-control" required placeholder="นายสมชาย ใจดี" />
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">รหัสผ่าน</label>
        <input type="password" v-model="password" class="form-control" required placeholder="••••••••" />
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2 fw-bold" :disabled="loading">
        {{ loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน' }}
      </button>

      <!-- มีบัญชีอยู่แล้ว -->
      <div class="text-center mt-3 border-top pt-3">
        <span class="text-muted">มีบัญชีผู้ใช้อยู่แล้ว? </span>
        <router-link to="/login" class="text-decoration-none fw-bold">
          เข้าสู่ระบบที่นี่
        </router-link>
      </div>
    </form>

    <!-- กล่องแจ้งเตือนผลลัพธ์ -->
    <div v-if="message" class="alert mt-3 text-center" :class="regist ? 'alert-success' : 'alert-danger'">
      {{ message }}
      <div v-if="regist" class="mt-2">
        <router-link to="/login" class="btn btn-success btn-sm">
          ไปที่หน้าเข้าสู่ระบบทันที
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TheRegister',
  data() {
    return {
      memEmail: '',
      memName: '',
      password: '',
      message: '',
      regist: false,
      loading: false
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.message = '';
      try {
        const response = await axios.post('/members', {
          memEmail: this.memEmail,
          memName: this.memName,
          password: this.password
        });

        this.message = response.data.message;
        this.regist = response.data.regist;

        if (this.regist) {
          this.memEmail = '';
          this.memName = '';
          this.password = '';
        }
      } catch (err) {
        this.message = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ Server';
        this.regist = false;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <div class="container mt-5" style="max-width: 500px;">
    <h2 class="mb-4 text-center">สมัครสมาชิก</h2>
    
    <form @submit.prevent="handleRegister" class="card p-4 shadow-sm">
      <div class="mb-3">
        <label class="form-label">Email (ใช้เป็น Login Name)</label>
        <input type="email" v-model="memEmail" class="form-control" required placeholder="example@gmail.com" />
      </div>

      <div class="mb-3">
        <label class="form-label">ชื่อ - นามสกุล</label>
        <input type="text" v-model="memName" class="form-control" required placeholder="นายสมชาย ใจดี" />
      </div>

      <div class="mb-3">
        <label class="form-label">รหัสผ่าน</label>
        <input type="password" v-model="password" class="form-control" required placeholder="••••••••" />
      </div>

      <button type="submit" class="btn btn-primary w-100">ลงทะเบียน</button>
    </form>

    <!-- กล่องแจ้งเตือนผลลัพธ์ -->
    <div v-if="message" class="alert mt-3" :class="regist ? 'alert-success' : 'alert-danger'">
      {{ message }}
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
      regist: false
    };
  },
  methods: {
    async handleRegister() {
      try {
        const response = await axios.post('http://localhost:3000/members', {
          memEmail: this.memEmail,
          memName: this.memName,
          password: this.password
        });

        this.message = response.data.message;
        this.regist = response.data.regist;

        if (this.regist) {
          // เคลียร์ฟอร์มเมื่อสมัครสำเร็จ
          this.memEmail = '';
          this.memName = '';
          this.password = '';
        }
      } catch (err) {
        this.message = 'เกิดข้อผิดพลาดในการเชื่อมต่อ Server';
        this.regist = false;
      }
    }
  }
};
</script>
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-danger fw-bold mb-0">
        <i class="bi bi-people-fill"></i> จัดการสมาชิก (Member Management)
      </h2>
      <button class="btn btn-primary shadow-sm" @click="showAddModal = true">
        <i class="bi bi-person-plus-fill"></i> + เพิ่ม Admin / สมาชิกใหม่
      </button>
    </div>

    <!-- Alert / Search -->
    <div class="row mb-3">
      <div class="col-md-4">
        <input
          type="text"
          class="form-control"
          v-model="searchTerm"
          placeholder="ค้นหาตาม Email หรือ ชื่อ..."
        />
      </div>
    </div>

    <!-- Table of Members -->
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>รูปโปรไฟล์</th>
              <th>Email</th>
              <th>ชื่อ - นามสกุล</th>
              <th class="text-center">สถานะ (Duty)</th>
              <th class="text-center">เปลี่ยนสถานะ</th>
              <th class="text-center">ประวัติการซื้อ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(mem, idx) in filteredMembers" :key="mem.memEmail">
              <td>{{ idx + 1 }}</td>
              <td>
                <img
                  :src="`/img_mem/${mem.memEmail}.jpg`"
                  alt="Avatar"
                  class="rounded-circle border"
                  style="width: 40px; height: 40px; object-fit: cover;"
                  @error="handleAvatarError"
                />
              </td>
              <td class="fw-bold">
                {{ mem.memEmail }}
                <span v-if="mem.memEmail.toLowerCase() === currentMemEmail.toLowerCase()" class="badge bg-info text-dark ms-1">
                  (คุณ)
                </span>
              </td>
              <td>{{ mem.memName }}</td>
              <td class="text-center">
                <span
                  class="badge fs-6 px-3 py-2"
                  :class="mem.dutyid === 'admin' ? 'bg-danger' : 'bg-success'"
                >
                  {{ mem.dutyid === 'admin' ? 'ADMIN' : 'MEMBER' }}
                </span>
              </td>
              <td class="text-center">
                <button
                  v-if="mem.dutyid !== 'admin'"
                  class="btn btn-sm btn-outline-danger"
                  @click="changeDuty(mem.memEmail, 'admin')"
                  title="ตั้งให้เป็น Admin"
                >
                  <i class="bi bi-shield-lock-fill"></i> เลื่อนเป็น Admin
                </button>
                <button
                  v-else
                  class="btn btn-sm btn-outline-secondary"
                  @click="changeDuty(mem.memEmail, 'member')"
                  title="ปลดสิทธิ์เหลือ Member ธรรมดา"
                  :disabled="mem.memEmail.toLowerCase() === currentMemEmail.toLowerCase()"
                >
                  <i class="bi bi-person"></i> เปลี่ยนเป็น Member
                </button>
              </td>
              <td class="text-center">
                <router-link
                  :to="`/cartlist?cusId=${mem.memEmail}`"
                  class="btn btn-sm btn-info text-white"
                >
                  <i class="bi bi-bag-check-fill"></i> ดูประวัติการซื้อ
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredMembers.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                ไม่พบข้อมูลสมาชิก
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 💡 Modal เพิ่มผู้ใช้ / Admin ใหม่ -->
    <div v-if="showAddModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-person-plus-fill"></i> เพิ่มผู้ใช้ / Admin ใหม่</h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <form @submit.prevent="submitAddUser">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">Email:</label>
                <input type="email" class="form-control" v-model="addForm.memEmail" required placeholder="user@ku.th" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ชื่อ - นามสกุล:</label>
                <input type="text" class="form-control" v-model="addForm.memName" required placeholder="นายรักดี ยิ้มแย้ม" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">รหัสผ่าน:</label>
                <input type="password" class="form-control" v-model="addForm.password" required placeholder="••••••••" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">สิทธิ์ (Duty):</label>
                <select class="form-select" v-model="addForm.dutyId">
                  <option value="member">Member (สมาชิกทั่วไป)</option>
                  <option value="admin">Admin (ผู้ดูแลระบบ)</option>
                </select>
              </div>

              <div v-if="addMessage" class="alert alert-info py-2">
                {{ addMessage }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddModal = false">ยกเลิก</button>
              <button type="submit" class="btn btn-primary" :disabled="adding">
                {{ adding ? 'กำลังสร้าง...' : 'สร้างบัญชี' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true;

const members = ref([]);
const currentMemEmail = ref('');
const searchTerm = ref('');
const showAddModal = ref(false);
const adding = ref(false);
const addMessage = ref('');
const addForm = ref({
  memEmail: '',
  memName: '',
  password: '',
  dutyId: 'member'
});

const loadMembers = async () => {
  try {
    const res = await axios.get("/members/all");
    members.value = res.data;
  } catch (err) {
    console.error("Failed to load members:", err);
  }
};

const checkCurrentAdmin = async () => {
  try {
    const res = await axios.get("/members/detail");
    currentMemEmail.value = res.data.memEmail || '';
  } catch (_) {}
};

const filteredMembers = computed(() => {
  if (!searchTerm.value.trim()) return members.value;
  const kw = searchTerm.value.toLowerCase();
  return members.value.filter(
    m => m.memEmail?.toLowerCase().includes(kw) || m.memName?.toLowerCase().includes(kw)
  );
});

const handleAvatarError = (e) => {
  e.target.src = "/img_mem/default.jpg";
};

const changeDuty = async (email, newDuty) => {
  if (newDuty !== 'admin' && email.toLowerCase() === currentMemEmail.value.toLowerCase()) {
    alert("คุณกำลังใช้งานบัญชีนี้อยู่ ไม่สามารถปลดสิทธิ์ตัวเองได้ เพื่อป้องกันการถูกล็อกออกจากระบบ!");
    return;
  }

  const confirmText = newDuty === 'admin'
    ? `ยืนยันแต่งตั้ง ${email} เป็น Admin?`
    : `ยืนยันเปลี่ยนสถานะ ${email} เป็น Member ธรรมดา?`;

  if (confirm(confirmText)) {
    try {
      await axios.put("/members/duty", {
        memEmail: email,
        dutyId: newDuty
      });
      await loadMembers();
      alert(`เปลี่ยนสถานะของ ${email} เป็น ${newDuty} สำเร็จแล้ว`);
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  }
};

const submitAddUser = async () => {
  adding.value = true;
  addMessage.value = 'กำลังบันทึกข้อมูล...';
  try {
    const res = await axios.post("/members", addForm.value);
    if (res.data.regist) {
      alert("เพิ่มผู้ใช้สำเร็จแล้ว");
      showAddModal.value = false;
      addForm.value = { memEmail: '', memName: '', password: '', dutyId: 'member' };
      await loadMembers();
    } else {
      addMessage.value = res.data.message || 'ไม่สามารถสร้างผู้ใช้ได้';
    }
  } catch (err) {
    addMessage.value = 'เกิดข้อผิดพลาด: ' + (err.response?.data?.message || err.message);
  } finally {
    adding.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadMembers(), checkCurrentAdmin()]);
});
</script>

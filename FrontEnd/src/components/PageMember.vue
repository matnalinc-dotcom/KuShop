<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Member Profile</h1>
        <span
          class="badge fs-6"
          :class="dutyId === 'admin' ? 'bg-danger' : 'bg-success'"
        >
          {{ dutyId === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'สมาชิก (Member)' }}
        </span>
      </div>

      <div class="row">
        <!-- ข้อมูลสมาชิก -->
        <div class="col-md-7 col-sm-12">
          <p><strong>Email:</strong> {{ memEmail }}</p>
          <p><strong>Name:</strong> {{ memName }}</p>
          <p><strong>Duty ID:</strong> {{ dutyId }}</p>

          <!-- 💡 ฟอร์มแก้ไขข้อมูลส่วนตัว (Member Edit Profile) -->
          <div class="card bg-light p-3 mt-4 border">
            <h5 class="card-title text-primary"><i class="bi bi-pencil-square"></i> แก้ไขข้อมูลส่วนตัว</h5>
            <form @submit.prevent="saveProfile">
              <div class="mb-3">
                <label class="form-label fw-bold">ชื่อ - นามสกุล:</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="editName"
                  required
                />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">เปลี่ยนรหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน):</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="editPassword"
                  placeholder="กรอกรหัสผ่านใหม่ถ้าต้องการเปลี่ยน"
                />
              </div>
              <button type="submit" class="btn btn-success" :disabled="saving">
                <i class="bi bi-check-circle"></i> {{ saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}
              </button>

              <div v-if="saveMessage" class="alert mt-3" :class="saveSuccess ? 'alert-success' : 'alert-danger'">
                {{ saveMessage }}
              </div>
            </form>
          </div>
        </div>

        <!-- 💡 ส่วนแสดงรูปภาพสมาชิก -->
        <div class="col-md-5 col-sm-12 d-flex flex-column justify-content-center align-items-center mt-3 mt-md-0">
          <div class="card shadow-sm text-center p-2" style="width: 14rem">
            <img
              v-if="imgOK"
              :src="`/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`"
              :alt="memEmail"
              class="card-img-top img-thumbnail rounded"
            />
            <img
              v-else
              :src="'/img_mem/default.jpg'"
              :alt="memEmail"
              class="card-img-top img-thumbnail rounded"
            />
            <small class="text-muted mt-2">รูปโปรไฟล์</small>
          </div>
        </div>
      </div>

      <hr class="my-4" />

      <!-- 💡 ฟอร์มสำหรับเลือกและอัปโหลดรูปภาพ -->
      <form @submit.prevent="uploadFile()">
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="formFile" class="col-form-label fw-bold">เปลี่ยนรูปโปรไฟล์:</label>
          </div>
          <div class="col-auto">
            <input class="form-control" type="file" id="formFile" @change="onFileChange" accept="image/*" required />
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" type="submit">Upload</button>
          </div>
        </div>

        <!-- แสดงข้อความสถานะการอัปโหลด -->
        <div class="row mt-3" v-if="fileMessage">
          <div class="col-md-6 col-sm-12">
            <div class="alert" :class="fileMessage.includes('สำเร็จ') ? 'alert-success' : 'alert-danger'" role="alert">
              {{ fileMessage }}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useMemStore } from '@/stores/memStore'

axios.defaults.withCredentials = true

const memStore = useMemStore()

const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)

const editName = ref('')
const editPassword = ref('')
const saving = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)

const imgOK = ref(false)
const fileMessage = ref(null)
const file = ref(null)
const imageTimestamp = ref(Date.now())

const getMember = async () => {
  try {
    const res = await axios.get('/members/detail')
    member.value = res.data
    memEmail.value = member.value.memEmail
    memName.value = member.value.memName
    dutyId.value = member.value.dutyId || 'member'
    editName.value = memName.value
  } catch (err) {
    console.log(err.message)
  }
}

const saveProfile = async () => {
  saving.value = true
  saveMessage.value = ''
  try {
    const res = await memStore.updateProfile(editName.value, editPassword.value)
    saveSuccess.value = res.success
    saveMessage.value = res.message
    if (res.success) {
      memName.value = editName.value
      editPassword.value = ''
    }
  } catch (err) {
    saveSuccess.value = false
    saveMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
  } finally {
    saving.value = false
  }
}

const chkImage = async () => {
  if (!memEmail.value) return
  const image = new Image()
  image.src = `/img_mem/${memEmail.value}.jpg`
  
  image.onload = () => {
    imgOK.value = true
  }
  image.onerror = () => {
    imgOK.value = false
  }
}

const onFileChange = (e) => {
  file.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!file.value) {
    fileMessage.value = "เลือก File เพื่อ Upload"
    return
  }

  const formData = new FormData()
  formData.append("memEmail", memEmail.value)
  formData.append("file", file.value)

  try {
    const response = await axios.post("/members/uploadimg", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    
    fileMessage.value = response.data.message
    await chkImage()
    imageTimestamp.value = Date.now()
  } catch (err) {
    fileMessage.value = "Upload ไม่สำเร็จ"
  }
}

onMounted(async () => {
  await getMember()
  await chkImage()
})
</script>

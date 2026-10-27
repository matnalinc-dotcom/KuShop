<template>
  <div class="container mt-5">
    <div class="card shadow-sm p-4">
      <h1 class="mb-4">Member Profile</h1>

      <div class="row">
        <!-- ข้อมูลสมาชิก -->
        <div class="col-md-6 col-sm-12">
          <p><strong>Email:</strong> {{ memEmail }}</p>
          <p><strong>Name:</strong> {{ memName }}</p>
          <p><strong>Duty ID:</strong> {{ dutyId }}</p>
        </div>

        <!-- 💡 ส่วนแสดงรูปภาพสมาชิก -->
        <div class="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
          <!-- กรณีมีรูปภาพของผู้ใช้ -->
          <div class="card" style="width: 14rem" v-if="imgOK">
            <img :src="`http://localhost:3000/img_mem/${memEmail}.jpg?timestamp=${imageTimestamp}`" :alt="memEmail" class="card-img-top img-thumbnail" />
          </div>
          <!-- กรณีไม่มีรูปภาพ ให้แสดงรูป default -->
          <div class="card" style="width: 14rem" v-else>
            <img src="http://localhost:3000/img_mem/default.jpg" :alt="memEmail" class="card-img-top img-thumbnail" />
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
            <input class="form-control" type="file" id="formFile" @change="onFileChange" required />
          </div>
          <div class="col-auto">
            <button class="btn btn-primary" type="submit">Upload</button>
          </div>
        </div>

        <!-- แสดงข้อความสถานะการอัปโหลด -->
        <div class="row mt-3" v-if="fileMessage">
          <div class="col-md-6 col-sm-12">
            <div class="alert" :class="fileMessage === 'Upload ไม่สำเร็จ' ? 'alert-danger' : 'alert-success'" role="alert">
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

axios.defaults.withCredentials = true

const member = ref(null)
const memEmail = ref(null)
const memName = ref(null)
const dutyId = ref(null)

// 💡 ตัวแปรเพิ่มเติมสำหรับจัดการเรื่องรูปภาพ (Lab 12)
const imgOK = ref(false)
const fileMessage = ref(null)
const file = ref(null)
const imageTimestamp = ref(Date.now()) // บังคับไม่ให้ Browser ติด Cache รูปเก่า

const getMember = async () => {
  try {
    const res = await axios.get('http://localhost:3000/members/detail')
    member.value = res.data
    memEmail.value = member.value.memEmail
    memName.value = member.value.memName
    dutyId.value = member.value.dutyId
  } catch (err) {
    console.log(err.message)
  }
}

// 💡 ตรวจสอบว่ามีรูปภาพของสมาชิกบน Server หรือยัง
const chkImage = async () => {
  if (!memEmail.value) return
  const image = new Image()
  image.src = `http://localhost:3000/img_mem/${memEmail.value}.jpg`
  
  image.onload = () => {
    imgOK.value = true
  }
  image.onerror = () => {
    imgOK.value = false
  }
}

// 💡 จัดเก็บไฟล์ที่ผู้ใช้เลือกจากหน้าจอ
const onFileChange = (e) => {
  file.value = e.target.files[0]
}

// 💡 ส่งไฟล์ไปบันทึกยัง Backend
const uploadFile = async () => {
  if (!file.value) {
    fileMessage.value = "เลือก File เพื่อ Upload"
    return
  }

  const formData = new FormData()
  formData.append("memEmail", memEmail.value)
  formData.append("file", file.value)

  try {
    const response = await axios.post("http://localhost:3000/members/uploadimg", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    
    fileMessage.value = response.data.message
    await chkImage()
    imageTimestamp.value = Date.now() // อัปเดต timestamp เพื่อโหลดรูปใหม่ทันที
  } catch (err) {
    fileMessage.value = "Upload ไม่สำเร็จ"
  }
}

onMounted(async () => {
  await getMember()
  await chkImage() // ตรวจสอบรูปภาพทันทีที่เข้าหน้า
})
</script>
import express from "express"
import * as memberC from "../controllers/memberController.js"

const router = express.Router()

// แก้ไขเอาคำว่า /members ข้างหน้าออก
router.get('/detail', memberC.getMember)        // จะกลายเป็น /members/detail
router.get('/logout', memberC.logoutMember)      // จะกลายเป็น /members/logout
router.post('/', memberC.postMember)            // จะกลายเป็น /members
router.post('/register', memberC.postMember)     // จะกลายเป็น /members/register
router.post('/login', memberC.loginMember)       // จะกลายเป็น /members/login

// 💡 เพิ่ม Route สำหรับอัปโหลดรูปภาพสมาชิก (Lab 12)
router.post('/uploadimg', memberC.uploadMember)  // จะกลายเป็น /members/uploadimg

export default router
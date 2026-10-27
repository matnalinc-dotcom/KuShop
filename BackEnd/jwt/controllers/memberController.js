import database from "../services/database.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import multer from "multer" // 💡 Import multer

// ==========================================
// 💡 CONFIGURATION FOR MULTER FILE UPLOAD (Lab 12)
// ==========================================

// 1. กำหนดค่า Storage สำหรับจัดเก็บไฟล์
const storage = multer.diskStorage({
  // กำหนดโฟลเดอร์ปลายทาง
  destination: function (req, file, cb) {
    cb(null, 'img_mem') // เซฟไว้ที่โฟลเดอร์ img_mem[cite: 3, 4]
  },
  // กำหนดชื่อไฟล์ที่จะบันทึก
  filename: function (req, file, cb) {
    // ใช้ memEmail จาก req.body เช่น "test@gmail.com.jpg"[cite: 4]
    const filename = `${req.body.memEmail}.jpg` 
    cb(null, filename)
  }
})

// 2. กำหนดค่า Uploader (รับไฟล์เดียว ใน field ชื่อ 'file')[cite: 4]
const upload = multer({
  storage: storage,
}).single('file')

// 3. Method สำหรับให้ Frontend เรียกใช้งาน Upload[cite: 4]
export async function uploadMember(req, res) {
  console.log("Upload Member Image")
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message })
    }
    res.status(200).json({ message: 'File uploaded successfully!' }) //[cite: 4]
  })
}

// ==========================================
// MEMBER AUTHENTICATION FUNCTIONS (Lab 11)
// ==========================================

// 1. อ่านและตรวจสอบ Token จาก Cookies
export async function getMember(req, res) {
  console.log("GET /members/detail is requested.")
  const token = req.cookies.token

  if (!token) {
    return res.json({ message: "No member", login: false })
  }

  try {
    const secret_key = process.env.SECRET_KEY || "secret_key"
    const member = jwt.verify(token, secret_key)

    return res.json({
      memEmail: member.memEmail,
      memName: member.memName,
      dutyId: member.dutyId,
      login: true
    })
  } catch (err) {
    console.log(err.message)
    return res.json({ message: "The information was falsified.", login: false })
  }
}

// 2. สมัครสมาชิก (Register)
export async function postMember(req, res) {
  try {
    const { memEmail, memName, password } = req.body
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    const query = `
      INSERT INTO members ("memEmail", "memName", "memHash")
      VALUES ($1, $2, $3)
    `
    await database.query(query, [memEmail, memName, hash])

    return res.json({ message: "Regist Success", regist: true })
  } catch (err) {
    return res.status(500).json({ message: err.message, regist: false })
  }
}

// 3. เข้าสู่ระบบ (Login) + สร้าง JWT Cookie
export async function loginMember(req, res) {
  try {
    const loginName = req.body.loginName || req.body.username || req.body.memEmail
    const password = req.body.password || req.body.memPsw

    const result = await database.query(
      'SELECT * FROM members WHERE "memEmail" = $1',
      [loginName]
    )

    if (result.rows.length === 0) {
      return res.json({ message: "Login Fail", login: false })
    }

    const loginOK = await bcrypt.compare(password, result.rows[0].memHash)

    if (loginOK) {
      const theuser = {
        memEmail: result.rows[0].memEmail,
        memName: result.rows[0].memName,
        dutyId: result.rows[0].dutyid || result.rows[0].dutyId
      }

      const secret_key = process.env.SECRET_KEY || "secret_key"
      const token = jwt.sign(theuser, secret_key, { expiresIn: '1h' })

      res.cookie('token', token, {
        maxAge: 3600000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      })

      return res.json({ message: "Login Success", login: true })
    } else {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
      })

      return res.json({ message: "Login Fail", login: false })
    }
  } catch (err) {
    return res.json({ message: err.message })
  }
}

// 4. ออกจากระบบ (Logout)
export async function logoutMember(req, res) {
  console.log("GET /members/logout is requested.")
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax'
    })
    return res.json({ message: "Logout Success", login: false })
  } catch (err) {
    return res.json({ message: err.message })
  }
}
import database from "../services/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgMemDir = path.join(__dirname, "../img_mem");

// 1. Multer Configuration for Member Avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(imgMemDir)) {
      fs.mkdirSync(imgMemDir, { recursive: true });
    }
    cb(null, imgMemDir);
  },
  filename: function (req, file, cb) {
    const memEmail = (req.body.memEmail || "default").trim().toLowerCase();
    cb(null, `${memEmail}.jpg`);
  }
});

const upload = multer({ storage }).single("file");

export async function uploadMember(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message, uploadOK: false });
    }
    return res.status(200).json({ message: "อัปโหลดรูปภาพสำเร็จ", uploadOK: true });
  });
}

// 2. Authentication: Get Member Profile from Cookie
export async function getMember(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ message: "No member", login: false });
  }

  try {
    const secret_key = process.env.SECRET_KEY || "secret_key";
    const member = jwt.verify(token, secret_key);

    // Fetch latest info from DB (Case-Insensitive)
    const result = await database.query(
      'SELECT "memEmail", "memName", dutyid FROM members WHERE LOWER("memEmail") = LOWER($1)',
      [member.memEmail]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Member not found", login: false });
    }

    const row = result.rows[0];
    return res.json({
      memEmail: row.memEmail,
      memName: row.memName,
      dutyId: row.dutyid || "member",
      login: true
    });
  } catch (err) {
    return res.json({ message: "The information was falsified.", login: false });
  }
}

// 3. Register (สมัครสมาชิก)
export async function postMember(req, res) {
  try {
    let { memEmail, memName, password, dutyId } = req.body;
    if (!memEmail || !memName || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน", regist: false });
    }

    memEmail = memEmail.trim().toLowerCase();
    memName = memName.trim();

    // Check if exists (Case-Insensitive)
    const check = await database.query('SELECT 1 FROM members WHERE LOWER("memEmail") = LOWER($1)', [memEmail]);
    if (check.rowCount > 0) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้งานไปแล้ว", regist: false });
    }

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO members ("memEmail", "memName", "memHash", dutyid)
      VALUES ($1, $2, $3, $4)
    `;
    await database.query(query, [memEmail, memName, hash, dutyId || "member"]);

    return res.json({ message: "สมัครสมาชิกสำเร็จ", regist: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, regist: false });
  }
}

// 4. Login (เข้าสู่ระบบ)
export async function loginMember(req, res) {
  try {
    const loginName = (req.body.loginName || req.body.username || req.body.memEmail || "").trim();
    const password = req.body.password || req.body.memPsw;

    if (!loginName || !password) {
      return res.json({ message: "กรุณากรอก Email และรหัสผ่าน", login: false });
    }

    // Case-Insensitive email check
    const result = await database.query(
      'SELECT * FROM members WHERE LOWER("memEmail") = LOWER($1)',
      [loginName]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", login: false });
    }

    const loginOK = await bcrypt.compare(password, result.rows[0].memHash);

    if (loginOK) {
      const theuser = {
        memEmail: result.rows[0].memEmail,
        memName: result.rows[0].memName,
        dutyId: result.rows[0].dutyid || "member"
      };

      const secret_key = process.env.SECRET_KEY || "secret_key";
      const token = jwt.sign(theuser, secret_key, { expiresIn: "1d" });

      res.cookie("token", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });

      return res.json({ message: "Login Success", login: true, dutyId: theuser.dutyId, memName: theuser.memName });
    } else {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });
      return res.json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", login: false });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message, login: false });
  }
}

// 5. Logout (ออกจากระบบ)
export async function logoutMember(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    return res.json({ message: "Logout Success", login: false });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// 6. Update Member Profile (แก้ไขข้อมูลสมาชิก) [Member]
export async function updateMember(req, res) {
  try {
    let { memEmail, memName, password } = req.body;
    if (!memEmail || !memName) {
      return res.status(400).json({ message: "Email และ ชื่อเป็นข้อมูลจำเป็น", success: false });
    }

    memEmail = memEmail.trim().toLowerCase();
    memName = memName.trim();

    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);
      await database.query(
        'UPDATE members SET "memName" = $1, "memHash" = $2 WHERE LOWER("memEmail") = LOWER($3)',
        [memName, hash, memEmail]
      );
    } else {
      await database.query(
        'UPDATE members SET "memName" = $1 WHERE LOWER("memEmail") = LOWER($2)',
        [memName, memEmail]
      );
    }

    return res.json({ message: "แก้ไขข้อมูลส่วนตัวสำเร็จ", success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}

// 7. Get All Members (แสดงข้อมูลสมาชิกทั้งหมด) [Admin]
export async function getAllMembers(req, res) {
  try {
    const result = await database.query(
      'SELECT "memEmail", "memName", dutyid FROM members ORDER BY "memEmail" ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// 8. Update Member Duty / Status (เปลี่ยนสถานะสมาชิก / เพิ่ม Admin) [Admin]
export async function updateMemberDuty(req, res) {
  try {
    let { memEmail, dutyId } = req.body;
    if (!memEmail || !dutyId) {
      return res.status(400).json({ message: "กรุณาระบุ Email และ สถานะ", success: false });
    }

    memEmail = memEmail.trim().toLowerCase();

    const result = await database.query(
      'UPDATE members SET dutyid = $1 WHERE LOWER("memEmail") = LOWER($2)',
      [dutyId, memEmail]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ไม่พบสมาชิก", success: false });
    }

    return res.json({ message: `เปลี่ยนสถานะเป็น ${dutyId} สำเร็จ`, success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message, success: false });
  }
}

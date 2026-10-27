import bcrypt from 'bcrypt';
import database from '../services/database.js'; // หรือ import { pool } ขึ้นอยู่กับไฟล์ database.js ของคุณ

// 1. สมัครสมาชิก (Register)
export const postMember = async (req, res) => {
    console.log("POST /members is requested.");
    const bodyData = req.body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!bodyData.memEmail || !bodyData.memName) {
        return res.json({ message: "ERROR memEmail and memName is required.", regist: false });
    }

    try {
        // ตรวจสอบว่ามี Email นี้อยู่ในระบบหรือยัง
        const chkRow = await database.query({
            text: 'SELECT * FROM members WHERE "memEmail" = $1',
            values: [bodyData.memEmail]
        });

        if (chkRow.rowCount !== 0) {
            return res.json({ message: `ERROR memEmail ${bodyData.memEmail} is exists.`, regist: false });
        }

        // Hash รหัสผ่าน (อ่านค่าจาก bodyData.password)
        const pwd = bodyData.password;
        const saltround = 11;
        const pwdHash = await bcrypt.hash(pwd, saltround);

        // บันทึกลง คอลัมน์ memHash
        await database.query({
            text: 'INSERT INTO "members" ("memEmail", "memName", "memHash") VALUES ($1, $2, $3)',
            values: [bodyData.memEmail, bodyData.memName, pwdHash]
        });

        res.json({ message: "Regist Success", regist: true });

    } catch (err) {
        res.json({ message: err.message, regist: false });
    }
};

// 2. เข้าสู่ระบบ (Login)
export const loginMember = async (req, res) => {
    console.log("POST /members/login is requested.");
    const bodyData = req.body;

    // อ่านค่า loginName และ password จาก Frontend
    if (!bodyData.loginName || !bodyData.password) {
        return res.json({ message: "Login and Password is required", login: false });
    }

    try {
        // ค้นหาจาก memEmail
        const result = await database.query({
            text: 'SELECT * FROM members WHERE "memEmail" = $1',
            values: [bodyData.loginName]
        });

        if (result.rowCount === 0) {
            return res.json({ message: "Login Fail", login: false });
        }

        const user = result.rows[0];

        // ตรวจสอบ Password กับ memHash ใน DB
        const loginOK = await bcrypt.compare(bodyData.password, user.memHash);

        if (loginOK) {
            // เก็บข้อมูลลง Session
            req.session.userid = user.memEmail;
            req.session.username = user.memName;
            req.session.userrole = user.dutyid;

            res.json({ message: "Login Success", login: true });
        } else {
            res.json({ message: "Login Fail", login: false });
        }

    } catch (err) {
        res.json({ message: err.message, login: false });
    }
};
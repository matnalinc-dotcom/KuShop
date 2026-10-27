// routes/memberRoute.js
import express from 'express';
import { postMember, loginMember } from '../controllers/memberController.js';

const router = express.Router();

router.post('/members', postMember);          // สมัครสมาชิก
router.post('/members/login', loginMember);   // เข้าสู่ระบบ

export default router;
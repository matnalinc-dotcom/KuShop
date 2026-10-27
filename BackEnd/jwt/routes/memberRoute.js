import express from "express";
import * as memberC from "../controllers/memberController.js";

const router = express.Router();

router.get("/detail", memberC.getMember);
router.get("/logout", memberC.logoutMember);
router.get("/all", memberC.getAllMembers);

router.post("/", memberC.postMember);
router.post("/register", memberC.postMember);
router.post("/login", memberC.loginMember);
router.post("/uploadimg", memberC.uploadMember);

router.put("/update", memberC.updateMember);
router.put("/duty", memberC.updateMemberDuty);

export default router;

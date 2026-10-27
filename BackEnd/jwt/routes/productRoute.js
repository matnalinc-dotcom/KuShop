import express from "express";

import {
  getAllProduct,
  getThreeProduct,
  getSearchProduct,
  getProductById
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/three", getThreeProduct);
router.get("/search/:id", getSearchProduct);
router.get("/:id", getProductById); // 👈 เพิ่มบรรทัดนี้

export default router;
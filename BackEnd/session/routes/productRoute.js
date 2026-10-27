import express from "express";

import {
  getAllProduct,
  getThreeProduct,
  getSearchProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/three", getThreeProduct);
router.get("/search/:id", getSearchProduct);

export default router;
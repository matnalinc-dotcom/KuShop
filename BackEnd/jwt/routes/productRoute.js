import express from "express";
import {
  getAllProduct,
  getThreeProduct,
  getSearchProduct,
  getProductById,
  postProduct,
  putProduct,
  deleteProduct,
  uploadProductImg,
  getBrands,
  getPdTypes
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/three", getThreeProduct);
router.get("/meta/brands", getBrands);
router.get("/meta/types", getPdTypes);
router.get("/search/:id", getSearchProduct);
router.get("/:id", getProductById);
router.post("/", postProduct);
router.post("/uploadimg", uploadProductImg);
router.put("/:id", putProduct);
router.delete("/:id", deleteProduct);

export default router;

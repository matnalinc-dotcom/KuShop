import database from "../services/database.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgPdDir = path.join(__dirname, "../img_pd");

// Configure Multer for product images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(imgPdDir)) {
      fs.mkdirSync(imgPdDir, { recursive: true });
    }
    cb(null, imgPdDir);
  },
  filename: function (req, file, cb) {
    const pdId = req.body.pdId || req.query.pdId || "temp";
    cb(null, `${pdId}.jpg`);
  }
});

const upload = multer({ storage }).single("file");

// Upload product image
export async function uploadProductImg(req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message, uploadOK: false });
    }
    return res.status(200).json({ message: "อัปโหลดรูปภาพสินค้าสำเร็จ", uploadOK: true });
  });
}

// Format row to match Frontend requirements
function formatProduct(row) {
  return {
    pdId: row.pdId,
    pdName: row.pdName,
    pdPrice: row.pdPrice,
    pdTypeId: row.pdTypeId,
    brandId: row.brandId,
    Remark: row.Remark,
    brand: { brandName: row.brandName || "KU" },
    pdt: { pdTypeName: row.pdTypeName || "" }
  };
}

// GET /products
export const getAllProduct = async (req, res) => {
  try {
    const result = await database.query(`
      SELECT p.*, b."brandName", pt."pdTypeName"
      FROM products p
      LEFT JOIN brands b ON p."brandId" = b."brandId"
      LEFT JOIN "pdTypes" pt ON p."pdTypeId" = pt."pdTypeId"
      ORDER BY p."pdId" ASC
    `);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /products/three
export const getThreeProduct = async (req, res) => {
  try {
    const result = await database.query(`
      SELECT p.*, b."brandName", pt."pdTypeName"
      FROM products p
      LEFT JOIN brands b ON p."brandId" = b."brandId"
      LEFT JOIN "pdTypes" pt ON p."pdTypeId" = pt."pdTypeId"
      ORDER BY p."pdId" ASC
      LIMIT 3
    `);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /products/search/:id
export const getSearchProduct = async (req, res) => {
  const keyword = `%${req.params.id.toLowerCase()}%`;
  try {
    const result = await database.query(`
      SELECT p.*, b."brandName", pt."pdTypeName"
      FROM products p
      LEFT JOIN brands b ON p."brandId" = b."brandId"
      LEFT JOIN "pdTypes" pt ON p."pdTypeId" = pt."pdTypeId"
      WHERE LOWER(p."pdId") LIKE $1
         OR LOWER(p."pdName") LIKE $1
         OR LOWER(COALESCE(p."Remark", '')) LIKE $1
      ORDER BY p."pdId" ASC
    `, [keyword]);
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /products/:id
export const getProductById = async (req, res) => {
  let reqId = req.params.id;
  try {
    const result = await database.query(`
      SELECT p.*, b."brandName", pt."pdTypeName"
      FROM products p
      LEFT JOIN brands b ON p."brandId" = b."brandId"
      LEFT JOIN "pdTypes" pt ON p."pdTypeId" = pt."pdTypeId"
      WHERE p."pdId" = $1
    `, [reqId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.json(result.rows.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /products (เพิ่มสินค้า) [Admin]
export const postProduct = async (req, res) => {
  const { pdId, pdName, pdPrice, pdTypeId, brandId, Remark } = req.body;
  if (!pdId || !pdName || pdPrice == null) {
    return res.status(400).json({ message: "กรุณากรอกรหัสสินค้า ชื่อ และราคา", success: false });
  }

  try {
    const check = await database.query('SELECT 1 FROM products WHERE "pdId" = $1', [pdId]);
    if (check.rowCount > 0) {
      return res.status(409).json({ message: `รหัสสินค้า ${pdId} มีอยู่ในระบบแล้ว`, success: false });
    }

    await database.query(`
      INSERT INTO products ("pdId", "pdName", "pdPrice", "pdTypeId", "brandId", "Remark", "Createdate")
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `, [pdId, pdName, pdPrice, pdTypeId || "T01", brandId || "B01", Remark || ""]);

    res.status(201).json({ message: "เพิ่มสินค้าสำเร็จ", success: true, pdId });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// PUT /products/:id (แก้ไขสินค้า) [Admin]
export const putProduct = async (req, res) => {
  const { id } = req.params;
  const { pdName, pdPrice, pdTypeId, brandId, Remark } = req.body;

  try {
    const result = await database.query(`
      UPDATE products
      SET "pdName" = COALESCE($1, "pdName"),
          "pdPrice" = COALESCE($2, "pdPrice"),
          "pdTypeId" = COALESCE($3, "pdTypeId"),
          "brandId" = COALESCE($4, "brandId"),
          "Remark" = COALESCE($5, "Remark")
      WHERE "pdId" = $6
    `, [pdName, pdPrice, pdTypeId, brandId, Remark, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการแก้ไข", success: false });
    }

    res.json({ message: "แก้ไขข้อมูลสินค้าสำเร็จ", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// DELETE /products/:id (ลบสินค้า) [Admin]
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await database.query('DELETE FROM products WHERE "pdId" = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ", success: false });
    }
    res.json({ message: "ลบสินค้าสำเร็จ", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

// GET /products/meta/brands
export const getBrands = async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM brands ORDER BY "brandId"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /products/meta/types
export const getPdTypes = async (req, res) => {
  try {
    const result = await database.query('SELECT * FROM "pdTypes" ORDER BY "pdTypeId"');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

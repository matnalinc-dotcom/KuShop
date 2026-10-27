// controllers/productController.js

const products = [
  {
    pdId: "001",
    pdName: "KU Shirt",
    pdPrice: 350,
    Remark: "เสื้อมหาวิทยาลัย",
    brand: { brandName: "KU" }
  },
  {
    pdId: "002",
    pdName: "KU Bag",
    pdPrice: 590,
    Remark: "กระเป๋าผ้า",
    brand: { brandName: "KU" }
  },
  {
    pdId: "003",
    pdName: "KU Bottle",
    pdPrice: 250,
    Remark: "ขวดน้ำ",
    brand: { brandName: "KU" }
  },
  {
    pdId: "004",
    pdName: "KU Cap",
    pdPrice: 300,
    Remark: "หมวก",
    brand: { brandName: "KU" }
  }
];

// GET /products
export const getAllProduct = (req, res) => {
  res.json(products);
};

// GET /products/three
export const getThreeProduct = (req, res) => {
  res.json(products.slice(0, 3));
};

// GET /products/search/:id
export const getSearchProduct = (req, res) => {
  const keyword = req.params.id.toLowerCase();

  const result = products.filter(
    (p) =>
      p.pdId.toLowerCase().includes(keyword) ||
      p.pdName.toLowerCase().includes(keyword) ||
      (p.Remark && p.Remark.toLowerCase().includes(keyword))
  );

  res.json(result);
};

// GET /products/:id (เพิ่มอันนี้)
export const getProductById = (req, res) => {
  let reqId = req.params.id;
  
  // ตัดตัว 'P' ออกถ้าส่งมาเป็น P001 ให้เหลือแค่ 001 ตรงกับใน Mock Array
  if (reqId.startsWith('P') || reqId.startsWith('p')) {
    reqId = reqId.substring(1);
  }

  const product = products.find((p) => p.pdId === reqId);

  if (!product) {
    return res.status(404).json({ message: "ไม่พบสินค้า" });
  }

  res.json(product);
};
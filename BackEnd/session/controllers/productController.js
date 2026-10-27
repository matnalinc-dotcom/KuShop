// controllers/productController.js

const products = [
  {
    pdId: "001",
    pdName: "KU Shirt",
    pdPrice: 350,
    pdRemark: "เสื้อมหาวิทยาลัย",
    brand: { brandName: "KU" }
  },
  {
    pdId: "002",
    pdName: "KU Bag",
    pdPrice: 590,
    pdRemark: "กระเป๋าผ้า",
    brand: { brandName: "KU" }
  },
  {
    pdId: "003",
    pdName: "KU Bottle",
    pdPrice: 250,
    pdRemark: "ขวดน้ำ",
    brand: { brandName: "KU" }
  },
  {
    pdId: "004",
    pdName: "KU Cap",
    pdPrice: 300,
    pdRemark: "หมวก",
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
      p.pdRemark.toLowerCase().includes(keyword)
  );

  res.json(result);
};
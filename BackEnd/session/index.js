import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import productRoute from "./routes/productRoute.js";
import memberRoute from "./routes/memberRoute.js";
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// เปิดโฟลเดอร์รูปภาพ
app.use("/img_pd", express.static("img_pd"));

// Session
app.use(
  session({
    secret: "thailandgogo",
    resave: false,
    saveUninitialized: true,
  })
);

// Login
app.post("/login", (req, res) => {
  const bodydata = req.body;

  req.session.userid = bodydata.id;
  req.session.username = bodydata.name;
  req.session.userrole = bodydata.role;

  return res.status(201).json({ message: "Success" });
});

// อ่าน Session
app.get("/get_session", (req, res) => {
  return res.status(200).json({
    id: req.session.userid,
    name: req.session.username,
    role: req.session.userrole,
  });
});

// ใช้ Route ของสินค้า
app.use("/products", productRoute);
// ใช้ Route ของสินค้า (Lab 8)
app.use(memberRoute);

// Start Server
app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});
import express from "express"
import * as cartC from "../controllers/cartController.js"

const router = express.Router()

// กำหนดเส้นทาง API ทั้งหมดสำหรับระบบตะกร้าสินค้า (ตัด /carts ออก)
router.post('/chkcart', cartC.chkCart)
router.post('/addcart', cartC.postCart)
router.post('/addcartdtl', cartC.postCartDtl)
router.get('/sumcart/:id', cartC.sumCart)
router.get('/getcart/:id', cartC.getCart)
router.get('/getcartdtl/:id', cartC.getCartDtl)
router.post('/getcartbycus', cartC.getCartByCus)

router.delete('/delcartdtl/:cartId/:pdId', cartC.deleteCartDtl) // ลบทีละชิ้น
router.delete('/delcart/:cartId', cartC.deleteCart)             // ลบทั้งตะกร้า
router.post('/confirmcart', cartC.confirmCart)                  // ยืนยันชำระเงิน

export default router
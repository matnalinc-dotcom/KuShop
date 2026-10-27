import express from "express";
import * as cartC from "../controllers/cartController.js";

const router = express.Router();

router.post("/chkcart", cartC.chkCart);
router.post("/addcart", cartC.postCart);
router.post("/addcartdtl", cartC.postCartDtl);
router.get("/sumcart/:id", cartC.sumCart);
router.get("/getcart/:id", cartC.getCart);
router.get("/getcartdtl/:id", cartC.getCartDtl);
router.post("/getcartbycus", cartC.getCartByCus);
router.get("/all", cartC.getAllCarts);

router.delete("/delcartdtl/:cartId/:pdId", cartC.deleteCartDtl);
router.delete("/delcart/:cartId", cartC.deleteCart);
router.post("/confirmcart", cartC.confirmCart);

export default router;

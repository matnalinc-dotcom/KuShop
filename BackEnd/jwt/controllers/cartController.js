import database from "../services/database.js";

// 1. ตรวจสอบว่ามีตะกร้าค้าง (ยังไม่ CF) หรือไม่
export async function chkCart(req, res) {
    const customerEmail = (req.body.memEmail || "").trim().toLowerCase();
    console.log(`POST CART customer ${customerEmail} is requested`);
    
    // Validate Data
    if (!customerEmail) {
        return res.json({ error: true, errormessage: "member Email is required" });
    }

    try {
        // ตรวจสอบตะกร้าที่ยังไม่ได้ CF (Case-Insensitive)
        const result = await database.query({
            text: 'SELECT * FROM carts WHERE LOWER("cusId") = LOWER($1) AND "cartCf" != true',
            values: [customerEmail],
        });

        if (result.rows[0] != null) {
            return res.json({ cartExist: true, cartId: result.rows[0].cartId });
        } else {
            return res.json({ cartExist: false });
        }
    } catch (err) {
        return res.json({ error: true, errormessage: err.message });
    }
}

// 2. สร้างตะกร้าใหม่ (Gen ID รูปแบบ YYYYMMDD0001)
export async function postCart(req, res) {
    console.log("POST/CART is requested");
    try {
        const customerId = (req.body.cusId || req.body.id || "").trim().toLowerCase();
        if (!customerId) {
            return res.json({ cartOK: false, messageAddCart: "Customer Id is required" });
        }

        // จัดรูปแบบวันที่ YYYYMMDD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const currentDate = `${year}${month}${day}`;

        let i = 0;
        let theId = "";
        let existsResult = [];

        // Loop หา id ที่ยังไม่มีในตะกร้า
        do {
            i++;
            theId = `${currentDate}${String(i).padStart(4, "0")}`;
            existsResult = await database.query({
                text: 'SELECT EXISTS (SELECT 1 FROM carts WHERE "cartId" = $1)',
                values: [theId],
            });
        } while (existsResult.rows[0].exists);

        // บันทึกข้อมูลลงตะกร้า
        await database.query({
            text: 'INSERT INTO carts ("cartId", "cusId", "cartDate") VALUES ($1, $2, $3)',
            values: [theId, customerId, now],
        });

        return res.json({ cartOK: true, messageAddCart: theId });
    } catch (err) {
        return res.json({ cartOK: false, messageAddCart: err.message });
    }
}

// 3. บันทึกสินค้าเข้าตะกร้า (ถ้าไม่มีให้ Insert ถ้ามีแล้วให้ Update qty + 1)
export async function postCartDtl(req, res) {
    console.log("POST/CARTDETAIL is requested");
    try {
        if (req.body.cartId == null || req.body.pdId == null || req.body.pdPrice == null) {
            return res.json({
                cartDtlOK: false,
                messageAddCartDtl: "CartId && ProductID && Price is required",
            });
        }

        const pdResult = await database.query({
            text: 'SELECT * FROM "cartDtl" ctd WHERE ctd."cartId" = $1 AND ctd."pdId" = $2',
            values: [req.body.cartId, req.body.pdId],
        });

        if (pdResult.rowCount === 0) {
            // ถ้าไม่มีให้ INSERT
            try {
                await database.query({
                    text: 'INSERT INTO "cartDtl" ("cartId", "pdId", "qty", "price") VALUES ($1, $2, $3, $4)',
                    values: [req.body.cartId, req.body.pdId, 1, Number(req.body.pdPrice)],
                });
                return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId });
            } catch (err) {
                return res.json({
                    cartDtlOK: false,
                    messageAddCartDtl: "INSERT DETAIL ERROR",
                });
            }
        } else {
            // ถ้ามีแล้วให้ UPDATE (qty + 1 แบบปลอดภัยด้วย Number)
            try {
                const currentQty = Number(pdResult.rows[0].qty) || 1;
                await database.query({
                    text: 'UPDATE "cartDtl" SET "qty" = $1 WHERE "cartId" = $2 AND "pdId" = $3',
                    values: [currentQty + 1, req.body.cartId, req.body.pdId],
                });
                return res.json({ cartDtlOK: true, messageAddCart: req.body.cartId });
            } catch (err) {
                return res.json({
                    cartDtlOK: false,
                    messageAddCartDtl: "UPDATE DETAIL ERROR",
                });
            }
        }
    } catch (err) {
        return res.json({
            cartDtlOK: false,
            messageAddCartDtl: "INSERT DETAIL ERROR",
        });
    }
}

// 4. หายอดรวมจำนวนชิ้นและยอดเงินรวม
export async function sumCart(req, res) {
    console.log(`GET SumCart ${req.params.id} is requested`);
    try {
        const result = await database.query({
            text: 'SELECT SUM(qty) AS qty, SUM(qty * price) AS money FROM "cartDtl" ctd WHERE ctd."cartId" = $1',
            values: [req.params.id],
        });
        return res.json({
            id: req.params.id,
            qty: Number(result.rows[0]?.qty || 0),
            money: Number(result.rows[0]?.money || 0),
        });
    } catch (err) {
        return res.json({ error: err.message });
    }
}

// 5. แสดงรายละเอียดส่วนหัวตะกร้า (Master)
export async function getCart(req, res) {
    console.log("GET Cart is Requested");
    try {
        const result = await database.query({
            text: `SELECT ct.*, SUM(ctd.qty) AS sqty, SUM(ctd.price*ctd.qty) AS sprice
                   FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                   WHERE ct."cartId" = $1
                   GROUP BY ct."cartId"`,
            values: [req.params.id],
        });
        return res.json(result.rows);
    } catch (err) {
        return res.json({ error: err.message });
    }
}

// 6. แสดงรายละเอียดรายการสินค้าในตะกร้า (Detail)
export async function getCartDtl(req, res) {
    console.log("GET CartDtl is Requested");
    try {
        const result = await database.query({
            text: `SELECT ROW_NUMBER() OVER (ORDER BY ctd."pdId") AS row_number,
                          ctd."pdId", COALESCE(pd."pdName", ctd."pdId") AS "pdName", ctd.qty, ctd.price
                   FROM "cartDtl" ctd LEFT JOIN "products" pd ON ctd."pdId" = pd."pdId"
                   WHERE ctd."cartId" = $1
                   ORDER BY ctd."pdId"`,
            values: [req.params.id],
        });
        return res.json(result.rows);
    } catch (err) {
        return res.json({ error: err.message });
    }
}

// 7. ดึงข้อมูลตะกร้าทั้งหมดของผู้ใช้งาน (Customer)
export async function getCartByCus(req, res) {
    const customerId = (req.body.id || req.body.cusId || "").trim().toLowerCase();
    console.log(`POST Cart By Customer is Requested: ${customerId}`);
    try {
        const result = await database.query({
            text: `SELECT ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
                          ct.*, SUM(ctd.qty) AS sqty, SUM(ctd.price*ctd.qty) AS sprice
                   FROM carts ct LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
                   WHERE LOWER(ct."cusId") = LOWER($1)
                   GROUP BY ct."cartId"
                   ORDER BY ct."cartId" DESC`,
            values: [customerId],
        });
        return res.json(result.rows);
    } catch (err) {
        return res.json({ error: err.message });
    }
}

// 7.1 ดึงข้อมูลตะกร้าทั้งหมดในระบบ [Admin]
export async function getAllCarts(req, res) {
    console.log("GET All Carts is Requested");
    try {
        const result = await database.query(`
            SELECT ROW_NUMBER() OVER (ORDER BY ct."cartId" DESC) AS row_number,
                   ct.*, m."memName", SUM(ctd.qty) AS sqty, SUM(ctd.price*ctd.qty) AS sprice
            FROM carts ct
            LEFT JOIN "cartDtl" ctd ON ct."cartId" = ctd."cartId"
            LEFT JOIN members m ON LOWER(ct."cusId") = LOWER(m."memEmail")
            GROUP BY ct."cartId", m."memName"
            ORDER BY ct."cartId" DESC
        `);
        return res.json(result.rows);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// 8. ลบสินค้าทีละชิ้นออกจากตะกร้า
export async function deleteCartDtl(req, res) {
    console.log(`DELETE CartDetail pdId ${req.params.pdId} in cart ${req.params.cartId}`);
    try {
        const { cartId, pdId } = req.params;

        // 💡 1. ตรวจสอบสถานะ cartCf ก่อนลบ
        const chk = await database.query({
            text: 'SELECT "cartCf" FROM carts WHERE "cartId" = $1',
            values: [cartId]
        });

        if (chk.rows.length > 0 && chk.rows[0].cartCf) {
            return res.json({ cartDtlOK: false, message: "ไม่สามารถลบสินค้าในรายการที่ยืนยันสั่งซื้อแล้วได้" });
        }

        // 💡 2. ทำการลบถ้ายังไม่ได้สั่งซื้อ
        await database.query({
            text: 'DELETE FROM "cartDtl" WHERE "cartId" = $1 AND "pdId" = $2',
            values: [cartId, pdId]
        });
        return res.json({ cartDtlOK: true, message: "Deleted item successfully" });
    } catch (err) {
        return res.json({ cartDtlOK: false, message: err.message });
    }
}

// 9. ลบตะกร้าทั้งใบ (เพิ่มการเช็ก cartCf)
export async function deleteCart(req, res) {
    console.log(`DELETE Cart ${req.params.cartId}`);
    try {
        const { cartId } = req.params;

        // 💡 1. ตรวจสอบสถานะ cartCf ก่อนลบ
        const chk = await database.query({
            text: 'SELECT "cartCf" FROM carts WHERE "cartId" = $1',
            values: [cartId]
        });

        if (chk.rows.length > 0 && chk.rows[0].cartCf) {
            return res.json({ cartOK: false, message: "ไม่สามารถลบตะกร้าที่ยืนยันการสั่งซื้อแล้วได้" });
        }

        // 💡 2. ลบรายละเอียดสินค้าในตะกร้าก่อน
        await database.query({
            text: 'DELETE FROM "cartDtl" WHERE "cartId" = $1',
            values: [cartId]
        });
        // 💡 3. ลบตัวหัวตะกร้า
        await database.query({
            text: 'DELETE FROM carts WHERE "cartId" = $1',
            values: [cartId]
        });
        return res.json({ cartOK: true, message: "Deleted cart successfully" });
    } catch (err) {
        return res.json({ cartOK: false, message: err.message });
    }
}

// 10. ชำระเงิน/ยืนยันการสั่งซื้อ (อัปเดต cartCf เป็น true เพื่อให้ของหายไปจากตะกร้า)
export async function confirmCart(req, res) {
    console.log(`POST Confirm Cart ${req.body.cartId}`);
    try {
        const { cartId } = req.body;
        if (!cartId) {
            return res.json({ confirmOK: false, message: "cartId is required" });
        }
        
        // อัปเดตสถานะการยืนยันตะกร้าให้เป็น true
        await database.query({
            text: 'UPDATE carts SET "cartCf" = true WHERE "cartId" = $1',
            values: [cartId]
        });
        return res.json({ confirmOK: true, message: "Cart confirmed successfully" });
    } catch (err) {
        return res.json({ confirmOK: false, message: err.message });
    }
}

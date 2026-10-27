<template>
  <div class="container mt-4">
    <div v-if="memEmail == cusId">
      <div v-for="(ct, index) in cart" :key="ct.cartId || index" class="mt-3">
        <div class="card bg-light">
          <div class="card-body">
            <h4 class="card-title text-primary opacity-75">คำสั่งซื้อเลขที่ {{ ct.cartId }}</h4>
            <h5 class="card-subtitle mt-2 text-muted">
              สั่งซื้อวันที่ {{ formattedDate(ct.cartDate) }}
            </h5>
            <div class="text-danger text-end">
              จำนวนสินค้า {{ ct.sqty }} ชิ้น, ยอดเงิน {{ (ct.sprice ?? 0).toLocaleString() }} บาท
            </div>
            <hr />
            
            <!-- 💡 เช็กถ้ายังไม่ได้สั่งซื้อ (cartCf != true) ให้แสดงปุ่มจัดการ -->
            <div v-if="!ct.cartCf">
              <button class="btn btn-danger" @click="delCart">
                <i class="bi bi-cart-x-fill"></i> ลบตะกร้าสินค้า
              </button>
              <button class="btn btn-primary float-end" @click="confirmCart">
                <i class="bi bi-currency-dollar"></i> ยืนยันสั่งสินค้า
              </button>
            </div>
            <!-- 💡 หากยืนยันสั่งซื้อแล้ว ให้แสดงข้อความแจ้งเตือนแทน -->
            <div v-else class="text-success fw-bold text-end">
              <i class="bi bi-check-circle-fill"></i> ชำระเงิน/ยืนยันการสั่งซื้อเรียบร้อยแล้ว
            </div>
          </div>
        </div>
      </div>

      <table class="table mt-3 align-middle">
        <thead>
          <tr class="bg-secondary bg-opacity-10">
            <td>#</td>
            <td>รหัสสินค้า</td>
            <td>ชื่อสินค้า</td>
            <td class="text-end">ราคาต่อหน่วย</td>
            <td class="text-center">จำนวน</td>
            <td class="text-end">เป็นเงิน</td>
            <!-- 💡 ซ่อนคอลัมน์ "จัดการ" หากยืนยันสั่งซื้อแล้ว -->
            <td v-if="cart.length > 0 && !cart[0].cartCf" class="text-center">จัดการ</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ctd, index) in cartDtl" :key="ctd.pdId || index">
            <td>{{ ctd.row_number }}</td>
            <td>{{ ctd.pdId }}</td>
            <td>{{ ctd.pdName }}</td>
            <td class="text-end">{{ ctd.price }}</td>
            <td class="text-center">{{ ctd.qty }}</td>
            <td class="text-end">{{ ((ctd.price * ctd.qty) ?? 0).toLocaleString() }}</td>
            
            <!-- 💡 ซ่อนไอคอนลบทีละชิ้น หากยืนยันสั่งซื้อแล้ว -->
            <td v-if="cart.length > 0 && !cart[0].cartCf" class="text-center">
              <i class="bi bi-x-lg text-danger" style="cursor: pointer;" title="ลบรายการนี้" @click="delCartDtl(ctd.pdId)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <div class="alert alert-danger mt-5">คุณไม่มีสิทธิ์ดูรายการนี้</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '@/stores/cartStore';

axios.defaults.withCredentials = true;

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const cart = ref([]);
const cartDtl = ref([]);
const cartId = ref(null);
const cusId = ref(null);
const memEmail = ref(null);

const formattedDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

onMounted(async () => {
  await getMember();
  cartId.value = route.params.cartId;
  await getCart();
  await getCartDtl();
});

const getCart = async () => {
  await axios.get(`http://localhost:3000/carts/getcart/${cartId.value}`)
    .then(res => {
      cart.value = res.data;
      if (cart.value.length > 0) {
        cusId.value = cart.value[0].cusId;
      }
    })
    .catch(err => { console.error(err); });
};

const getCartDtl = async () => {
  await axios.get(`http://localhost:3000/carts/getcartdtl/${cartId.value}`)
    .then(res => {
      cartDtl.value = res.data;
    })
    .catch(err => { console.error(err); });
};

const getMember = async () => {
  await axios.get("http://localhost:3000/members/detail")
    .then((res) => {
      memEmail.value = res.data.memEmail;
    })
    .catch(err => console.log(err.message));
};

// 1. ลบสินค้าทีละชิ้น
const delCartDtl = async (pdId) => {
  if (confirm('ยืนยันลบสินค้ารายการนี้?')) {
    await axios.delete(`http://localhost:3000/carts/delcartdtl/${cartId.value}/${pdId}`)
      .then(async (res) => {
        if (res.data.cartDtlOK) {
          await getCart();    // โหลดส่วนหัวเพื่ออัปเดตราคารวม
          await getCartDtl(); // โหลดรายการสินค้าใหม่
          cartStore.updateQty(); // อัปเดตจำนวนตัวเลขบน MainMenu
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.error(err));
  }
};

// 2. ลบตะกร้าทั้งใบ
const delCart = async () => {
  if (confirm('ยืนยันลบตะกร้าสินค้าทั้งหมด?')) {
    await axios.delete(`http://localhost:3000/carts/delcart/${cartId.value}`)
      .then((res) => {
        if (res.data.cartOK) {
          alert('ลบตะกร้าเรียบร้อยแล้ว');
          cartStore.updateQty();
          router.push('/'); 
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.error(err));
  }
};

// 3. ยืนยันสั่งสินค้า (ชำระเงิน)
const confirmCart = async () => {
  if (confirm('ยืนยันการสั่งซื้อสินค้า?')) {
    await axios.post('http://localhost:3000/carts/confirmcart', { cartId: cartId.value })
      .then((res) => {
        if (res.data.confirmOK) {
          alert('ยืนยันการสั่งซื้อสำเร็จ!');
          cartStore.updateQty();
          router.push('/cartlist');
        }
      })
      .catch(err => console.error(err));
  }
};
</script>
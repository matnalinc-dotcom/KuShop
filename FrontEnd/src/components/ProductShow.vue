<template>
  <div class="container">
    <div v-for="(pd, pdId) in products" :key="pdId" class="mt-5">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="card mx-auto mb-3" style="width: 18rem">
            <img :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`" alt="" class="rounded shadow-sm">
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <table class="table">
            <tbody>
              <tr class="table-secondary">
                <td><h4>{{ pd.pdId }}</h4></td>
                <td><h4>{{ pd.pdName }}</h4></td>
              </tr>
              <tr>
                <td><h5>ราคา</h5></td>
                <td><h5>{{ pd.pdPrice }}</h5></td>
              </tr>
              <tr>
                <td><h5>ยี่ห้อ</h5></td>
                <td><h5>{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</h5></td>
              </tr>
              <tr>
                <td><h5>รายละเอียด</h5></td>
                <td><h5>{{ pd.Remark }}</h5></td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" @click="chkLogin()">
            <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
          </button>
          <button class="btn btn-warning float-end">
            <i class="bi bi-pencil-fill lead"></i> แก้ไข&nbsp;&nbsp;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '@/stores/cartStore';

axios.defaults.withCredentials = true;

const route = useRoute();
const cartStore = useCartStore();

const products = ref([]);
const id = ref(null);
const login = ref(false);
const memEmail = ref(null);
const cartId = ref(null);
const backendMessage = ref(null);

onMounted(async () => {
  let paramId = route.params.pdId;

  // 🛠️ เติม P นำหน้าอัตโนมัติ หากส่งมาแค่เลข เช่น 001 -> P001
  if (paramId && !paramId.startsWith('P')) {
    paramId = 'P' + paramId;
  }

  id.value = paramId;
  console.log("pdId after fix:", id.value);

  axios.get(`http://localhost:3000/products/${id.value}`)
    .then(res => {
      console.log("API Response:", res.data);
      if (Array.isArray(res.data)) {
        products.value = res.data;
      } else if (res.data) {
        products.value = [res.data];
      }
    })
    .catch(err => console.log("Error API:", err.message));
});

const chkLogin = async () => {
  await axios.get("http://localhost:3000/members/detail")
    .then((res) => {
      login.value = res.data.login;
      memEmail.value = res.data.memEmail;
    })
    .catch(err => console.log(err.message));

  if (login.value) {
    await chkCart();
    if (!cartId.value) {
      await addCart();
    }
    await addCartDtl();
  } else {
    alert("ยังไม่ได้ Login ต้อง Login ก่อนซื้อสินค้า");
  }
};

const chkCart = async () => {
  let members = { memEmail: memEmail.value };
  try {
    const response = await axios.post("http://localhost:3000/carts/chkcart", members);
    cartId.value = response.data.cartId;
  } catch (err) {
    console.log(err);
  }
};

const addCart = async () => {
  let customer = { cusId: memEmail.value };
  try {
    const response = await axios.post("http://localhost:3000/carts/addcart", customer);
    backendMessage.value = response.data.messageAddCart;
    cartId.value = response.data.messageAddCart;
  } catch (err) {
    console.log(err);
  }
};

const addCartDtl = async () => {
  let cartdtl = {
    cartId: cartId.value,
    pdId: id.value,
    pdPrice: products.value[0].pdPrice
  };
  try {
    const response = await axios.post("http://localhost:3000/carts/addcartdtl", cartdtl);
    cartStore.updateQty();
    cartStore.setId(cartId.value);
    backendMessage.value = response.data.messageAddCartDtl;
    alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว");
  } catch (err) {
    console.log(err);
  }
};
</script>
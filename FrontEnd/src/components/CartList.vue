<template>
  <div class="container mt-4">
    <h1>รายการตะกร้าสินค้า: {{ memEmail }}</h1>
    <table class="table">
      <thead>
        <tr class="bg-secondary bg-opacity-10" style="height: 30px;">
          <td>#</td>
          <td>เลขที่ตะกร้า</td>
          <td>วันที่</td>
          <td class="text-center">จำนวน</td>
          <td class="text-end">ยอดเงิน</td>
          <td class="text-center">CF</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ct, cartId) in cart" :key="cartId" style="height: 30px;">
          <td>{{ ct.row_number }}</td>
          <td>
            <span class="text-primary">
              <router-link :to="`/cartshow/${ct.cartId}`" style="text-decoration: none;">
                {{ ct.cartId }}
              </router-link>
            </span>
          </td>
          <td>{{ formattedDate(ct.cartDate) }}</td>
          <td class="text-center">{{ (ct.sqty ?? 0) }}</td>
          <td class="text-end">{{ (ct.sprice ?? 0).toLocaleString() }}</td>
          <td class="text-center">
            <i :class="ct.cartCf ? 'bi bi-check-lg' : 'bi bi-dash'"></i>
          </td>
          <td class="text-center">
            <i class="bi-x-lg text-danger"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

axios.defaults.withCredentials = true;

const cart = ref([]);
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
  await getCartList();
});

const getCartList = async () => {
  let customer = { id: memEmail.value };
  await axios.post("http://localhost:3000/carts/getcartbycus", customer)
    .then(res => {
      cart.value = res.data;
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
</script>
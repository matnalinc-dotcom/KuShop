<template>
  <div v-if="qty > 0 && cartId">
    <button class="btn btn-warning text-dark fw-bold btn-sm shadow-sm" @click="router.push(`/cartshow/${cartId}`)">
      <i class="bi bi-cart-fill"></i> {{ cartId }} [{{ qty }} ชิ้น] {{ (money ?? 0).toLocaleString() }} ฿
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';

axios.defaults.withCredentials = true;

const router = useRouter();
const cartStore = useCartStore();

const memEmail = ref(null);
const cartId = ref(null);
const qty = ref(0);
const money = ref(0);

const refreshCart = async () => {
  await getMember();
  if (!memEmail.value) {
    qty.value = 0;
    cartId.value = null;
    return;
  }
  await chkCart();
  if (cartId.value) {
    await sumCart(cartId.value);
  } else {
    qty.value = 0;
    money.value = 0;
  }
};

watch(() => cartStore.theQty, async () => {
  await refreshCart();
});

onMounted(async () => {
  await refreshCart();
});

const chkCart = async () => {
  if (!memEmail.value) return;
  let members = { memEmail: memEmail.value };
  try {
    const response = await axios.post("/carts/chkcart", members);
    if (response.data.cartExist) {
      cartId.value = response.data.cartId;
    } else {
      cartId.value = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const getMember = async () => {
  try {
    const res = await axios.get("/members/detail");
    memEmail.value = res.data.memEmail;
  } catch (err) {
    memEmail.value = null;
  }
};

const sumCart = async (cid) => {
  if (!cid) return;
  try {
    const res = await axios.get(`/carts/sumcart/${cid}`);
    cartId.value = res.data.id;
    qty.value = res.data.qty;
    money.value = res.data.money;
  } catch (err) {
    console.error(err);
  }
};
</script>

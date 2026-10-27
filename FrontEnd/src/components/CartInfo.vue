<template>
  <div v-if="qty > 0">
    <button class="btn btn-success text-white" @click="router.push(`/cartshow/${cartId}`)">
      {{ cartId }} [{{ qty }}] {{ money }}B
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
const cartId = ref();
const qty = ref(0);
const money = ref(0);
const id = ref(null);

watch(() => cartStore.theQty, () => {
  id.value = cartStore.cartId;
  console.log("Watch Cart:" + id.value);
  sumCart(id.value);
});

onMounted(async () => {
  await getMember();
  await chkCart();
  await sumCart(cartId.value);
});

const chkCart = async () => {
  let members = { memEmail: memEmail.value };
  try {
    const response = await axios.post("http://localhost:3000/carts/chkcart", members);
    cartId.value = response.data.cartId;
  } catch (err) {
    console.log(err);
  }
};

const getMember = async () => {
  await axios.get("http://localhost:3000/members/detail")
    .then((res) => {
      memEmail.value = res.data.memEmail;
    })
    .catch(err => console.log(err.message));
};

const sumCart = async (cid) => {
  if (!cid) return;
  await axios.get(`http://localhost:3000/carts/sumcart/${cid}`)
    .then(res => {
      cartId.value = res.data.id;
      qty.value = res.data.qty;
      money.value = res.data.money;
    })
    .catch(err => { console.error(err); });
};
</script>
<template>
  <div class="container mt-4">
    <div class="p-5 mb-4 bg-light rounded-3 text-center">
      <img
        src="https://th.bing.com/th/id/OIP.abTsUnMRCImGmdATN9zskwHaHV?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="KU Shop"
        class="img-fluid mb-3"
        style="max-width:150px;"
      />

      <h1 class="display-5 fw-bold">ยินดีต้อนรับสู่ Kushop</h1>
      <p class="fs-4">ร้านค้าออนไลน์รวมสินค้าราคาพิเศษ</p>

      <router-link to="/product" class="btn btn-primary btn-lg mb-4">
        ดูรายการสินค้าทั้งหมด
      </router-link>
    </div>

    <h3 class="mb-3">สินค้าแนะนำ</h3>

    <div class="row">
      <div
        v-for="pd in products"
        :key="pd.pdId"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div class="card h-100">
          <img
            :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
            class="card-img-top p-2"
            :alt="pd.pdName"
          />

          <div class="card-body">
            <h5>{{ pd.pdName }}</h5>
            <p>{{ pd.brand.brandName }}</p>
            <p class="fw-bold text-primary">{{ pd.pdPrice }} บาท</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const products = ref([]);

onMounted(async () => {
  const res = await axios.get("http://localhost:3000/products/three");
  products.value = res.data;
});
</script>

<style scoped>
.card-img-top {
  height: 220px;
  object-fit: contain;
}
</style>
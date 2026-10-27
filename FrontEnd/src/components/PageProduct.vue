<template>
  <div class="container mt-4">

    <!-- Search -->
    <form @submit.prevent="searchProduct()">
      <div class="row mb-4 align-items-center">
        <div class="h1 col-md-6 col-sm-12 text-danger">
          ผลิตภัณฑ์ของเรา
        </div>

        <div class="col-md-4 col-sm-6">
          <input
            type="text"
            class="form-control"
            v-model="stext"
            placeholder="ค้นหาสินค้า..."
          />
        </div>

        <div class="col">
          <button class="btn btn-primary" type="submit">
            ค้นหา
          </button>
        </div>
      </div>
    </form>

    <!-- Product List -->
    <div class="row">
      <div
        v-for="(pd, index) in products"
        :key="index"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div
          class="card h-100"
          style="background-color:#EEEEEE;"
        >
          <img
            :src="`http://localhost:3000/img_pd/${pd.pdId}.jpg`"
            class="card-img-top p-2"
            :alt="pd.pdName"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ pd.pdName }}</h5>

            <p class="card-text">
              {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}
            </p>

            <p class="card-text fw-bold text-primary">
              {{ pd.pdPrice }} บาท
            </p>

            <!-- ✅ แก้ไขเป็น router-link เพื่อส่ง pd.pdId ไปยัง ProductShow -->
            <router-link 
              :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }" 
              class="mt-auto text-decoration-none"
            >
              <button class="btn btn-primary w-100">
                <i class="bi bi-eye-fill"></i> ดูรายละเอียด
              </button>
            </router-link>
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
const stext = ref("");

const loadProducts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/products");
    products.value = res.data;
  } catch (err) {
    console.log(err.message);
  }
};

const searchProduct = async () => {
  try {
    if (stext.value.trim() === "") {
      await loadProducts();
      return;
    }

    const res = await axios.get(
      `http://localhost:3000/products/search/${stext.value}`
    );

    products.value = res.data;
  } catch (err) {
    console.log(err.message);
  }
};

onMounted(async () => {
  await loadProducts();
});
</script>

<style scoped>
.card-img-top {
  height: 220px;
  object-fit: contain;
}

.card {
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}
</style>
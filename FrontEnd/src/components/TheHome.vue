<template>
  <div class="container mt-4">
    <div class="p-5 mb-4 bg-light rounded-3 text-center shadow-sm">
      <img
        src="https://th.bing.com/th/id/OIP.abTsUnMRCImGmdATN9zskwHaHV?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="KU Shop"
        class="img-fluid mb-3"
        style="max-width:140px;"
      />

      <h1 class="display-5 fw-bold text-success">ยินดีต้อนรับสู่ KuShop</h1>
      <p class="fs-4 text-muted">ร้านค้าออนไลน์รวมสินค้าที่ระลึกมหาวิทยาลัยเกษตรศาสตร์</p>

      <router-link to="/product" class="btn btn-primary btn-lg mb-2 shadow-sm">
        <i class="bi bi-shop"></i> ดูรายการสินค้าทั้งหมด
      </router-link>
    </div>

    <h3 class="mb-3 text-primary fw-bold"><i class="bi bi-star-fill text-warning"></i> สินค้าแนะนำ</h3>

    <div class="row">
      <div
        v-for="pd in products"
        :key="pd.pdId"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div class="card h-100 shadow-sm border-0">
          <img
            :src="`/img_pd/${pd.pdId}.jpg`"
            class="card-img-top p-2"
            :alt="pd.pdName"
            @error="handleImgError"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">{{ pd.pdName }}</h5>
            <p class="text-muted mb-1">{{ pd.brand?.brandName || "KU" }}</p>
            <p class="fw-bold text-primary fs-5">{{ pd.pdPrice }} บาท</p>
            
            <router-link
              :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }"
              class="mt-auto btn btn-outline-primary"
            >
              <i class="bi bi-eye"></i> ดูรายละเอียด
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

const handleImgError = (e) => {
  e.target.src = "https://via.placeholder.com/300x220?text=KU+Shop";
};

onMounted(async () => {
  try {
    const res = await axios.get("/products/three");
    products.value = res.data;
  } catch (err) {
    console.error("Failed to load top 3 products:", err);
  }
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

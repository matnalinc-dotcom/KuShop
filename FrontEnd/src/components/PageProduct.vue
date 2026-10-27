<template>
  <div class="container mt-4">

    <!-- Header & Search & Admin Add Button -->
    <div class="row mb-4 align-items-center">
      <div class="h1 col-md-5 col-sm-12 text-danger">
        ผลิตภัณฑ์ของเรา
      </div>

      <div class="col-md-4 col-sm-8 mt-2 mt-md-0">
        <form @submit.prevent="searchProduct()" class="d-flex gap-2">
          <input
            type="text"
            class="form-control"
            v-model="stext"
            placeholder="ค้นหาสินค้า..."
          />
          <button class="btn btn-primary" type="submit">
            ค้นหา
          </button>
        </form>
      </div>

      <!-- 💡 ปุ่มเพิ่มสินค้าใหม่สำหรับ Admin เท่านั้น -->
      <div class="col-md-3 col-sm-4 text-end mt-2 mt-md-0" v-if="dutyId === 'admin'">
        <button class="btn btn-success" @click="openAddModal">
          <i class="bi bi-plus-circle"></i> + เพิ่มสินค้าใหม่
        </button>
      </div>
    </div>

    <!-- Product List -->
    <div class="row">
      <div
        v-for="(pd, index) in products"
        :key="pd.pdId || index"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div
          class="card h-100 shadow-sm"
          style="background-color:#EEEEEE;"
        >
          <img
            :src="`/img_pd/${pd.pdId}.jpg?t=${imgTimestamp}`"
            class="card-img-top p-2"
            :alt="pd.pdName"
            @error="handleImgError"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ pd.pdName }}</h5>

            <p class="card-text text-muted mb-1">
              {{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}
            </p>

            <p class="card-text fw-bold text-primary fs-5">
              {{ pd.pdPrice }} บาท
            </p>

            <div class="mt-auto d-flex gap-2">
              <router-link 
                :to="{ name: 'ProductShow', params: { pdId: pd.pdId } }" 
                class="flex-grow-1 text-decoration-none"
              >
                <button class="btn btn-primary w-100">
                  <i class="bi bi-eye-fill"></i> ดูรายละเอียด
                </button>
              </router-link>

              <!-- ปุ่มลบสินค้า สำหรับ Admin -->
              <button
                v-if="dutyId === 'admin'"
                class="btn btn-outline-danger"
                title="ลบสินค้านี้"
                @click="deleteProduct(pd.pdId)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="products.length === 0" class="col-12 text-center py-5 text-muted">
        <h4>ไม่พบสินค้าที่ตรงกับคำค้นหา</h4>
      </div>
    </div>

    <!-- 💡 Modal เพิ่มสินค้าใหม่ (Admin) -->
    <div v-if="showAddModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title fw-bold"><i class="bi bi-plus-square"></i> เพิ่มสินค้าใหม่ (Admin)</h5>
            <button type="button" class="btn-close btn-close-white" @click="showAddModal = false"></button>
          </div>
          <form @submit.prevent="submitAddProduct">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">รหัสสินค้า (เช่น 007 หรือ P007):</label>
                <input type="text" class="form-control" v-model="addForm.pdId" required placeholder="007" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ชื่อสินค้า:</label>
                <input type="text" class="form-control" v-model="addForm.pdName" required placeholder="KU Mug" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ราคา (บาท):</label>
                <input type="number" step="any" class="form-control" v-model="addForm.pdPrice" required placeholder="199" />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ยี่ห้อ (Brand):</label>
                <select class="form-select" v-model="addForm.brandId">
                  <option v-for="b in brands" :key="b.brandId" :value="b.brandId">{{ b.brandName }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ประเภทสินค้า (Type):</label>
                <select class="form-select" v-model="addForm.pdTypeId">
                  <option v-for="t in pdTypes" :key="t.pdTypeId" :value="t.pdTypeId">{{ t.pdTypeName }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">รายละเอียด (Remark):</label>
                <textarea class="form-control" rows="2" v-model="addForm.Remark" placeholder="รายละเอียดสินค้า"></textarea>
              </div>
              <div class="mb-3 border-top pt-3">
                <label class="form-label fw-bold text-primary"><i class="bi bi-image"></i> รูปภาพสินค้า (JPG):</label>
                <input type="file" class="form-control" accept="image/*" @change="onAddFileChange" />
              </div>

              <div v-if="addMessage" class="alert alert-info py-2">
                {{ addMessage }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showAddModal = false">ยกเลิก</button>
              <button type="submit" class="btn btn-success" :disabled="adding">
                {{ adding ? 'กำลังบันทึก...' : 'เพิ่มสินค้า' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;

const products = ref([]);
const stext = ref("");
const dutyId = ref(null);
const imgTimestamp = ref(Date.now());

// Admin Add Modal variables
const showAddModal = ref(false);
const adding = ref(false);
const addMessage = ref('');
const addFile = ref(null);
const brands = ref([]);
const pdTypes = ref([]);
const addForm = ref({
  pdId: '',
  pdName: '',
  pdPrice: '',
  brandId: '',
  pdTypeId: '',
  Remark: ''
});

const handleImgError = (e) => {
  e.target.src = "https://via.placeholder.com/300x220?text=KU+Shop";
};

const loadProducts = async () => {
  try {
    const res = await axios.get("/products");
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
      `/products/search/${stext.value}`
    );

    products.value = res.data;
  } catch (err) {
    console.log(err.message);
  }
};

const checkDuty = async () => {
  try {
    const res = await axios.get("/members/detail");
    dutyId.value = res.data.dutyId || 'member';
  } catch (_) {}
};

const openAddModal = () => {
  addForm.value = {
    pdId: '',
    pdName: '',
    pdPrice: '',
    brandId: brands.value[0]?.brandId || 'B01',
    pdTypeId: pdTypes.value[0]?.pdTypeId || 'T01',
    Remark: ''
  };
  addFile.value = null;
  addMessage.value = '';
  showAddModal.value = true;
};

const onAddFileChange = (e) => {
  addFile.value = e.target.files[0];
};

const submitAddProduct = async () => {
  adding.value = true;
  addMessage.value = 'กำลังบันทึกสินค้า...';

  try {
    await axios.post("/products", {
      pdId: addForm.value.pdId,
      pdName: addForm.value.pdName,
      pdPrice: Number(addForm.value.pdPrice),
      brandId: addForm.value.brandId,
      pdTypeId: addForm.value.pdTypeId,
      Remark: addForm.value.Remark
    });

    if (addFile.value) {
      addMessage.value = 'กำลังอัปโหลดรูปภาพสินค้า...';
      const formData = new FormData();
      formData.append("pdId", addForm.value.pdId);
      formData.append("file", addFile.value);
      await axios.post("/products/uploadimg", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    imgTimestamp.value = Date.now();
    await loadProducts();
    showAddModal.value = false;
    alert("เพิ่มสินค้าใหม่สำเร็จเรียบร้อย!");
  } catch (err) {
    addMessage.value = "เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message);
  } finally {
    adding.value = false;
  }
};

const deleteProduct = async (delId) => {
  if (confirm(`ยืนยันลบสินค้ารหัส ${delId}?`)) {
    try {
      await axios.delete(`/products/${delId}`);
      await loadProducts();
      alert("ลบสินค้าสำเร็จ");
    } catch (err) {
      alert("ลบสินค้าไม่สำเร็จ: " + err.message);
    }
  }
};

onMounted(async () => {
  await Promise.all([loadProducts(), checkDuty()]);

  // Load brands and types
  try {
    const [bRes, tRes] = await Promise.all([
      axios.get("/products/meta/brands"),
      axios.get("/products/meta/types")
    ]);
    brands.value = bRes.data;
    pdTypes.value = tRes.data;
  } catch (_) {}
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

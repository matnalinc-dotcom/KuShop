<template>
  <div class="container">
    <div v-for="(pd, pdIdx) in products" :key="pd.pdId || pdIdx" class="mt-5">
      <div class="row">
        <div class="col-md-6 col-sm-12">
          <div class="card mx-auto mb-3 text-center p-2" style="width: 18rem">
            <img
              :src="`/img_pd/${pd.pdId}.jpg?t=${imgTimestamp}`"
              :alt="pd.pdName"
              class="rounded shadow-sm img-fluid"
              @error="handleImgError"
            >
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
                <td><h5>{{ pd.pdPrice }} บาท</h5></td>
              </tr>
              <tr>
                <td><h5>ยี่ห้อ</h5></td>
                <td><h5>{{ pd.brand?.brandName || "ไม่ระบุยี่ห้อ" }}</h5></td>
              </tr>
              <tr>
                <td><h5>รายละเอียด</h5></td>
                <td><h5>{{ pd.Remark || "-" }}</h5></td>
              </tr>
            </tbody>
          </table>

          <!-- ปุ่มใส่ตะกร้า (สำหรับสมาชิกทุกคน) -->
          <button class="btn btn-primary" @click="chkLogin()">
            <i class="bi bi-cart lead"></i> ใส่ตะกร้า&nbsp;
          </button>

          <!-- 💡 ปุ่มแก้ไขสินค้า: แสดงเฉพาะ Admin เท่านั้น (ตามข้อกำหนด PDF) -->
          <button
            v-if="dutyId === 'admin'"
            class="btn btn-warning float-end"
            @click="openEditModal(pd)"
          >
            <i class="bi bi-pencil-fill lead"></i> แก้ไขสินค้า (Admin)&nbsp;&nbsp;
          </button>
        </div>
      </div>
    </div>

    <!-- 💡 Modal / กล่องฟอร์มแก้ไขข้อมูลสินค้าสำหรับ Admin -->
    <div v-if="showEditModal" class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title fw-bold"><i class="bi bi-pencil-square"></i> แก้ไขข้อมูลสินค้า [{{ editForm.pdId }}]</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <form @submit.prevent="saveEditProduct">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-bold">ชื่อสินค้า:</label>
                <input type="text" class="form-control" v-model="editForm.pdName" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ราคา (บาท):</label>
                <input type="number" step="any" class="form-control" v-model="editForm.pdPrice" required />
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ยี่ห้อ (Brand):</label>
                <select class="form-select" v-model="editForm.brandId">
                  <option v-for="b in brands" :key="b.brandId" :value="b.brandId">{{ b.brandName }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">ประเภทสินค้า (Type):</label>
                <select class="form-select" v-model="editForm.pdTypeId">
                  <option v-for="t in pdTypes" :key="t.pdTypeId" :value="t.pdTypeId">{{ t.pdTypeName }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">รายละเอียด (Remark):</label>
                <textarea class="form-control" rows="3" v-model="editForm.Remark"></textarea>
              </div>

              <div class="mb-3 border-top pt-3">
                <label class="form-label fw-bold text-primary"><i class="bi bi-image"></i> เปลี่ยนรูปภาพสินค้า (JPG):</label>
                <input type="file" class="form-control" accept="image/*" @change="onEditFileChange" />
              </div>

              <div v-if="editMessage" class="alert alert-info py-2">
                {{ editMessage }}
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEditModal = false">ยกเลิก</button>
              <button type="submit" class="btn btn-success" :disabled="saving">
                {{ saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
              </button>
            </div>
          </form>
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
const dutyId = ref(null);
const cartId = ref(null);
const backendMessage = ref(null);
const imgTimestamp = ref(Date.now());

// Admin Edit Variables
const showEditModal = ref(false);
const saving = ref(false);
const editMessage = ref('');
const editFile = ref(null);
const brands = ref([]);
const pdTypes = ref([]);
const editForm = ref({
  pdId: '',
  pdName: '',
  pdPrice: 0,
  brandId: '',
  pdTypeId: '',
  Remark: ''
});

const loadProduct = async (searchId) => {
  try {
    const res = await axios.get(`/products/${searchId}`);
    if (Array.isArray(res.data)) {
      products.value = res.data;
    } else if (res.data) {
      products.value = [res.data];
    }
  } catch (err) {
    // If not found and starts with P, try without P or vice versa
    if (searchId.startsWith('P') || searchId.startsWith('p')) {
      const stripped = searchId.substring(1);
      try {
        const res2 = await axios.get(`/products/${stripped}`);
        products.value = Array.isArray(res2.data) ? res2.data : [res2.data];
      } catch (_) {}
    }
  }
};

const handleImgError = (e) => {
  e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
};

onMounted(async () => {
  id.value = route.params.pdId;
  await loadProduct(id.value);

  // Get current user info & duty
  try {
    const res = await axios.get("/members/detail");
    login.value = res.data.login;
    memEmail.value = res.data.memEmail;
    dutyId.value = res.data.dutyId || 'member';
  } catch (err) {
    console.log(err.message);
  }

  // Load brands and types for admin edit
  try {
    const [bRes, tRes] = await Promise.all([
      axios.get("/products/meta/brands"),
      axios.get("/products/meta/types")
    ]);
    brands.value = bRes.data;
    pdTypes.value = tRes.data;
  } catch (_) {}
});

const openEditModal = (pd) => {
  editForm.value = {
    pdId: pd.pdId,
    pdName: pd.pdName,
    pdPrice: pd.pdPrice,
    brandId: pd.brandId || (brands.value[0]?.brandId || 'B01'),
    pdTypeId: pd.pdTypeId || (pdTypes.value[0]?.pdTypeId || 'T01'),
    Remark: pd.Remark || ''
  };
  editFile.value = null;
  editMessage.value = '';
  showEditModal.value = true;
};

const onEditFileChange = (e) => {
  editFile.value = e.target.files[0];
};

const saveEditProduct = async () => {
  saving.value = true;
  editMessage.value = 'กำลังบันทึกข้อมูล...';

  try {
    // 1. Update text details
    await axios.put(`/products/${editForm.value.pdId}`, {
      pdName: editForm.value.pdName,
      pdPrice: Number(editForm.value.pdPrice),
      brandId: editForm.value.brandId,
      pdTypeId: editForm.value.pdTypeId,
      Remark: editForm.value.Remark
    });

    // 2. Upload image if selected
    if (editFile.value) {
      editMessage.value = 'กำลังอัปโหลดรูปภาพใหม่...';
      const formData = new FormData();
      formData.append("pdId", editForm.value.pdId);
      formData.append("file", editFile.value);
      await axios.post("/products/uploadimg", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }

    imgTimestamp.value = Date.now();
    await loadProduct(editForm.value.pdId);
    showEditModal.value = false;
    alert("แก้ไขข้อมูลและรูปภาพสินค้าสำเร็จเรียบร้อย!");
  } catch (err) {
    editMessage.value = "เกิดข้อผิดพลาด: " + err.message;
  } finally {
    saving.value = false;
  }
};

const chkLogin = async () => {
  await axios.get("/members/detail")
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
    const response = await axios.post("/carts/chkcart", members);
    cartId.value = response.data.cartId;
  } catch (err) {
    console.log(err);
  }
};

const addCart = async () => {
  let customer = { cusId: memEmail.value };
  try {
    const response = await axios.post("/carts/addcart", customer);
    backendMessage.value = response.data.messageAddCart;
    cartId.value = response.data.messageAddCart;
  } catch (err) {
    console.log(err);
  }
};

const addCartDtl = async () => {
  const currentPd = products.value[0];
  let cartdtl = {
    cartId: cartId.value,
    pdId: currentPd.pdId,
    pdPrice: currentPd.pdPrice
  };
  try {
    const response = await axios.post("/carts/addcartdtl", cartdtl);
    cartStore.updateQty();
    cartStore.setId(cartId.value);
    backendMessage.value = response.data.messageAddCartDtl;
    alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้ว");
  } catch (err) {
    console.log(err);
  }
};
</script>

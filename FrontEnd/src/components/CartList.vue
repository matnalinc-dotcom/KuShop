<template>
  <div class="container mt-4">
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
      <div>
        <h2 class="fw-bold text-primary mb-1">
          <i class="bi bi-clock-history"></i> รายการคำสั่งซื้อ / ตะกร้าสินค้า
        </h2>
        <span class="text-muted" v-if="selectedCustomer">
          กำลังแสดงข้อมูลของ: <strong>{{ selectedCustomer }}</strong>
        </span>
      </div>

      <!-- 💡 เมนูตัวเลือกสำหรับ Admin (สลับดูลูกค้าแต่ละคน หรือดูทั้งหมด) -->
      <div v-if="dutyId === 'admin'" class="d-flex align-items-center gap-2 mt-2 mt-md-0">
        <label class="fw-bold text-danger mb-0">Admin ดูข้อมูลลูกค้า:</label>
        <select class="form-select form-select-sm w-auto" v-model="selectedCustomer" @change="onCustomerChange">
          <option value="ALL">-- ดูคำสั่งซื้อทั้งหมดในระบบ --</option>
          <option v-for="m in memberList" :key="m.memEmail" :value="m.memEmail">
            {{ m.memEmail }} ({{ m.memName }})
          </option>
        </select>
      </div>
    </div>

    <!-- Table of Orders -->
    <div class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th>#</th>
              <th>เลขที่คำสั่งซื้อ</th>
              <th v-if="dutyId === 'admin' && selectedCustomer === 'ALL'">ลูกค้า (Customer)</th>
              <th>วันที่สั่งซื้อ</th>
              <th class="text-center">จำนวนชิ้น</th>
              <th class="text-end">ยอดเงินรวม</th>
              <th class="text-center">สถานะยืนยัน (CF)</th>
              <th class="text-center">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ct, idx) in cart" :key="ct.cartId || idx">
              <td>{{ ct.row_number || (idx + 1) }}</td>
              <td class="fw-bold">
                <router-link :to="`/cartshow/${ct.cartId}`" class="text-decoration-none">
                  {{ ct.cartId }}
                </router-link>
              </td>
              <td v-if="dutyId === 'admin' && selectedCustomer === 'ALL'">
                <span class="badge bg-secondary">{{ ct.cusId }}</span>
              </td>
              <td>{{ formattedDate(ct.cartDate) }}</td>
              <td class="text-center">{{ ct.sqty ?? 0 }}</td>
              <td class="text-end fw-bold text-success">{{ (ct.sprice ?? 0).toLocaleString() }} บาท</td>
              <td class="text-center">
                <span
                  class="badge px-3 py-1"
                  :class="ct.cartCf ? 'bg-success' : 'bg-warning text-dark'"
                >
                  <i :class="ct.cartCf ? 'bi bi-check-circle-fill' : 'bi bi-hourglass-split'"></i>
                  {{ ct.cartCf ? 'ยืนยันสั่งซื้อแล้ว' : 'ยังไม่ยืนยัน' }}
                </span>
              </td>
              <td class="text-center">
                <router-link :to="`/cartshow/${ct.cartId}`" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-eye"></i> ดูใบสั่งซื้อ
                </router-link>
              </td>
            </tr>

            <tr v-if="cart.length === 0">
              <td colspan="8" class="text-center py-5 text-muted">
                <h5>ไม่พบรายการคำสั่งซื้อ</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

axios.defaults.withCredentials = true;

const route = useRoute();

const cart = ref([]);
const memEmail = ref(null);
const dutyId = ref(null);
const selectedCustomer = ref('');
const memberList = ref([]);

const formattedDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMember = async () => {
  try {
    const res = await axios.get("/members/detail");
    memEmail.value = res.data.memEmail;
    dutyId.value = res.data.dutyId || 'member';
  } catch (err) {
    console.log(err.message);
  }
};

const loadMemberList = async () => {
  if (dutyId.value === 'admin') {
    try {
      const res = await axios.get("/members/all");
      memberList.value = res.data;
    } catch (_) {}
  }
};

const getCartList = async () => {
  if (dutyId.value === 'admin' && selectedCustomer.value === 'ALL') {
    try {
      const res = await axios.get("/carts/all");
      cart.value = res.data;
    } catch (err) {
      console.error(err);
    }
    return;
  }

  const targetCustomer = selectedCustomer.value || memEmail.value;
  if (!targetCustomer) return;

  try {
    const res = await axios.post("/carts/getcartbycus", { id: targetCustomer });
    cart.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const onCustomerChange = async () => {
  await getCartList();
};

onMounted(async () => {
  await getMember();
  await loadMemberList();

  // If query parameter cusId exists (e.g. from AdminMembers page)
  if (route.query.cusId) {
    selectedCustomer.value = route.query.cusId;
  } else {
    selectedCustomer.value = memEmail.value;
  }

  await getCartList();
});

watch(() => route.query.cusId, async (newVal) => {
  if (newVal) {
    selectedCustomer.value = newVal;
    await getCartList();
  }
});
</script>

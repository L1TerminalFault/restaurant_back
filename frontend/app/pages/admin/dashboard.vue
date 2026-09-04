<template>
  <div class="dash-root">
    <!-- Toast -->
    <div v-if="toast.show" class="toast-container">
      <i class="fa-solid fa-circle-check"></i>
      <span v-text="toast.message"></span>
    </div>

    <!-- SuperAdmin Auth Overlay -->
    <template v-if="!isLoggedInSuperAdmin">
      <div
        class="min-h-screen flex items-center justify-center p-4 bg-[#050806] text-white"
      >
        <div
          class="bg-[#0c1611] border border-emerald-900/60 p-8 rounded-3xl max-w-md w-full shadow-2xl text-center"
        >
          <div
            class="h-16 w-16 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center mx-auto mb-4"
          >
            <i class="fa-solid fa-user-shield text-2xl text-emerald-400"></i>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">
            MASTER ADMIN PORTAL
          </h2>
          <p class="text-xs text-emerald-400 mt-1 mb-6">
            Enter SuperAdmin Credentials to Access Master Dashboard
          </p>

          <form @submit.prevent="loginSuperAdmin" class="space-y-4 text-left">
            <div>
              <label
                class="block text-xs font-bold text-zinc-300 uppercase mb-1"
                >SuperAdmin Email</label
              >
              <input
                type="email"
                v-model="superAdminEmail"
                placeholder="admin@awaze.et"
                class="w-full bg-[#050806] border border-emerald-900 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label
                class="block text-xs font-bold text-zinc-300 uppercase mb-1"
                >Master Password / PIN</label
              >
              <input
                type="password"
                v-model="superAdminPassword"
                placeholder="Enter password (Default: 1234)"
                class="w-full bg-[#050806] border border-emerald-900 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm py-3 rounded-xl transition shadow-lg cursor-pointer"
            >
              Login to Master Dashboard
            </button>
          </form>
          <div class="mt-4 text-xs text-zinc-500">
            Default Password: <strong class="text-emerald-400">1234</strong>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="dash-layout">
        <!-- SIDEBAR -->
        <aside class="dash-sidebar">
          <div class="sidebar-top">
            <div class="brand-logo">
              <div class="brand-icon"><i class="fa-solid fa-utensils"></i></div>
              <div>
                <span class="brand-name">AWAZE</span
                ><span class="brand-sub">Main Dashboard</span>
              </div>
            </div>
            <nav class="sidebar-nav">
              <button
                v-for="tab in navTabs"
                :key="tab.id"
                @click="currentTab = tab.id"
                :class="['nav-btn', currentTab === tab.id && 'active']"
              >
                <div class="nav-btn-left">
                  <i :class="tab.icon"></i><span>{{ tab.label }}</span>
                </div>
                <span v-if="tab.badge" :class="['nav-badge', tab.badgeColor]">{{
                  tab.badge
                }}</span>
              </button>
            </nav>
          </div>
          <div class="sidebar-bottom flex flex-col gap-2">
            <button
              @click="logoutSuperAdmin"
              class="w-full py-2 px-3 bg-red-950/60 border border-red-800 text-xs font-bold text-red-300 rounded-xl hover:bg-red-900 transition text-left flex items-center space-x-2"
            >
              <i class="fa-solid fa-right-from-bracket"></i>
              <span>Logout Master</span>
            </button>
            <div class="system-status">
              <span class="status-dot"></span><span>Awaze Core v3.4</span
              ><span class="status-live">Live</span>
            </div>
          </div>
        </aside>

        <!-- MAIN -->
        <main class="dash-main">
          <header class="dash-header">
            <div>
              <h1 class="header-title">
                Welcome, Admin <span class="header-badge">Master</span>
              </h1>
              <p class="header-sub">Operational Overview</p>
            </div>
            <div class="header-tools">
              <div class="header-tabs">
                <button
                  v-for="t in ['dashboard', 'restaurants', 'revenue']"
                  :key="t"
                  @click="currentTab = t"
                  :class="['htab', currentTab === t && 'active']"
                >
                  {{
                    t === "dashboard"
                      ? "Overview"
                      : t.charAt(0).toUpperCase() + t.slice(1)
                  }}
                </button>
              </div>
            </div>
          </header>

          <div class="dash-content">
            <!-- TAB: DASHBOARD -->
            <div v-show="currentTab === 'dashboard'" class="tab-section">
              <div class="metrics-grid-top">
                <div class="metric-card purple">
                  <div class="metric-header">
                    <span
                      ><i class="fa-solid fa-store"></i> Total Restaurants</span
                    >
                  </div>
                  <div class="metric-value">
                    {{ restaurants.length }}
                    <span class="metric-change">+14.2%</span>
                  </div>
                  <p class="metric-sub">Total registered venue partners</p>
                </div>
                <div class="mini-metrics">
                  <div
                    class="mini-card"
                    v-for="m in miniMetrics"
                    :key="m.label"
                  >
                    <div class="mini-header">
                      <span>{{ m.label }}</span
                      ><i :class="m.icon"></i>
                    </div>
                    <div class="mini-value">{{ m.value }}</div>
                    <span class="mini-sub" :style="{ color: m.color }">{{
                      m.sub
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="chart-card">
                <h3>Platform Menu Views & Revenue Trajectory</h3>
                <div class="chart-wrap"><canvas ref="perfChart"></canvas></div>
              </div>
            </div>

            <!-- TAB: RESTAURANTS -->
            <div v-show="currentTab === 'restaurants'" class="tab-section">
              <div class="table-header">
                <div>
                  <h2>Restaurant Management Portfolio</h2>
                  <p>Manage, edit, suspend, or add new partners</p>
                </div>
                <div class="table-filters">
                  <input
                    v-model="tableSearch"
                    placeholder="Search restaurant..."
                    class="filter-input"
                  />
                  <select v-model="filterPlan" class="filter-select">
                    <option value="all">All Plans</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                  <select v-model="filterStatus" class="filter-select">
                    <option value="all">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <button @click="openAddModal" class="add-btn">
                    <i class="fa-solid fa-plus"></i> Add Restaurant
                  </button>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Foods</th>
                      <th>Drinks</th>
                      <th>Views</th>
                      <th>Location</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="rest in filteredRestaurants" :key="rest.id">
                      <td>
                        <div class="rest-name-cell">
                          <div class="rest-avatar">
                            {{ rest.name.charAt(0) }}
                          </div>
                          <div>
                            <div class="rest-name">{{ rest.name }}</div>
                            <div class="rest-owner">Link: {{ rest.id }}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          :class="[
                            'pill',
                            rest.plan === 'Premium' ? 'purple' : 'blue',
                          ]"
                          >{{ rest.plan }}</span
                        >
                      </td>
                      <td>
                        <span
                          :class="[
                            'pill',
                            rest.status === 'Active'
                              ? 'green'
                              : rest.status === 'Expired'
                                ? 'amber'
                                : 'red',
                          ]"
                          >{{ rest.status }}</span
                        >
                      </td>
                      <td class="center">{{ rest.foodsCount }}</td>
                      <td class="center">{{ rest.drinksCount }}</td>
                      <td class="right">
                        {{ rest.viewsThisMonth.toLocaleString() }}
                      </td>
                      <td>{{ rest.location }}</td>
                      <td>{{ rest.phone }}</td>
                      <td class="center">
                        <div class="action-btns">
                          <button
                            @click="openRestaurantDashboard(rest)"
                            title="Open Dashboard (Logged In)"
                          >
                            <i class="fa-solid fa-right-to-bracket"></i>
                          </button>
                          <button
                            @click="openQrModal(rest)"
                            title="Generate QR Code"
                          >
                            <i class="fa-solid fa-qrcode"></i>
                          </button>
                          <button
                            @click="openDetailsModal(rest)"
                            title="View Details"
                          >
                            <i class="fa-solid fa-eye"></i>
                          </button>
                          <button @click="openEditModal(rest)" title="Edit">
                            <i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button @click="toggleSuspend(rest)" title="Suspend">
                            <i class="fa-solid fa-ban"></i>
                          </button>
                          <button @click="confirmDelete(rest)" title="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB: REVENUE -->
            <div v-show="currentTab === 'revenue'" class="tab-section">
              <div class="rev-metrics">
                <div
                  class="rev-card"
                  v-for="rm in revMetricCards"
                  :key="rm.label"
                >
                  <span class="rev-label">{{ rm.label }}</span>
                  <div class="rev-value">{{ rm.value }}</div>
                  <span class="rev-sub" :style="{ color: rm.color }">{{
                    rm.sub
                  }}</span>
                </div>
              </div>
              <div class="chart-row">
                <div class="chart-card wide">
                  <h3>Revenue Breakdown by Source</h3>
                  <div class="chart-wrap"><canvas ref="revChart"></canvas></div>
                </div>
                <div class="chart-card narrow">
                  <h3>Plan Distribution</h3>
                  <div class="chart-wrap">
                    <canvas ref="planChart"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB: MANAGEMENT -->
            <div v-show="currentTab === 'management'" class="tab-section">
              <div class="mgmt-cards">
                <div class="mgmt-card green">
                  <span>Who Paid</span>
                  <div class="mgmt-value">{{ paidCount }}</div>
                  <p>Subscriptions active & up-to-date</p>
                </div>
                <div class="mgmt-card red">
                  <span>Who Didn't Pay</span>
                  <div class="mgmt-value">{{ unpaidCount }}</div>
                  <p>Pending or past-due renewal</p>
                </div>
                <div class="mgmt-card purple">
                  <span>Upcoming Renewals</span>
                  <div class="mgmt-value">{{ upcomingRenewalsCount }}</div>
                  <p>Due within next 7 days</p>
                </div>
              </div>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Restaurant</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pay in filteredPayments" :key="pay.id">
                      <td class="mono purple-text">{{ pay.id }}</td>
                      <td class="bold">{{ pay.restaurantName }}</td>
                      <td>{{ pay.plan }}</td>
                      <td class="bold">{{ pay.amount }} ETB</td>
                      <td>
                        <span
                          :class="[
                            'pill',
                            pay.status === 'Paid' ? 'green' : 'red',
                          ]"
                          >{{ pay.status }}</span
                        >
                      </td>
                      <td class="muted">{{ pay.date }}</td>
                      <td class="center">
                        <button
                          @click="togglePaymentStatus(pay)"
                          :class="[
                            'action-toggle',
                            pay.status === 'Paid' ? 'muted' : 'active',
                          ]"
                        >
                          {{
                            pay.status === "Paid"
                              ? "Mark Unpaid"
                              : "Mark as Paid"
                          }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB: ANALYTICS -->
            <div v-show="currentTab === 'analytics'" class="tab-section">
              <div class="rev-metrics">
                <div class="rev-card">
                  <span class="rev-label">Total Venues</span>
                  <div class="rev-value">{{ restaurants.length }}</div>
                  <span class="rev-sub" style="color: #a855f7"
                    >Registered in platform</span
                  >
                </div>
                <div class="rev-card">
                  <span class="rev-label">Average Items / Venue</span>
                  <div class="rev-value">{{ avgItemsPerRestaurant }}</div>
                  <span class="rev-sub" style="color: #34d399"
                    >Menu density</span
                  >
                </div>
                <div class="rev-card">
                  <span class="rev-label">Top Venue</span>
                  <div
                    class="rev-value"
                    style="font-size: 1.1rem"
                    v-text="topVenue?.name || 'N/A'"
                  ></div>
                  <span class="rev-sub" style="color: #f59e0b"
                    >{{ topVenue?.foodsCount || 0 }} Items</span
                  >
                </div>
                <div class="rev-card">
                  <span class="rev-label">Latest Venue</span>
                  <div
                    class="rev-value"
                    style="font-size: 1.1rem"
                    v-text="restaurants[restaurants.length - 1]?.name || 'N/A'"
                  ></div>
                  <span class="rev-sub" style="color: #ec4899"
                    >Active Partner</span
                  >
                </div>
              </div>
              <div class="chart-row triple">
                <div class="chart-card">
                  <h3>
                    <i class="fa-solid fa-fire" style="color: #f59e0b"></i>
                    Active Venues Portfolio
                  </h3>
                  <div class="top-foods">
                    <div
                      v-for="(rest, idx) in restaurants"
                      :key="rest.id"
                      class="top-food-item"
                    >
                      <div class="top-food-left">
                        <span class="top-food-rank">#{{ idx + 1 }}</span>
                        <div>
                          <h5>{{ rest.name }}</h5>
                          <span>{{ rest.location }}</span>
                        </div>
                      </div>
                      <span class="top-food-views"
                        >{{ rest.foodsCount }} items</span
                      >
                    </div>
                  </div>
                </div>
                <div class="chart-card">
                  <h3>Plan Breakdown</h3>
                  <div class="chart-wrap"><canvas ref="catChart"></canvas></div>
                </div>
                <div class="chart-card">
                  <h3>Platform Overview</h3>
                  <div class="chart-wrap">
                    <canvas ref="peakChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <!-- ADD/EDIT MODAL -->
      <div
        v-if="addEditModalOpen"
        class="modal-overlay"
        @click.self="addEditModalOpen = false"
      >
        <div class="modal-box">
          <div class="modal-header">
            <h3>{{ isEditMode ? "Edit Restaurant" : "Add New Restaurant" }}</h3>
            <button @click="addEditModalOpen = false">✕</button>
          </div>
          <form @submit.prevent="saveRestaurantForm" class="modal-form">
            <div class="form-grid">
              <div>
                <label>English Name *</label
                ><input
                  v-model="form.name"
                  required
                  placeholder="e.g. Kaldi Coffee"
                />
              </div>
              <div>
                <label>Custom Link (Username) *</label
                ><input
                  v-model="form.custom_sub_link"
                  required
                  placeholder="e.g. kaldi-coffee"
                />
              </div>
              <div>
                <label>Plan Type *</label
                ><select v-model="form.plan" required>
                  <option value="Basic">Basic (17,999 ETB)</option>
                  <option value="Premium">Premium (Subscription)</option>
                </select>
              </div>
              <div>
                <label>Phone Number *</label
                ><input v-model="form.phone" required placeholder="+251 9..." />
              </div>
              <div>
                <label>Password *</label
                ><input
                  type="password"
                  v-model="form.password"
                  :required="!isEditMode"
                  placeholder="Set login password"
                />
              </div>

              <div>
                <label>Amharic Name</label
                ><input v-model="form.name_am" placeholder="e.g. ካልዲ ቡና" />
              </div>
              <div>
                <label>Owner Email</label
                ><input v-model="form.owner" placeholder="owner@example.com" />
              </div>
              <div>
                <label>Location</label
                ><input v-model="form.location" placeholder="Addis Ababa" />
              </div>
              <div>
                <label>Slogan</label
                ><input v-model="form.slogan" placeholder="Welcome..." />
              </div>
              <div>
                <label>Description</label
                ><input
                  v-model="form.longer_description"
                  placeholder="About restaurant..."
                />
              </div>
            </div>
            <div class="modal-actions">
              <button
                type="button"
                @click="addEditModalOpen = false"
                class="btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" class="btn-submit">
                {{ isEditMode ? "Update" : "Create" }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- QR CODE MODAL -->
      <div
        v-if="qrModalOpen"
        class="modal-overlay"
        @click.self="qrModalOpen = false"
      >
        <div class="modal-box small text-center">
          <div class="modal-header">
            <h3>QR Code - {{ selectedQrRest?.name }}</h3>
            <button @click="qrModalOpen = false">✕</button>
          </div>
          <div
            class="qr-container bg-white p-4 rounded-2xl my-4 inline-block shadow-lg"
            v-html="qrSvg"
          ></div>
          <p class="text-xs text-zinc-400 mb-4">
            Scan this QR Code to view digital menu for
            {{ selectedQrRest?.name }}
          </p>
          <div class="flex gap-2">
            <button @click="downloadQrCode" class="btn-submit full">
              <i class="fa-solid fa-download mr-1"></i> Download QR
            </button>
            <button @click="qrModalOpen = false" class="btn-cancel full">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- DETAILS MODAL -->
      <div
        v-if="detailsModalOpen"
        class="modal-overlay"
        @click.self="detailsModalOpen = false"
      >
        <div class="modal-box small">
          <div class="modal-header">
            <h3>{{ selectedRest?.name }}</h3>
            <button @click="detailsModalOpen = false">✕</button>
          </div>
          <div class="detail-rows">
            <div v-for="d in detailRows" :key="d.label" class="detail-row">
              <span>{{ d.label }}:</span
              ><span class="detail-val">{{ d.value }}</span>
            </div>
          </div>
          <button @click="detailsModalOpen = false" class="btn-submit full">
            Close Details
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { Chart, registerables } from "chart.js";
import { encode } from "uqr";
Chart.register(...registerables);

const { apiFetch } = useApi();
const { token, setAuth, clearAuth } = useAuth();

useHead({
  title: "Awaze - Admin Dashboard",
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,200..900&display=swap",
    },
  ],
});

const currentTab = ref("dashboard");
const tableSearch = ref("");
const filterPlan = ref("all");
const filterStatus = ref("all");
const paymentSearch = ref("");
const addEditModalOpen = ref(false);
const isEditMode = ref(false);
const detailsModalOpen = ref(false);
const qrModalOpen = ref(false);
const selectedQrRest = ref<any>(null);
const qrSvg = ref("");
const selectedRest = ref<any>(null);
const toast = ref({ show: false, message: "" });

const perfChart = ref<HTMLCanvasElement>();
const revChart = ref<HTMLCanvasElement>();
const planChart = ref<HTMLCanvasElement>();
const catChart = ref<HTMLCanvasElement>();
const peakChart = ref<HTMLCanvasElement>();

const form = ref({
  id: null as any,
  name: "",
  custom_sub_link: "",
  plan: "Basic",
  phone: "+251 9",
  password: "",
  name_am: "",
  owner: "",
  location: "Addis Ababa",
  slogan: "",
  longer_description: "",
  status: "Active",
});

const navTabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "fa-solid fa-chart-pie",
    badge: "",
    badgeColor: "",
  },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: "fa-solid fa-utensils",
    badge: "Venues",
    badgeColor: "green",
  },
  {
    id: "revenue",
    label: "Revenue",
    icon: "fa-solid fa-chart-line",
    badge: "ETB",
    badgeColor: "purple",
  },
  {
    id: "management",
    label: "Management",
    icon: "fa-solid fa-sliders",
    badge: "Billing",
    badgeColor: "amber",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "fa-solid fa-users",
    badge: "Scans",
    badgeColor: "blue",
  },
];

const restaurants = ref<any[]>([]);
const payments = ref<any[]>([]);
const topFoods = ref<any[]>([]);

async function loadBackendDashboard() {
  try {
    const list: any = await apiFetch("/admin/restaurants");
    if (list && Array.isArray(list)) {
      restaurants.value = list.map((r: any) => ({
        id: r.id || r.ID || r.custom_sub_link,
        name: r.name_en || r.name || "Restaurant",
        name_am: r.name_am || "",
        location: r.location || "Addis Ababa",
        owner: r.owner?.email || r.owner?.full_name || "No owner",
        phone: r.phone || "+251 9",
        plan: r.subscription?.plan === "premium" ? "Premium" : "Basic",
        status: "Active",
        foodsCount: (r.categories || []).reduce(
          (acc: number, c: any) => acc + (c.foods?.length || 0),
          0,
        ),
        drinksCount: 0,
        viewsThisMonth: 0,
      }));
      payments.value = list.map((r: any, idx: number) => ({
        id: `INV-2026-${100 + idx}`,
        restaurantName: r.name_en || r.name || "Restaurant",
        plan: r.subscription?.plan === "premium" ? "Premium" : "Basic",
        amount: r.subscription?.plan === "premium" ? 3500 : 17999,
        status:
          r.subscription?.status === "active" ||
          r.subscription?.status === "Paid"
            ? "Paid"
            : "Unpaid",
        date: new Date().toLocaleDateString(),
      }));
    }
  } catch (e) {
    console.warn("Dashboard fetch error:", e);
  }
}

onMounted(() => {
  loadBackendDashboard();
});

const activeCount = computed(
  () => restaurants.value.filter((r) => r.status === "Active").length,
);
const premiumCount = computed(
  () => restaurants.value.filter((r) => r.plan === "Premium").length,
);
const basicCount = computed(
  () => restaurants.value.filter((r) => r.plan === "Basic").length,
);
const paidCount = computed(
  () => payments.value.filter((p) => p.status === "Paid").length,
);
const unpaidCount = computed(
  () => payments.value.filter((p) => p.status === "Unpaid").length,
);
const upcomingRenewalsCount = computed(
  () => payments.value.filter((p) => p.status === "Unpaid").length,
);

const avgItemsPerRestaurant = computed(() => {
  if (restaurants.value.length === 0) return 0;
  const total = restaurants.value.reduce(
    (acc, r) => acc + (r.foodsCount || 0),
    0,
  );
  return Math.round(total / restaurants.value.length);
});

const topVenue = computed(() => {
  if (restaurants.value.length === 0) return null;
  return restaurants.value.reduce(
    (prev, curr) => (curr.foodsCount > prev.foodsCount ? curr : prev),
    restaurants.value[0],
  );
});

const miniMetrics = computed(() => [
  {
    label: "Active Venues",
    value: activeCount.value,
    sub: "Operational",
    icon: "fa-solid fa-circle-check",
    color: "#34d399",
  },
  {
    label: "Premium Subscriptions",
    value: premiumCount.value,
    sub: "High Tier",
    icon: "fa-solid fa-crown",
    color: "#a855f7",
  },
  {
    label: "Basic Plan",
    value: basicCount.value,
    sub: "Standard Tier",
    icon: "fa-solid fa-seedling",
    color: "#3b82f6",
  },
  {
    label: "Total Menu Items",
    value: restaurants.value.reduce((acc, r) => acc + (r.foodsCount || 0), 0),
    sub: "Backend items",
    icon: "fa-solid fa-utensils",
    color: "#ec4899",
  },
]);

const revMetricCards = computed(() => [
  {
    label: "Active Venues",
    value: String(restaurants.value.length),
    sub: "Registered partners",
    color: "#34d399",
  },
  {
    label: "Premium Tier",
    value: String(premiumCount.value),
    sub: "Premium subscribers",
    color: "#a855f7",
  },
  {
    label: "Basic Tier",
    value: String(basicCount.value),
    sub: "Basic plan partners",
    color: "#3b82f6",
  },
  {
    label: "Avg Items / Partner",
    value: String(avgItemsPerRestaurant.value),
    sub: "Menu coverage",
    color: "#ec4899",
  },
]);

const filteredRestaurants = computed(() =>
  restaurants.value.filter((r) => {
    const s = tableSearch.value.toLowerCase();
    return (
      (r.name.toLowerCase().includes(s) || r.phone.includes(s)) &&
      (filterPlan.value === "all" || r.plan === filterPlan.value) &&
      (filterStatus.value === "all" || r.status === filterStatus.value)
    );
  }),
);

const filteredPayments = computed(() =>
  payments.value.filter((p) => {
    const s = paymentSearch.value.toLowerCase();
    return (
      p.restaurantName.toLowerCase().includes(s) ||
      p.id.toLowerCase().includes(s)
    );
  }),
);

const detailRows = computed(() => {
  const r = selectedRest.value;
  if (!r) return [];
  return [
    { label: "Owner", value: r.owner },
    { label: "Plan", value: r.plan },
    { label: "Status", value: r.status },
    { label: "Foods", value: r.foodsCount },
    { label: "Drinks", value: r.drinksCount },
    { label: "Monthly Views", value: r.viewsThisMonth?.toLocaleString() },
    { label: "Phone", value: r.phone },
    { label: "Location", value: r.location },
  ];
});

function triggerToast(msg: string) {
  toast.value = { show: true, message: msg };
  setTimeout(() => {
    toast.value.show = false;
  }, 3500);
}

function openAddModal() {
  isEditMode.value = false;
  form.value = {
    id: null,
    name: "",
    custom_sub_link: "",
    plan: "Basic",
    phone: "+251 9",
    password: "",
    name_am: "",
    owner: "",
    location: "Addis Ababa",
    slogan: "",
    longer_description: "",
    status: "Active",
  };
  addEditModalOpen.value = true;
}

function openEditModal(rest: any) {
  isEditMode.value = true;
  form.value = {
    id: rest.id,
    name: rest.name,
    custom_sub_link: rest.id,
    plan: rest.plan,
    phone: rest.phone,
    password: "",
    name_am: rest.name_am || rest.name,
    owner: rest.owner,
    location: rest.location,
    slogan: "",
    longer_description: "",
    status: rest.status,
  };
  addEditModalOpen.value = true;
}

const isLoggedInSuperAdmin = ref(
  typeof window !== "undefined"
    ? localStorage.getItem("awaze_superadmin_auth") === "true"
    : false,
);
const superAdminEmail = ref("admin@platform.com");
const superAdminPassword = ref("123456");

async function loginSuperAdmin() {
  try {
    const res: any = await apiFetch("/auth/login", {
      method: "POST",
      body: {
        email: superAdminEmail.value.trim(),
        password: superAdminPassword.value,
      },
    });
    if (res && res.token) {
      setAuth(res.token, res.user);
      isLoggedInSuperAdmin.value = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("awaze_superadmin_auth", "true");
      }
      triggerToast("Welcome to Master Dashboard!");
      loadBackendDashboard();
    } else {
      triggerToast("Login failed: missing token");
    }
  } catch (e: any) {
    console.error("SuperAdmin login failed:", e);
    triggerToast(e.data?.error || "Login failed");
  }
}

function logoutSuperAdmin() {
  clearAuth();
  isLoggedInSuperAdmin.value = false;
  if (typeof window !== "undefined") {
    localStorage.removeItem("awaze_superadmin_auth");
  }
  triggerToast("Logged out from Master Dashboard");
}

function generateCustomQrSvg(text: string): string {
  try {
    const result = encode(text, { ecc: "M", border: 2 });
    const matrix = result.data;
    const size = result.size;
    const border = 2;
    const totalModules = size + border * 2;
    const cellSize = 8;
    const width = totalModules * cellSize;
    const height = totalModules * cellSize;

    let rects = `<rect width="${width}" height="${height}" fill="#ffffff"/>`;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix[r][c]) {
          const x = (c + border) * cellSize;
          const y = (r + border) * cellSize;
          rects += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="#000000"/>`;
        }
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="240" height="240" style="display:block;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">${rects}</svg>`;
  } catch (e) {
    console.error("QR generation error:", e);
    return `<div style="padding:20px;color:#f87171;">Failed to generate QR Code</div>`;
  }
}

function openDetailsModal(rest: any) {
  selectedRest.value = rest;
  detailsModalOpen.value = true;
}

function openRestaurantDashboard(rest: any) {
  // Keep the existing SuperAdmin JWT token - don't overwrite it
  // Just set the restaurant session so basic.vue knows which restaurant to load
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "awaze_restaurant_session",
      JSON.stringify({
        id: rest.id,
        name: rest.name,
        plan: rest.plan,
        isLoggedIn: true,
      }),
    );
  }
  const targetPath =
    rest.plan === "Premium" ? "/admin/premium" : "/admin/basic";
  navigateTo(`${targetPath}?r=${rest.id}&autoLogin=true`);
}

function openQrModal(rest: any) {
  selectedQrRest.value = rest;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://awaze.et";
  const menuUrl = `${origin}/menu/${rest.id}`;
  qrSvg.value = generateCustomQrSvg(menuUrl);
  qrModalOpen.value = true;
}

function downloadQrCode() {
  if (!qrSvg.value || !selectedQrRest.value) return;
  const blob = new Blob([qrSvg.value], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${selectedQrRest.value.name.toLowerCase().replace(/\s+/g, "-")}-qr.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  triggerToast("QR Code downloaded!");
}

async function saveRestaurantForm() {
  try {
    const slug =
      form.value.custom_sub_link
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") ||
      form.value.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-") ||
      "rest-" + Date.now();
    const payload = {
      name_en: form.value.name,
      name_am: form.value.name_am || form.value.name,
      custom_sub_link: slug,
      location: form.value.location || "Addis Ababa",
      phone: form.value.phone || "+251 911 000000",
      email: form.value.owner,
      password: form.value.password || "123456",
      slogan: form.value.slogan || "Welcome",
      longer_description: form.value.longer_description || "",
      plan: form.value.plan,
    };

    try {
      if (isEditMode.value && form.value.id) {
        await apiFetch(`/restaurants/${form.value.id}`, {
          method: "PUT",
          body: payload,
        });
      } else {
        await apiFetch("/restaurants", { method: "POST", body: payload });
      }
      triggerToast(
        isEditMode.value ? "Restaurant updated!" : "Restaurant created!",
      );
      await loadBackendDashboard();
      addEditModalOpen.value = false;
    } catch (err: any) {
      console.error("Error saving restaurant:", err);
      triggerToast(err.data?.error || err.message || "Failed to save restaurant");
    }
  } catch (err: any) {
    console.error("Outer error saving restaurant:", err);
  }
}

function toggleSuspend(rest: any) {
  rest.status = rest.status === "Suspended" ? "Active" : "Suspended";
  triggerToast(`Status: ${rest.status}`);
}

async function confirmDelete(rest: any) {
  if (confirm(`Delete ${rest.name}?`)) {
    try {
      await apiFetch(`/restaurants/${rest.id}`, { method: "DELETE" });
      triggerToast("Restaurant deleted on backend!");
      await loadBackendDashboard();
    } catch (err: any) {
      console.error("Error deleting restaurant:", err);
      triggerToast(err.data?.error || "Failed to delete restaurant");
    }
  }
}
function togglePaymentStatus(pay: any) {
  pay.status = pay.status === "Paid" ? "Unpaid" : "Paid";
  triggerToast(`${pay.id}: ${pay.status}`);
}

const chartInstances: Chart[] = [];
function destroyCharts() {
  chartInstances.forEach((c) => c.destroy());
  chartInstances.length = 0;
}

function initCharts() {
  destroyCharts();
  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#a1a1aa" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#a1a1aa" },
      },
    },
  };

  const restNames = restaurants.value.map((r) => r.name);
  const restFoods = restaurants.value.map((r) => r.foodsCount);

  if (perfChart.value) {
    chartInstances.push(
      new Chart(perfChart.value, {
        type: "line",
        data: {
          labels: restNames.length > 0 ? restNames : ["No Venues"],
          datasets: [
            {
              label: "Foods Count",
              data: restFoods.length > 0 ? restFoods : [0],
              borderColor: "#a855f7",
              backgroundColor: "rgba(168,85,247,0.1)",
              fill: true,
              tension: 0.4,
              borderWidth: 3,
            },
          ],
        },
        options: chartOpts,
      }),
    );
  }
  if (revChart.value) {
    chartInstances.push(
      new Chart(revChart.value, {
        type: "bar",
        data: {
          labels: ["Basic Tier", "Premium Tier"],
          datasets: [
            {
              label: "Venues",
              data: [basicCount.value, premiumCount.value],
              backgroundColor: ["#10b981", "#a855f7"],
              borderRadius: 6,
            },
          ],
        },
        options: {
          ...chartOpts,
          plugins: { legend: { labels: { color: "#fff" } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: "#a1a1aa" } },
            y: {
              grid: { color: "rgba(255,255,255,0.05)" },
              ticks: { color: "#a1a1aa" },
            },
          },
        },
      }),
    );
  }
  if (planChart.value) {
    chartInstances.push(
      new Chart(planChart.value, {
        type: "doughnut",
        data: {
          labels: ["Premium Plan", "Basic Plan"],
          datasets: [
            {
              data: [premiumCount.value, basicCount.value],
              backgroundColor: ["#a855f7", "#34d399"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#fff", boxWidth: 12 },
            },
          },
        },
      }),
    );
  }
  if (catChart.value) {
    chartInstances.push(
      new Chart(catChart.value, {
        type: "doughnut",
        data: {
          labels: ["Premium", "Basic"],
          datasets: [
            {
              data: [premiumCount.value, basicCount.value],
              backgroundColor: ["#a855f7", "#10b981"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#fff", boxWidth: 10 },
            },
          },
        },
      }),
    );
  }
  if (peakChart.value) {
    chartInstances.push(
      new Chart(peakChart.value, {
        type: "line",
        data: {
          labels: restNames.length > 0 ? restNames : ["No Venues"],
          datasets: [
            {
              label: "Menu Items",
              data: restFoods.length > 0 ? restFoods : [0],
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59,130,246,0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: chartOpts,
      }),
    );
  }
}

onMounted(() => {
  nextTick(() => initCharts());
});
watch(currentTab, () => {
  nextTick(() => initCharts());
});
</script>

<style scoped>
.dash-root {
  font-family: "Literata", serif;
  background: #050806;
  color: #e4e4e7;
  min-height: 100vh;
}
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 99;
  background: #a855f7;
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.3);
}
.dash-layout {
  display: flex;
  min-height: 100vh;
}
.dash-sidebar {
  width: 260px;
  background: #0a0f0d;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.sidebar-top {
  padding: 1.5rem;
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a855f7;
}
.brand-name {
  display: block;
  font-weight: 900;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.brand-sub {
  display: block;
  font-size: 0.55rem;
  color: #a855f7;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.nav-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.nav-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}
.nav-btn.active {
  background: linear-gradient(
    90deg,
    rgba(168, 85, 247, 0.25) 0%,
    rgba(168, 85, 247, 0.05) 100%
  );
  border-left: 3px solid #a855f7;
  color: #fff;
}
.nav-btn-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.nav-badge {
  font-size: 0.55rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-weight: 800;
  text-transform: uppercase;
}
.nav-badge.green {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.nav-badge.purple {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.3);
}
.nav-badge.amber {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}
.nav-badge.blue {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
.sidebar-bottom {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.625rem;
  color: #71717a;
  font-weight: 600;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}
.status-live {
  margin-left: auto;
  color: #a1a1aa;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.dash-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dash-header {
  height: 5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(10, 15, 13, 0.6);
  backdrop-filter: blur(12px);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;
}
.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.header-badge {
  font-size: 0.65rem;
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(168, 85, 247, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.header-sub {
  font-size: 0.75rem;
  color: #a1a1aa;
}
.header-tools {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.header-tabs {
  display: flex;
  background: #050806;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.htab {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  color: #a1a1aa;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.htab.active {
  background: rgba(168, 85, 247, 0.3);
  color: #fff;
  font-weight: 700;
  border: 1px solid rgba(168, 85, 247, 0.4);
}
.dash-content {
  padding: 2rem;
  flex: 1;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}
.tab-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.glass-bg {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.metrics-grid-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.metric-card {
  padding: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.metric-card.purple {
  background: linear-gradient(
    135deg,
    rgba(38, 20, 48, 0.6),
    rgba(15, 10, 20, 0.85)
  );
  border: 1px solid rgba(168, 85, 247, 0.25);
}
.metric-header {
  font-size: 0.7rem;
  font-weight: 700;
  color: #d4d4d8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.metric-header i {
  color: #a855f7;
}
.metric-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;
}
.metric-change {
  font-size: 0.7rem;
  color: #34d399;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
  margin-left: 0.5rem;
}
.metric-sub {
  font-size: 0.7rem;
  color: #a1a1aa;
}
.mini-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.mini-card {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.mini-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 700;
  color: #a1a1aa;
}
.mini-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
}
.mini-sub {
  font-size: 0.6rem;
  font-weight: 700;
}
.chart-card {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1.5rem;
  border-radius: 1.5rem;
}
.chart-card h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.chart-wrap {
  height: 280px;
}
.chart-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}
.chart-row.triple {
  grid-template-columns: 1fr 1fr 1fr;
}
.chart-card.wide {
  grid-column: span 1;
}
.chart-card.narrow {
  grid-column: span 1;
}
.table-header {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
.table-header h2 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}
.table-header p {
  font-size: 0.7rem;
  color: #a1a1aa;
}
.table-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.filter-input,
.filter-select {
  background: #050806;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  color: #fff;
  outline: none;
}
.filter-input:focus,
.filter-select:focus {
  border-color: #a855f7;
}
.add-btn {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.table-wrap {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 1.5rem;
  overflow: hidden;
}
.table-wrap table {
  width: 100%;
  text-align: left;
  font-size: 0.75rem;
  border-collapse: collapse;
}
.table-wrap thead {
  background: rgba(5, 8, 6, 0.8);
}
.table-wrap th {
  padding: 1rem;
  color: #a1a1aa;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.table-wrap td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.table-wrap tr:hover {
  background: rgba(255, 255, 255, 0.02);
}
.center {
  text-align: center;
}
.right {
  text-align: right;
  font-weight: 800;
  color: #fff;
}
.bold {
  font-weight: 700;
  color: #fff;
}
.mono {
  font-family: monospace;
}
.purple-text {
  color: #a855f7;
  font-weight: 700;
}
.muted {
  color: #a1a1aa;
}
.rest-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.rest-avatar {
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #27272a, #050806);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a855f7;
  font-weight: 900;
  font-size: 0.75rem;
  flex-shrink: 0;
}
.rest-name {
  font-weight: 700;
  color: #fff;
  font-size: 0.85rem;
}
.rest-owner {
  font-size: 0.625rem;
  color: #a1a1aa;
}
.pill {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: inline-block;
}
.pill.purple {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.4);
}
.pill.blue {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.4);
}
.pill.green {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}
.pill.amber {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
}
.pill.red {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}
.action-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
}
.action-btns button {
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  background: #27272a;
  color: #d4d4d8;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.2s;
}
.action-btns button:hover {
  background: #a855f7;
  color: #fff;
}
.rev-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.rev-card {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1.25rem;
  border-radius: 1rem;
}
.rev-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.rev-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  margin: 0.25rem 0;
}
.rev-sub {
  font-size: 0.6rem;
  font-weight: 700;
}
.mgmt-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.mgmt-card {
  background: linear-gradient(
    135deg,
    rgba(20, 26, 23, 0.75),
    rgba(10, 15, 13, 0.85)
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 1.5rem;
  border-radius: 1.5rem;
}
.mgmt-card span {
  font-size: 0.7rem;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
}
.mgmt-card .mgmt-value {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
}
.mgmt-card p {
  font-size: 0.7rem;
  font-weight: 500;
}
.mgmt-card.green {
  border-left: 4px solid #10b981;
}
.mgmt-card.green p {
  color: #34d399;
}
.mgmt-card.red {
  border-left: 4px solid #ef4444;
}
.mgmt-card.red p {
  color: #f87171;
}
.mgmt-card.purple {
  border-left: 4px solid #a855f7;
}
.mgmt-card.purple p {
  color: #a855f7;
}
.action-toggle {
  font-size: 0.625rem;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 700;
}
.action-toggle.active {
  background: #10b981;
  color: #000;
}
.action-toggle.muted {
  background: #27272a;
  color: #a1a1aa;
}
.top-foods {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.top-food-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 1rem;
  background: rgba(5, 8, 6, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.top-food-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.top-food-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
  font-weight: 900;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.top-food-left h5 {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.top-food-left span {
  font-size: 0.6rem;
  color: #a1a1aa;
}
.top-food-views {
  font-size: 0.7rem;
  font-weight: 700;
  color: #34d399;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  padding: 1rem;
}
.modal-box {
  position: relative;
  background: #0a0f0d;
  border: 1px solid rgba(168, 85, 247, 0.4);
  width: 100%;
  max-width: 560px;
  border-radius: 1.5rem;
  padding: 1.5rem 2rem;
  z-index: 10;
}
.modal-box.small {
  max-width: 400px;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.modal-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}
.modal-header button {
  background: none;
  border: none;
  color: #71717a;
  cursor: pointer;
  font-size: 1rem;
}
.modal-header button:hover {
  color: #fff;
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.form-grid label {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  color: #a1a1aa;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.form-grid input,
.form-grid select {
  width: 100%;
  background: #050806;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.6rem 0.75rem;
  font-size: 0.75rem;
  color: #fff;
  outline: none;
}
.form-grid input:focus,
.form-grid select:focus {
  border-color: #a855f7;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1rem;
}
.btn-cancel {
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  background: #050806;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #a1a1aa;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
}
.btn-submit {
  padding: 0.6rem 1.5rem;
  border-radius: 0.75rem;
  background: #a855f7;
  color: #fff;
  font-weight: 700;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
}
.btn-submit.full {
  width: 100%;
  margin-top: 0.5rem;
}
.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.75rem;
}
.detail-row span:first-child {
  color: #a1a1aa;
}
.detail-val {
  color: #fff;
  font-weight: 700;
}
@media (max-width: 1024px) {
  .dash-sidebar {
    display: none;
  }
  .metrics-grid-top {
    grid-template-columns: 1fr;
  }
  .chart-row {
    grid-template-columns: 1fr;
  }
  .chart-row.triple {
    grid-template-columns: 1fr;
  }
  .mgmt-cards {
    grid-template-columns: 1fr;
  }
}
</style>

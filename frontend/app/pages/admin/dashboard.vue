<template>
  <div class="dash-root">
    <!-- Toast -->
    <div v-if="toast.show" class="toast-container">
      <i class="fa-solid fa-circle-check"></i>
      <span v-text="toast.message"></span>
    </div>

    <div class="dash-layout">
      <!-- SIDEBAR -->
      <aside class="dash-sidebar">
        <div class="sidebar-top">
          <div class="brand-logo">
            <div class="brand-icon"><i class="fa-solid fa-utensils"></i></div>
            <div><span class="brand-name">AWAZE</span><span class="brand-sub">Main Dashboard</span></div>
          </div>
          <nav class="sidebar-nav">
            <button v-for="tab in navTabs" :key="tab.id" @click="currentTab = tab.id" :class="['nav-btn', currentTab === tab.id && 'active']">
              <div class="nav-btn-left"><i :class="tab.icon"></i><span>{{ tab.label }}</span></div>
              <span v-if="tab.badge" :class="['nav-badge', tab.badgeColor]">{{ tab.badge }}</span>
            </button>
          </nav>
        </div>
        <div class="sidebar-bottom">
          <div class="system-status"><span class="status-dot"></span><span>Awaze Core v3.4</span><span class="status-live">Live</span></div>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="dash-main">
        <header class="dash-header">
          <div><h1 class="header-title">Welcome, Admin <span class="header-badge">Master</span></h1><p class="header-sub">Operational Overview</p></div>
          <div class="header-tools">
            <div class="header-tabs">
              <button v-for="t in ['dashboard','restaurants','revenue']" :key="t" @click="currentTab = t" :class="['htab', currentTab === t && 'active']">{{ t === 'dashboard' ? 'Overview' : t.charAt(0).toUpperCase() + t.slice(1) }}</button>
            </div>
          </div>
        </header>

        <div class="dash-content">
          <!-- TAB: DASHBOARD -->
          <div v-show="currentTab === 'dashboard'" class="tab-section">
            <div class="metrics-grid-top">
              <div class="metric-card purple">
                <div class="metric-header"><span><i class="fa-solid fa-store"></i> Total Restaurants</span></div>
                <div class="metric-value">{{ restaurants.length }} <span class="metric-change">+14.2%</span></div>
                <p class="metric-sub">Total registered venue partners</p>
              </div>
              <div class="mini-metrics">
                <div class="mini-card" v-for="m in miniMetrics" :key="m.label">
                  <div class="mini-header"><span>{{ m.label }}</span><i :class="m.icon"></i></div>
                  <div class="mini-value">{{ m.value }}</div>
                  <span class="mini-sub" :style="{color: m.color}">{{ m.sub }}</span>
                </div>
              </div>
            </div>
            <div class="chart-card"><h3>Platform Menu Views & Revenue Trajectory</h3><div class="chart-wrap"><canvas ref="perfChart"></canvas></div></div>
          </div>

          <!-- TAB: RESTAURANTS -->
          <div v-show="currentTab === 'restaurants'" class="tab-section">
            <div class="table-header">
              <div><h2>Restaurant Management Portfolio</h2><p>Manage, edit, suspend, or add new partners</p></div>
              <div class="table-filters">
                <input v-model="tableSearch" placeholder="Search restaurant..." class="filter-input" />
                <select v-model="filterPlan" class="filter-select"><option value="all">All Plans</option><option value="Basic">Basic</option><option value="Premium">Premium</option></select>
                <select v-model="filterStatus" class="filter-select"><option value="all">All Statuses</option><option value="Active">Active</option><option value="Expired">Expired</option><option value="Suspended">Suspended</option></select>
                <button @click="openAddModal" class="add-btn"><i class="fa-solid fa-plus"></i> Add Restaurant</button>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Restaurant</th><th>Plan</th><th>Status</th><th>Foods</th><th>Drinks</th><th>Views</th><th>Location</th><th>Phone</th><th>Actions</th></tr></thead>
                <tbody>
                  <tr v-for="rest in filteredRestaurants" :key="rest.id">
                    <td><div class="rest-name-cell"><div class="rest-avatar">{{ rest.name.charAt(0) }}</div><div><div class="rest-name">{{ rest.name }}</div><div class="rest-owner">Owner: {{ rest.owner }}</div></div></div></td>
                    <td><span :class="['pill', rest.plan === 'Premium' ? 'purple' : 'blue']">{{ rest.plan }}</span></td>
                    <td><span :class="['pill', rest.status === 'Active' ? 'green' : rest.status === 'Expired' ? 'amber' : 'red']">{{ rest.status }}</span></td>
                    <td class="center">{{ rest.foodsCount }}</td>
                    <td class="center">{{ rest.drinksCount }}</td>
                    <td class="right">{{ rest.viewsThisMonth.toLocaleString() }}</td>
                    <td>{{ rest.location }}</td>
                    <td>{{ rest.phone }}</td>
                    <td class="center">
                      <div class="action-btns">
                        <button @click="openDetailsModal(rest)" title="View"><i class="fa-solid fa-eye"></i></button>
                        <button @click="openEditModal(rest)" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button @click="toggleSuspend(rest)" title="Suspend"><i class="fa-solid fa-ban"></i></button>
                        <button @click="confirmDelete(rest)" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
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
              <div class="rev-card" v-for="rm in revMetricCards" :key="rm.label"><span class="rev-label">{{ rm.label }}</span><div class="rev-value">{{ rm.value }}</div><span class="rev-sub" :style="{color: rm.color}">{{ rm.sub }}</span></div>
            </div>
            <div class="chart-row">
              <div class="chart-card wide"><h3>Revenue Breakdown by Source</h3><div class="chart-wrap"><canvas ref="revChart"></canvas></div></div>
              <div class="chart-card narrow"><h3>Plan Distribution</h3><div class="chart-wrap"><canvas ref="planChart"></canvas></div></div>
            </div>
          </div>

          <!-- TAB: MANAGEMENT -->
          <div v-show="currentTab === 'management'" class="tab-section">
            <div class="mgmt-cards">
              <div class="mgmt-card green"><span>Who Paid</span><div class="mgmt-value">{{ paidCount }}</div><p>Subscriptions active & up-to-date</p></div>
              <div class="mgmt-card red"><span>Who Didn't Pay</span><div class="mgmt-value">{{ unpaidCount }}</div><p>Pending or past-due renewal</p></div>
              <div class="mgmt-card purple"><span>Upcoming Renewals</span><div class="mgmt-value">12</div><p>Due within next 7 days</p></div>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Invoice</th><th>Restaurant</th><th>Plan</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  <tr v-for="pay in filteredPayments" :key="pay.id">
                    <td class="mono purple-text">{{ pay.id }}</td>
                    <td class="bold">{{ pay.restaurantName }}</td>
                    <td>{{ pay.plan }}</td>
                    <td class="bold">{{ pay.amount }} ETB</td>
                    <td><span :class="['pill', pay.status === 'Paid' ? 'green' : 'red']">{{ pay.status }}</span></td>
                    <td class="muted">{{ pay.date }}</td>
                    <td class="center"><button @click="togglePaymentStatus(pay)" :class="['action-toggle', pay.status === 'Paid' ? 'muted' : 'active']">{{ pay.status === 'Paid' ? 'Mark Unpaid' : 'Mark as Paid' }}</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB: ANALYTICS -->
          <div v-show="currentTab === 'analytics'" class="tab-section">
            <div class="rev-metrics">
              <div class="rev-card"><span class="rev-label">Total Platform Views</span><div class="rev-value">1,482,900</div><span class="rev-sub" style="color:#a855f7">+18.4% vs last month</span></div>
              <div class="rev-card"><span class="rev-label">Average / Restaurant</span><div class="rev-value">35,307</div><span class="rev-sub" style="color:#34d399">Monthly Scan Average</span></div>
              <div class="rev-card"><span class="rev-label">Most Viewed</span><div class="rev-value" style="font-size:1.1rem">Bole Hub Restaurant</div><span class="rev-sub" style="color:#f59e0b">94,200 Menu Views</span></div>
              <div class="rev-card"><span class="rev-label">Least Viewed</span><div class="rev-value" style="font-size:1.1rem">Entoto Breeze Cafe</div><span class="rev-sub" style="color:#ec4899">1,410 Menu Views</span></div>
            </div>
            <div class="chart-row triple">
              <div class="chart-card"><h3><i class="fa-solid fa-fire" style="color:#f59e0b"></i> Top Viewed Foods</h3>
                <div class="top-foods">
                  <div v-for="(food, idx) in topFoods" :key="idx" class="top-food-item">
                    <div class="top-food-left"><span class="top-food-rank">#{{ idx + 1 }}</span><div><h5>{{ food.name }}</h5><span>{{ food.category }}</span></div></div>
                    <span class="top-food-views">{{ food.views.toLocaleString() }} views</span>
                  </div>
                </div>
              </div>
              <div class="chart-card"><h3>Popular Categories</h3><div class="chart-wrap"><canvas ref="catChart"></canvas></div></div>
              <div class="chart-card"><h3>Peak Scanning Hours</h3><div class="chart-wrap"><canvas ref="peakChart"></canvas></div></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ADD/EDIT MODAL -->
    <div v-if="addEditModalOpen" class="modal-overlay" @click.self="addEditModalOpen = false">
      <div class="modal-box">
        <div class="modal-header"><h3>{{ isEditMode ? 'Edit Restaurant' : 'Add New Restaurant' }}</h3><button @click="addEditModalOpen = false">✕</button></div>
        <form @submit.prevent="saveRestaurantForm" class="modal-form">
          <div class="form-grid">
            <div><label>Restaurant Name</label><input v-model="form.name" required /></div>
            <div><label>Owner Name</label><input v-model="form.owner" required /></div>
            <div><label>Plan Type</label><select v-model="form.plan"><option value="Basic">Basic (17,999 ETB)</option><option value="Premium">Premium (Subscription)</option></select></div>
            <div><label>Status</label><select v-model="form.status"><option value="Active">Active</option><option value="Expired">Expired</option><option value="Suspended">Suspended</option></select></div>
            <div><label>Foods Count</label><input type="number" v-model.number="form.foodsCount" min="0" /></div>
            <div><label>Drinks Count</label><input type="number" v-model.number="form.drinksCount" min="0" /></div>
            <div><label>Location</label><input v-model="form.location" required /></div>
            <div><label>Phone Number</label><input v-model="form.phone" required /></div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="addEditModalOpen = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-submit">{{ isEditMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- DETAILS MODAL -->
    <div v-if="detailsModalOpen" class="modal-overlay" @click.self="detailsModalOpen = false">
      <div class="modal-box small">
        <div class="modal-header"><h3>{{ selectedRest?.name }}</h3><button @click="detailsModalOpen = false">✕</button></div>
        <div class="detail-rows">
          <div v-for="d in detailRows" :key="d.label" class="detail-row"><span>{{ d.label }}:</span><span class="detail-val">{{ d.value }}</span></div>
        </div>
        <button @click="detailsModalOpen = false" class="btn-submit full">Close Details</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { apiFetch } = useApi()
const { token } = useAuth()

useHead({ title: 'Awaze - Admin Dashboard', link: [
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,200..900&display=swap' }
]})

const currentTab = ref('dashboard')
const tableSearch = ref('')
const filterPlan = ref('all')
const filterStatus = ref('all')
const paymentSearch = ref('')
const addEditModalOpen = ref(false)
const isEditMode = ref(false)
const detailsModalOpen = ref(false)
const selectedRest = ref<any>(null)
const toast = ref({ show: false, message: '' })

const perfChart = ref<HTMLCanvasElement>()
const revChart = ref<HTMLCanvasElement>()
const planChart = ref<HTMLCanvasElement>()
const catChart = ref<HTMLCanvasElement>()
const peakChart = ref<HTMLCanvasElement>()

const form = ref({ id: null as any, name: '', owner: '', plan: 'Basic', status: 'Active', foodsCount: 5, drinksCount: 3, viewsThisMonth: 1000, location: 'Addis Ababa', phone: '+251 9' })

const navTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie', badge: '', badgeColor: '' },
  { id: 'restaurants', label: 'Restaurants', icon: 'fa-solid fa-utensils', badge: 'Venues', badgeColor: 'green' },
  { id: 'revenue', label: 'Revenue', icon: 'fa-solid fa-chart-line', badge: 'ETB', badgeColor: 'purple' },
  { id: 'management', label: 'Management', icon: 'fa-solid fa-sliders', badge: 'Billing', badgeColor: 'amber' },
  { id: 'analytics', label: 'Analytics', icon: 'fa-solid fa-users', badge: 'Scans', badgeColor: 'blue' },
]

const restaurants = ref<any[]>([])
const payments = ref<any[]>([])
const topFoods = ref<any[]>([])

async function loadBackendDashboard() {
  try {
    const list: any = await apiFetch('/public/restaurants')
    if (list && Array.isArray(list)) {
      restaurants.value = list.map((r: any) => ({
        id: r.id || r.ID || r.custom_sub_link,
        name: r.name_en || r.name || 'Restaurant',
        location: r.location || 'Addis Ababa',
        owner: r.owner?.full_name || 'Owner',
        phone: r.phone || '+251 9',
        plan: r.subscription?.plan === 'premium' ? 'Premium' : 'Basic',
        status: 'Active',
        foodsCount: (r.categories || []).reduce((acc: number, c: any) => acc + (c.foods?.length || 0), 0),
        drinksCount: 0,
        viewsThisMonth: 0
      }))
    }
  } catch (e) {
    console.warn('Dashboard fetch error:', e)
  }
}

onMounted(() => {
  loadBackendDashboard()
})


const activeCount = computed(() => restaurants.value.filter(r => r.status === 'Active').length)
const premiumCount = computed(() => restaurants.value.filter(r => r.plan === 'Premium').length)
const basicCount = computed(() => restaurants.value.filter(r => r.plan === 'Basic').length)
const paidCount = computed(() => payments.value.filter(p => p.status === 'Paid').length)
const unpaidCount = computed(() => payments.value.filter(p => p.status === 'Unpaid').length)

const miniMetrics = computed(() => [
  { label: 'Active', value: activeCount.value, sub: '94% Operational', icon: 'fa-solid fa-circle-check', color: '#34d399' },
  { label: 'Subscriptions', value: premiumCount.value, sub: 'High LTV Tier', icon: 'fa-solid fa-crown', color: '#a855f7' },
  { label: 'Basic Plan', value: basicCount.value, sub: 'Standard Tier', icon: 'fa-solid fa-seedling', color: '#3b82f6' },
  { label: 'New This Month', value: '+18', sub: '+28% growth MoM', icon: 'fa-solid fa-sparkles', color: '#ec4899' },
])

const revMetricCards = computed(() => [
  { label: "Today's Revenue", value: 'ETB 14,500', sub: '+12% vs yesterday', color: '#34d399' },
  { label: 'This Month', value: 'ETB 218,900', sub: 'Target 88% Reached', color: '#a855f7' },
  { label: 'Total Revenue', value: `ETB ${(payments.value.filter(p => p.status === 'Paid').reduce((a, c) => a + c.amount, 0) + 342000).toLocaleString()}`, sub: 'YoY +34%', color: '#f59e0b' },
  { label: 'Basic Plans Sold', value: String(basicCount.value), sub: '17,999 ETB / Unit', color: '#3b82f6' },
  { label: 'Subscriptions Joined', value: String(premiumCount.value), sub: 'New Monthly Recurrent', color: '#ec4899' },
])

const filteredRestaurants = computed(() => restaurants.value.filter(r => {
  const s = tableSearch.value.toLowerCase()
  return (r.name.toLowerCase().includes(s) || r.phone.includes(s)) && (filterPlan.value === 'all' || r.plan === filterPlan.value) && (filterStatus.value === 'all' || r.status === filterStatus.value)
}))

const filteredPayments = computed(() => payments.value.filter(p => {
  const s = paymentSearch.value.toLowerCase()
  return p.restaurantName.toLowerCase().includes(s) || p.id.toLowerCase().includes(s)
}))

const detailRows = computed(() => {
  const r = selectedRest.value
  if (!r) return []
  return [
    { label: 'Owner', value: r.owner }, { label: 'Plan', value: r.plan }, { label: 'Status', value: r.status },
    { label: 'Foods', value: r.foodsCount }, { label: 'Drinks', value: r.drinksCount },
    { label: 'Monthly Views', value: r.viewsThisMonth?.toLocaleString() },
    { label: 'Phone', value: r.phone }, { label: 'Location', value: r.location },
  ]
})

function triggerToast(msg: string) { toast.value = { show: true, message: msg }; setTimeout(() => { toast.value.show = false }, 3500) }
function openAddModal() { isEditMode.value = false; form.value = { id: null, name: '', owner: '', plan: 'Basic', status: 'Active', foodsCount: 5, drinksCount: 3, viewsThisMonth: 1000, location: 'Addis Ababa', phone: '+251 9' }; addEditModalOpen.value = true }
function openEditModal(rest: any) { isEditMode.value = true; form.value = { ...rest }; addEditModalOpen.value = true }
function openDetailsModal(rest: any) { selectedRest.value = rest; detailsModalOpen.value = true }
async function saveRestaurantForm() {
  try {
    const slug = form.value.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'rest-' + Date.now()
    const payload = {
      name_en: form.value.name,
      name_am: form.value.name,
      custom_sub_link: isEditMode.value ? (form.value.id || slug) : slug,
      location: form.value.location || 'Addis Ababa',
      phone: form.value.phone || '+251 911 000000',
      slogan: 'Welcome',
      longer_description: '',
      logo: '',
      banner: '',
      images: [],
      available_locations: [form.value.location || 'Addis Ababa'],
      food_specifications: ''
    }

    if (isEditMode.value) {
      await apiFetch(`/restaurants/${form.value.id}`, {
        method: 'PUT',
        body: payload
      })
      triggerToast('Restaurant updated on backend!')
    } else {
      await apiFetch('/restaurants', {
        method: 'POST',
        body: payload
      })
      triggerToast('Restaurant created on backend!')
    }
    await loadBackendDashboard()
  } catch (err: any) {
    console.error('Error saving restaurant:', err)
    triggerToast(err.data?.error || 'Failed to save restaurant on backend')
  }
  addEditModalOpen.value = false
}

function toggleSuspend(rest: any) {
  rest.status = rest.status === 'Suspended' ? 'Active' : 'Suspended'
  triggerToast(`Status: ${rest.status}`)
}

async function confirmDelete(rest: any) {
  if (confirm(`Delete ${rest.name}?`)) {
    try {
      await apiFetch(`/restaurants/${rest.id}`, { method: 'DELETE' })
      triggerToast('Restaurant deleted on backend!')
      await loadBackendDashboard()
    } catch (err: any) {
      console.error('Error deleting restaurant:', err)
      triggerToast(err.data?.error || 'Failed to delete restaurant')
    }
  }
}
function togglePaymentStatus(pay: any) { pay.status = pay.status === 'Paid' ? 'Unpaid' : 'Paid'; triggerToast(`${pay.id}: ${pay.status}`) }

const chartInstances: Chart[] = []
function destroyCharts() { chartInstances.forEach(c => c.destroy()); chartInstances.length = 0 }

function initCharts() {
  destroyCharts()
  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } } } }
  if (perfChart.value) chartInstances.push(new Chart(perfChart.value, { type: 'line', data: { labels: ['W1','W2','W3','W4','W5','W6'], datasets: [{ label: 'Views', data: [180000,240000,310000,290000,420000,482900], borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.1)', fill: true, tension: 0.4, borderWidth: 3 }] }, options: chartOpts }))
  if (revChart.value) chartInstances.push(new Chart(revChart.value, { type: 'bar', data: { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'], datasets: [{ label: 'Basic', data: [45000,72000,91000,105000,134000,150000,179990], backgroundColor: '#10b981', borderRadius: 6 }, { label: 'Subs', data: [80000,95000,110000,130000,155000,180000,218900], backgroundColor: '#a855f7', borderRadius: 6 }] }, options: { ...chartOpts, plugins: { legend: { labels: { color: '#fff' } } }, scales: { x: { stacked: true, grid: { display: false }, ticks: { color: '#a1a1aa' } }, y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a1a1aa' } } } } }))
  if (planChart.value) chartInstances.push(new Chart(planChart.value, { type: 'doughnut', data: { labels: ['Premium','Basic'], datasets: [{ data: [65,35], backgroundColor: ['#a855f7','#34d399'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 12 } } } } }))
  if (catChart.value) chartInstances.push(new Chart(catChart.value, { type: 'doughnut', data: { labels: ['Meat & Tibs','Beverages','Burgers','Vegan'], datasets: [{ data: [40,25,20,15], backgroundColor: ['#a855f7','#10b981','#3b82f6','#ec4899'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#fff', boxWidth: 10 } } } } }))
  if (peakChart.value) chartInstances.push(new Chart(peakChart.value, { type: 'line', data: { labels: ['10AM','12PM','2PM','4PM','6PM','8PM','10PM'], datasets: [{ label: 'Scans', data: [1200,18500,9400,6200,24000,42000,15300], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.3 }] }, options: chartOpts }))
}

onMounted(() => { nextTick(() => initCharts()) })
watch(currentTab, () => { nextTick(() => initCharts()) })
</script>

<style scoped>
.dash-root { font-family: 'Literata', serif; background: #050806; color: #e4e4e7; min-height: 100vh; }
.toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 99; background: #a855f7; color: #fff; font-weight: 700; font-size: .75rem; padding: .75rem 1.25rem; border-radius: 1rem; display: flex; align-items: center; gap: .5rem; box-shadow: 0 0 25px rgba(168,85,247,.3); }
.dash-layout { display: flex; min-height: 100vh; }
.dash-sidebar { width: 260px; background: #0a0f0d; border-right: 1px solid rgba(255,255,255,.06); display: flex; flex-direction: column; justify-content: space-between; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.sidebar-top { padding: 1.5rem; }
.brand-logo { display: flex; align-items: center; gap: .75rem; margin-bottom: 2rem; }
.brand-icon { width: 40px; height: 40px; border-radius: .75rem; background: rgba(168,85,247,.2); border: 1px solid rgba(168,85,247,.3); display: flex; align-items: center; justify-content: center; color: #a855f7; }
.brand-name { display: block; font-weight: 900; font-size: 1.1rem; color: #fff; letter-spacing: -.02em; text-transform: uppercase; }
.brand-sub { display: block; font-size: .55rem; color: #a855f7; font-weight: 700; text-transform: uppercase; letter-spacing: .15em; }
.sidebar-nav { display: flex; flex-direction: column; gap: .375rem; }
.nav-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: .75rem 1rem; border-radius: .75rem; font-size: .75rem; font-weight: 700; color: #a1a1aa; background: transparent; border: none; cursor: pointer; transition: all .2s; }
.nav-btn:hover { color: #fff; background: rgba(255,255,255,.04); }
.nav-btn.active { background: linear-gradient(90deg, rgba(168,85,247,.25) 0%, rgba(168,85,247,.05) 100%); border-left: 3px solid #a855f7; color: #fff; }
.nav-btn-left { display: flex; align-items: center; gap: .75rem; }
.nav-badge { font-size: .55rem; padding: .15rem .5rem; border-radius: 999px; font-weight: 800; text-transform: uppercase; }
.nav-badge.green { background: rgba(16,185,129,.2); color: #34d399; border: 1px solid rgba(16,185,129,.3); }
.nav-badge.purple { background: rgba(168,85,247,.2); color: #a855f7; border: 1px solid rgba(168,85,247,.3); }
.nav-badge.amber { background: rgba(245,158,11,.2); color: #f59e0b; border: 1px solid rgba(245,158,11,.3); }
.nav-badge.blue { background: rgba(59,130,246,.2); color: #60a5fa; border: 1px solid rgba(59,130,246,.3); }
.sidebar-bottom { padding: 1.5rem; border-top: 1px solid rgba(255,255,255,.04); }
.system-status { display: flex; align-items: center; gap: .5rem; font-size: .625rem; color: #71717a; font-weight: 600; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; animation: pulse 2s infinite; }
.status-live { margin-left: auto; color: #a1a1aa; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
.dash-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.dash-header { height: 5rem; border-bottom: 1px solid rgba(255,255,255,.06); background: rgba(10,15,13,.6); backdrop-filter: blur(12px); padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; }
.header-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: .5rem; }
.header-badge { font-size: .65rem; background: rgba(168,85,247,.2); color: #a855f7; font-weight: 800; padding: .2rem .6rem; border-radius: 999px; border: 1px solid rgba(168,85,247,.3); text-transform: uppercase; letter-spacing: .1em; }
.header-sub { font-size: .75rem; color: #a1a1aa; }
.header-tools { display: flex; align-items: center; gap: 1rem; }
.header-tabs { display: flex; background: #050806; padding: .25rem; border-radius: .75rem; border: 1px solid rgba(255,255,255,.08); }
.htab { padding: .375rem .75rem; font-size: .75rem; border-radius: .5rem; color: #a1a1aa; background: transparent; border: none; cursor: pointer; transition: all .2s; }
.htab.active { background: rgba(168,85,247,.3); color: #fff; font-weight: 700; border: 1px solid rgba(168,85,247,.4); }
.dash-content { padding: 2rem; flex: 1; max-width: 1600px; width: 100%; margin: 0 auto; }
.tab-section { display: flex; flex-direction: column; gap: 1.5rem; }
.glass-bg { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,.07); }
.metrics-grid-top { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.metric-card { padding: 1.5rem; border-radius: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.metric-card.purple { background: linear-gradient(135deg, rgba(38,20,48,.6), rgba(15,10,20,.85)); border: 1px solid rgba(168,85,247,.25); }
.metric-header { font-size: .7rem; font-weight: 700; color: #d4d4d8; text-transform: uppercase; letter-spacing: .1em; display: flex; align-items: center; gap: .5rem; }
.metric-header i { color: #a855f7; }
.metric-value { font-size: 2.5rem; font-weight: 900; color: #fff; }
.metric-change { font-size: .7rem; color: #34d399; font-weight: 700; background: rgba(16,185,129,.2); padding: .2rem .5rem; border-radius: .5rem; border: 1px solid rgba(16,185,129,.3); margin-left: .5rem; }
.metric-sub { font-size: .7rem; color: #a1a1aa; }
.mini-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.mini-card { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); padding: 1rem; border-radius: 1rem; display: flex; flex-direction: column; gap: .25rem; }
.mini-header { display: flex; justify-content: space-between; font-size: .7rem; font-weight: 700; color: #a1a1aa; }
.mini-value { font-size: 1.5rem; font-weight: 900; color: #fff; }
.mini-sub { font-size: .6rem; font-weight: 700; }
.chart-card { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); padding: 1.5rem; border-radius: 1.5rem; }
.chart-card h3 { font-size: .9rem; font-weight: 700; color: #fff; margin-bottom: 1rem; display: flex; align-items: center; gap: .5rem; }
.chart-wrap { height: 280px; }
.chart-row { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
.chart-row.triple { grid-template-columns: 1fr 1fr 1fr; }
.chart-card.wide { grid-column: span 1; }
.chart-card.narrow { grid-column: span 1; }
.table-header { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); padding: 1.5rem; border-radius: 1.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; }
.table-header h2 { font-size: 1.1rem; font-weight: 800; color: #fff; }
.table-header p { font-size: .7rem; color: #a1a1aa; }
.table-filters { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
.filter-input, .filter-select { background: #050806; border: 1px solid rgba(255,255,255,.08); border-radius: .75rem; padding: .5rem .75rem; font-size: .75rem; color: #fff; outline: none; }
.filter-input:focus, .filter-select:focus { border-color: #a855f7; }
.add-btn { background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff; font-weight: 700; font-size: .75rem; padding: .6rem 1rem; border-radius: .75rem; border: none; cursor: pointer; display: flex; align-items: center; gap: .5rem; }
.table-wrap { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); border-radius: 1.5rem; overflow: hidden; }
.table-wrap table { width: 100%; text-align: left; font-size: .75rem; border-collapse: collapse; }
.table-wrap thead { background: rgba(5,8,6,.8); }
.table-wrap th { padding: 1rem; color: #a1a1aa; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; font-size: .65rem; border-bottom: 1px solid rgba(255,255,255,.06); }
.table-wrap td { padding: .85rem 1rem; border-bottom: 1px solid rgba(255,255,255,.03); }
.table-wrap tr:hover { background: rgba(255,255,255,.02); }
.center { text-align: center; }
.right { text-align: right; font-weight: 800; color: #fff; }
.bold { font-weight: 700; color: #fff; }
.mono { font-family: monospace; }
.purple-text { color: #a855f7; font-weight: 700; }
.muted { color: #a1a1aa; }
.rest-name-cell { display: flex; align-items: center; gap: .75rem; }
.rest-avatar { width: 36px; height: 36px; border-radius: .75rem; background: linear-gradient(135deg, #27272a, #050806); border: 1px solid rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; color: #a855f7; font-weight: 900; font-size: .75rem; flex-shrink: 0; }
.rest-name { font-weight: 700; color: #fff; font-size: .85rem; }
.rest-owner { font-size: .625rem; color: #a1a1aa; }
.pill { padding: .25rem .6rem; border-radius: 999px; font-size: .6rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; display: inline-block; }
.pill.purple { background: rgba(168,85,247,.2); color: #a855f7; border: 1px solid rgba(168,85,247,.4); }
.pill.blue { background: rgba(59,130,246,.2); color: #60a5fa; border: 1px solid rgba(59,130,246,.4); }
.pill.green { background: rgba(16,185,129,.2); color: #34d399; border: 1px solid rgba(16,185,129,.4); }
.pill.amber { background: rgba(245,158,11,.2); color: #f59e0b; border: 1px solid rgba(245,158,11,.4); }
.pill.red { background: rgba(239,68,68,.2); color: #f87171; border: 1px solid rgba(239,68,68,.4); }
.action-btns { display: flex; align-items: center; justify-content: center; gap: .375rem; }
.action-btns button { width: 28px; height: 28px; border-radius: .5rem; background: #27272a; color: #d4d4d8; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .7rem; transition: all .2s; }
.action-btns button:hover { background: #a855f7; color: #fff; }
.rev-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.rev-card { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); padding: 1.25rem; border-radius: 1rem; }
.rev-label { font-size: .625rem; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: .08em; }
.rev-value { font-size: 1.5rem; font-weight: 900; color: #fff; margin: .25rem 0; }
.rev-sub { font-size: .6rem; font-weight: 700; }
.mgmt-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.mgmt-card { background: linear-gradient(135deg, rgba(20,26,23,.75), rgba(10,15,13,.85)); border: 1px solid rgba(255,255,255,.07); padding: 1.5rem; border-radius: 1.5rem; }
.mgmt-card span { font-size: .7rem; font-weight: 700; color: #a1a1aa; text-transform: uppercase; }
.mgmt-card .mgmt-value { font-size: 2rem; font-weight: 900; color: #fff; }
.mgmt-card p { font-size: .7rem; font-weight: 500; }
.mgmt-card.green { border-left: 4px solid #10b981; } .mgmt-card.green p { color: #34d399; }
.mgmt-card.red { border-left: 4px solid #ef4444; } .mgmt-card.red p { color: #f87171; }
.mgmt-card.purple { border-left: 4px solid #a855f7; } .mgmt-card.purple p { color: #a855f7; }
.action-toggle { font-size: .625rem; padding: .3rem .6rem; border-radius: .5rem; border: none; cursor: pointer; text-transform: uppercase; font-weight: 700; }
.action-toggle.active { background: #10b981; color: #000; }
.action-toggle.muted { background: #27272a; color: #a1a1aa; }
.top-foods { display: flex; flex-direction: column; gap: .75rem; }
.top-food-item { display: flex; align-items: center; justify-content: space-between; padding: .75rem; border-radius: 1rem; background: rgba(5,8,6,.6); border: 1px solid rgba(255,255,255,.06); }
.top-food-left { display: flex; align-items: center; gap: .75rem; }
.top-food-rank { width: 24px; height: 24px; border-radius: 50%; background: rgba(168,85,247,.2); color: #a855f7; font-weight: 900; font-size: .65rem; display: flex; align-items: center; justify-content: center; }
.top-food-left h5 { font-size: .75rem; font-weight: 700; color: #fff; margin: 0; }
.top-food-left span { font-size: .6rem; color: #a1a1aa; }
.top-food-views { font-size: .7rem; font-weight: 700; color: #34d399; }
.modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.8); backdrop-filter: blur(8px); padding: 1rem; }
.modal-box { position: relative; background: #0a0f0d; border: 1px solid rgba(168,85,247,.4); width: 100%; max-width: 560px; border-radius: 1.5rem; padding: 1.5rem 2rem; z-index: 10; }
.modal-box.small { max-width: 400px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.06); padding-bottom: 1rem; margin-bottom: 1rem; }
.modal-header h3 { font-size: 1rem; font-weight: 700; color: #fff; }
.modal-header button { background: none; border: none; color: #71717a; cursor: pointer; font-size: 1rem; }
.modal-header button:hover { color: #fff; }
.modal-form { display: flex; flex-direction: column; gap: 1rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.form-grid label { display: block; font-size: .625rem; font-weight: 700; color: #a1a1aa; text-transform: uppercase; margin-bottom: .25rem; }
.form-grid input, .form-grid select { width: 100%; background: #050806; border: 1px solid rgba(255,255,255,.08); border-radius: .75rem; padding: .6rem .75rem; font-size: .75rem; color: #fff; outline: none; }
.form-grid input:focus, .form-grid select:focus { border-color: #a855f7; }
.modal-actions { display: flex; justify-content: flex-end; gap: .75rem; border-top: 1px solid rgba(255,255,255,.06); padding-top: 1rem; }
.btn-cancel { padding: .6rem 1rem; border-radius: .75rem; background: #050806; border: 1px solid rgba(255,255,255,.08); color: #a1a1aa; font-weight: 700; font-size: .75rem; cursor: pointer; }
.btn-submit { padding: .6rem 1.5rem; border-radius: .75rem; background: #a855f7; color: #fff; font-weight: 700; font-size: .75rem; border: none; cursor: pointer; }
.btn-submit.full { width: 100%; margin-top: .5rem; }
.detail-rows { display: flex; flex-direction: column; gap: .5rem; }
.detail-row { display: flex; justify-content: space-between; padding: .4rem 0; border-bottom: 1px solid rgba(255,255,255,.04); font-size: .75rem; }
.detail-row span:first-child { color: #a1a1aa; }
.detail-val { color: #fff; font-weight: 700; }
@media (max-width: 1024px) { .dash-sidebar { display: none; } .metrics-grid-top { grid-template-columns: 1fr; } .chart-row { grid-template-columns: 1fr; } .chart-row.triple { grid-template-columns: 1fr; } .mgmt-cards { grid-template-columns: 1fr; } }
</style>

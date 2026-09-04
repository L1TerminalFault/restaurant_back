<template>
  <div class="prem-root">
    <!-- Toast Notifications -->
    <div class="toast-area">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item">
        <div class="toast-left"><span>✓</span><span v-text="toast.message"></span></div>
        <button @click="removeToast(toast.id)">✕</button>
      </div>
    </div>

    <!-- Login Screen -->
    <template v-if="!isLoggedIn">
      <div class="login-wrap">
        <div class="login-card">
          <div class="login-header">
            <div class="login-icon"><span>🏨</span></div>
            <h2>AWAZE RESTAURANT PORTAL</h2>
            <p>Select your establishment to log in</p>
          </div>
          <form @submit.prevent="login" class="login-form">
            <div>
              <label>Select Establishment</label>
              <select v-model="loginRestId">
                <option v-for="(rest, key) in restaurants" :key="key" :value="key">{{ rest.name }} ({{ rest.amharicName }})</option>
              </select>
            </div>
            <div>
              <label>Security PIN / Password</label>
              <input type="password" v-model="loginPin" placeholder="Enter PIN (Default: 1234)" required />
            </div>
            <button type="submit" class="btn-login">Login to Dashboard</button>
          </form>
          <div class="login-hint">Default PIN: <strong>1234</strong></div>
        </div>
      </div>
    </template>

    <!-- Main Logged-In Layout -->
    <template v-else>
      <div class="app-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div>
            <div class="sidebar-brand">
              <div class="brand-circle"><span>🏢</span></div>
              <div class="brand-info"><h1 v-text="currentRestaurant?.name"></h1><span v-text="currentRestaurant?.location"></span></div>
            </div>
            <nav class="sidebar-nav">
              <button v-for="tab in sidebarTabs" :key="tab.id" @click="activeMainTab = tab.id" :class="['nav-item', activeMainTab === tab.id && 'active']">
                <div class="nav-left"><span>{{ tab.icon }}</span><span>{{ tab.label }}</span></div>
                <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
              </button>
            </nav>
          </div>
          <div class="sidebar-footer">
            <span>Locked session</span>
            <button @click="logout" class="btn-logout">Logout</button>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">

          <!-- TAB: DASHBOARD -->
          <template v-if="activeMainTab === 'dashboard'">
            <div class="tab-content">
              <div class="dash-header-row">
                <div><h2>Management Dashboard</h2><p>Comprehensive real-time analytics for <span class="highlight" v-text="currentRestaurant?.name"></span>.</p></div>
                <div class="insight-banner"><div class="insight-label">💡 Key Operational Highlight</div><p v-text="dashboardInsights.bannerHighlight"></p></div>
              </div>

              <!-- Metrics -->
              <div class="metrics-row">
                <div class="metric" v-for="m in dashMetrics" :key="m.label">
                  <div class="metric-top"><span>{{ m.label }}</span><span>{{ m.emoji }}</span></div>
                  <div class="metric-val" :style="{color: m.color}" v-text="m.value"></div>
                  <span class="metric-sub" :style="{color: m.subColor}">{{ m.sub }}</span>
                </div>
              </div>

              <!-- Awaze Score -->
              <div class="card">
                <div class="score-header">
                  <div><h3>⭐ Awaze Score Breakdown</h3><p>Algorithmic quality rating across critical vectors.</p></div>
                  <div class="score-badge">Overall: {{ awazeScores.overall }}/100</div>
                </div>
                <div class="score-grid">
                  <div v-for="s in scoreItems" :key="s.label" class="score-item">
                    <span class="score-label">{{ s.label }}</span>
                    <span class="score-val" :style="{color: s.color}">{{ s.value }}/100</span>
                  </div>
                </div>
              </div>

              <!-- AI + Monthly Report -->
              <div class="two-col">
                <div class="card">
                  <h3>🤖 AI Recommendations</h3>
                  <p class="card-sub">Actionable insights from active backend menu data.</p>
                  <div v-for="(rec, idx) in aiRecommendations" :key="idx" class="ai-rec" :class="{ 'highlight-rec': idx === 0 }" v-html="rec"></div>
                  <div class="card-footer">Updated live from backend data</div>
                </div>
                <div class="card">
                  <h3>📈 Menu Performance Overview</h3>
                  <p class="card-sub">Summary of live menu indicators.</p>
                  <div class="report-grid">
                    <div class="report-item"><span>Total Items:</span><strong class="green">{{ currentRestaurant?.menuItems?.length || 0 }} items</strong></div>
                    <div class="report-item"><span>Top Dish:</span><strong v-text="topViewedItem?.name || 'N/A'"></strong></div>
                    <div class="report-item"><span>Categories:</span><strong v-text="uniqueSubCategories.length"></strong></div>
                    <div class="report-item"><span>Customer Reviews:</span><strong class="amber">{{ notifications.length }} comments</strong></div>
                  </div>
                  <div class="card-footer">Overall Score: <strong class="green">{{ awazeScores.overall }}/100</strong></div>
                </div>
              </div>

              <!-- Analytics Cards -->
              <div class="three-col">
                <div class="card">
                  <h3>🔥 Food Popularity Analysis</h3>
                  <div class="analysis-item good" v-if="topViewedItem">
                    <span class="analysis-label">Highest Rated: {{ topViewedItem.name }}</span>
                    <p>Rating: {{ topViewedItem.rating }} ⭐ with {{ topViewedItem.reviews }} reviews.</p>
                  </div>
                  <div class="analysis-item bad" v-if="leastViewedItem && leastViewedItem !== topViewedItem">
                    <span class="analysis-label red">Needs Attention: {{ leastViewedItem.name }}</span>
                    <p>Price: ETB {{ leastViewedItem.price }}. Consider enhancing description or photo.</p>
                  </div>
                </div>
                <div class="card">
                  <h3>📊 Category View Percentages</h3>
                  <div class="cat-bars">
                    <div v-for="cat in categoryPercentages" :key="cat.name" class="cat-bar-item">
                      <div class="cat-bar-header"><span>{{ cat.name }}</span><span class="green">{{ cat.percentage }}%</span></div>
                      <div class="cat-bar-track"><div class="cat-bar-fill" :style="{width: cat.percentage + '%'}"></div></div>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <h3>🔄 Menu Item Pairings</h3>
                  <p class="card-sub">Items available in current menu structure.</p>
                  <div class="compare-list">
                    <div v-for="pair in comparisonPairs" :key="pair.pair" class="compare-item">
                      <span v-text="pair.pair"></span><span class="green" v-text="pair.match"></span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Peak Hours + Arrangement -->
              <div class="two-col">
                <div class="card">
                  <h3>⏰ Active Categories Summary</h3>
                  <div class="peak-grid">
                    <div v-for="sub in uniqueSubCategories" :key="sub" class="peak-item">
                      <span v-text="sub"></span><strong class="green">Active</strong>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <h3>📈 Menu Health Analysis</h3>
                  <div class="analysis-item good">
                    <p v-html="arrangementImpact"></p>
                  </div>
                </div>
              </div>

              <!-- Competitor -->
              <div class="card">
                <h3>🏢 Establishment Status Insights</h3>
                <p class="card-sub">Data overview derived from backend records.</p>
                <div class="two-col">
                  <div class="competitor-box"><span class="green label">Current Setup</span><p v-text="competitorInsights.standard"></p></div>
                  <div class="competitor-box"><span class="amber label">Recommendation</span><p v-text="competitorInsights.outperform"></p></div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB: ITEMS -->
          <template v-if="activeMainTab === 'items'">
            <div class="tab-content">
              <div class="items-header">
                <div><h2>Menu Items & Categorization</h2><p>Browse all foods and drinks with filtering.</p></div>
                <div class="item-filters">
                  <select v-model="itemFilterCategory"><option value="all">All Categories</option><option value="food">Foods Only</option><option value="drinks">Drinks Only</option></select>
                  <select v-model="itemFilterSub"><option value="all">All Sub-Categories</option><option v-for="sub in uniqueSubCategories" :key="sub" :value="sub">{{ sub }}</option></select>
                </div>
              </div>
              <div class="items-grid">
                <div v-for="item in filteredMenuItems" :key="item.id" class="item-card">
                  <div class="item-img-wrap"><img :src="item.image" :alt="item.name" @error="($event.target as HTMLImageElement).src='https://placehold.co/600x400/111814/10b981?text=Food'" /><span :class="['item-tag', item.category === 'food' ? 'food' : 'drink']">{{ item.subCategory }}</span></div>
                  <div class="item-body">
                    <div class="item-title-row"><h3 v-text="item.name"></h3><span class="item-price">ETB {{ item.price }}</span></div>
                    <div class="item-am" v-text="item.amharicName"></div>
                    <p class="item-desc" v-text="item.description"></p>
                  </div>
                  <div class="item-footer"><span>Prep: <strong>{{ item.prepTime }}</strong></span><span>⭐ <strong>{{ item.rating }}</strong> ({{ item.reviews }})</span></div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB: NOTIFICATIONS -->
          <template v-if="activeMainTab === 'notifications'">
            <div class="tab-content">
              <div class="card notif-card">
                <div class="notif-header"><div><h2>New Food & Drink Comments</h2><p>Customer feedback submitted via QR scans.</p></div><button @click="notifications = []" class="btn-clear">Clear All</button></div>
                <div class="notif-list">
                  <div v-for="notif in notifications" :key="notif.id" class="notif-item">
                    <span class="notif-icon">💬</span>
                    <div class="notif-body">
                      <div class="notif-top"><span class="notif-user" v-text="notif.user"></span><span class="notif-time" v-text="notif.time"></span></div>
                      <p class="notif-item-name">Item: <strong v-text="notif.item"></strong></p>
                      <p class="notif-comment" v-text="notif.comment"></p>
                    </div>
                  </div>
                  <div v-if="notifications.length === 0" class="notif-empty">No new notifications available.</div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB: IDENTITY -->
          <template v-if="activeMainTab === 'identity'">
            <div class="tab-content">
              <div class="sub-tabs">
                <button v-for="st in identityTabs" :key="st.id" @click="identitySubTab = st.id" :class="['sub-tab', identitySubTab === st.id && 'active']">{{ st.label }}</button>
              </div>

              <!-- Info -->
              <template v-if="identitySubTab === 'informations'">
                <div class="card">
                  <div class="identity-top">
                    <div class="identity-logo"><img :src="currentRestaurant?.logo" alt="Logo" @error="($event.target as HTMLImageElement).src='https://placehold.co/150x150/111814/10b981?text=Logo'" /></div>
                    <div><h2 v-text="currentRestaurant?.name"></h2><div class="am-name" v-text="currentRestaurant?.amharicName"></div><p>📍 {{ currentRestaurant?.location }}</p></div>
                  </div>
                  <div class="two-col"><div class="desc-box"><h4>Description (English)</h4><p v-text="currentRestaurant?.aboutDescriptionEn"></p></div><div class="desc-box"><h4>Description (Amharic)</h4><p v-text="currentRestaurant?.aboutDescriptionAm"></p></div></div>
                  <div class="two-col"><div class="desc-box"><h4>Subtitle (English)</h4><p v-text="currentRestaurant?.aboutSubtitleEn"></p></div><div class="desc-box"><h4>Subtitle (Amharic)</h4><p v-text="currentRestaurant?.aboutSubtitleAm"></p></div></div>
                  <h3>Establishment Statistics</h3>
                  <div class="stats-grid"><div v-for="stat in currentRestaurant?.stats" :key="stat.num" class="stat-item"><div class="stat-num" v-text="stat.num"></div><div v-text="stat.text"></div><div class="stat-am" v-text="stat.amharicText"></div></div></div>
                  <h3>Gallery</h3>
                  <div class="gallery-grid"><div v-for="slide in currentRestaurant?.aboutSlides" :key="slide.title" class="gallery-item"><img :src="slide.image" /><div v-text="slide.title"></div></div></div>
                </div>
              </template>

              <!-- Edit Profile -->
              <template v-if="identitySubTab === 'edit_profile'">
                <div class="card">
                  <h3>Edit Establishment Profile</h3><p class="card-sub">Update name, tagline, location, logo, and descriptions.</p>
                  <form @submit.prevent="saveProfileChanges" class="edit-form">
                    <div class="form-row"><div><label>Name (English)</label><input v-model="editForm.name" required /></div><div><label>Name (Amharic)</label><input v-model="editForm.amharicName" /></div></div>
                    <div class="form-row"><div><label>Location</label><input v-model="editForm.location" required /></div><div><label>Logo URL</label><input v-model="editForm.logo" type="url" /></div></div>
                    <div><label>Tagline</label><input v-model="editForm.tagline" /></div>
                    <div class="form-row"><div><label>Description (English)</label><textarea v-model="editForm.aboutDescriptionEn" rows="3"></textarea></div><div><label>Description (Amharic)</label><textarea v-model="editForm.aboutDescriptionAm" rows="3"></textarea></div></div>
                    <div class="form-actions"><button type="submit" class="btn-save">Save Profile Updates</button></div>
                  </form>
                </div>
              </template>

              <!-- Change Password -->
              <template v-if="identitySubTab === 'change_password'">
                <div class="card narrow">
                  <h3>Change Security PIN</h3><p class="card-sub">Update your administrative login password.</p>
                  <form @submit.prevent="updatePassword" class="edit-form">
                    <div><label>Current Password</label><input type="password" v-model="passForm.current" placeholder="Enter current PIN" required /></div>
                    <div><label>New Password</label><input type="password" v-model="passForm.newPass" placeholder="Enter new PIN" required /></div>
                    <div><label>Confirm Password</label><input type="password" v-model="passForm.confirm" placeholder="Confirm new PIN" required /></div>
                    <button type="submit" class="btn-save full">Update Password</button>
                  </form>
                </div>
              </template>
            </div>
          </template>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { apiFetch } = useApi()
const { token, user, setAuth, clearAuth } = useAuth()

useHead({ title: 'Awaze - Premium Admin Portal', link: [
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,200..900&display=swap' }
]})

const isLoggedIn = ref(!!token.value)
const loginRestId = ref('girum')
const loginPin = ref('')
const activeMainTab = ref('dashboard')
const identitySubTab = ref('informations')
const itemFilterCategory = ref('all')
const itemFilterSub = ref('all')
const toasts = ref<any[]>([])
const notifications = ref<any[]>([])
const categoriesList = ref<any[]>([])
const addCategoryModalOpen = ref(false)
const addItemModalOpen = ref(false)
const newCategoryName = ref('')
const foodForm = ref<any>({ categoryId: null, name: '', name_am: '', price: 0, description: '', pic: '' })
const passForm = ref({ current: '', newPass: '', confirm: '' })
const editForm = ref<any>({})
const currentPassword = ref('1234')
const currentRestaurantId = ref('girum')

const sidebarTabs = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'items', icon: '🍽️', label: 'Items' },
  { id: 'notifications', icon: '💬', label: 'Notifications', badge: '3' },
  { id: 'identity', icon: '⚙️', label: 'Identity & Profile' },
]
const identityTabs = [
  { id: 'informations', label: 'Informations' },
  { id: 'edit_profile', label: 'Edit Profile' },
  { id: 'change_password', label: 'Change Password' },
]

const loadedRestaurant = ref<any>({
  id: '',
  name: '',
  amharicName: '',
  tagline: '',
  location: '',
  logo: '',
  aboutDescriptionEn: '',
  aboutDescriptionAm: '',
  aboutSubtitleEn: '',
  aboutSubtitleAm: '',
  aboutSlides: [],
  stats: [],
  menuItems: []
})
const currentRestaurant = computed(() => loadedRestaurant.value)

const uniqueSubCategories = computed(() => [...new Set((currentRestaurant.value?.menuItems || []).map((i: any) => i.subCategory))])

const dashboardInsights = computed(() => {
  const top = topViewedItem.value
  return {
    bannerHighlight: top
      ? `Live Analytics: "${top.name}" is currently your highest rated item (${top.rating} ⭐ with ${top.reviews} reviews).`
      : "Live analytics connected to backend API."
  }
})

const categoryPercentages = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  if (items.length === 0) return []
  const counts: Record<string, number> = {}
  items.forEach((item: any) => {
    const cat = item.subCategory || 'General'
    counts[cat] = (counts[cat] || 0) + 1
  })
  return Object.keys(counts).map(cat => ({
    name: cat,
    percentage: Math.round((counts[cat] / items.length) * 100)
  }))
})

const topViewedItem = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  if (items.length === 0) return null
  return items.reduce((prev: any, curr: any) => (Number(curr.reviews) > Number(prev.reviews) ? curr : prev), items[0])
})

const leastViewedItem = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  if (items.length === 0) return null
  return items.reduce((prev: any, curr: any) => (Number(curr.reviews) < Number(prev.reviews) ? curr : prev), items[0])
})

const awazeScores = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  const hasLogo = Boolean(currentRestaurant.value?.logo)
  const hasDesc = Boolean(currentRestaurant.value?.aboutDescriptionEn)
  const itemsWithPics = items.filter((i: any) => Boolean(i.image)).length
  const photoScore = items.length > 0 ? Math.round((itemsWithPics / items.length) * 100) : 50
  const completeness = (hasLogo ? 30 : 0) + (hasDesc ? 30 : 0) + (items.length > 0 ? 40 : 0)
  return {
    overall: Math.round((photoScore + completeness) / 2),
    photography: photoScore,
    menuQuality: items.length > 5 ? 90 : items.length * 15,
    popularity: notifications.value.length > 0 ? 85 : 50,
    customerEngagement: notifications.value.length > 0 ? 90 : 60,
    completeness: completeness,
    menuFreshness: 85
  }
})

const scoreItems = computed(() => [
  { label: 'Photography', value: awazeScores.value.photography, color: '#34d399' },
  { label: 'Menu Quality', value: awazeScores.value.menuQuality, color: '#34d399' },
  { label: 'Popularity', value: awazeScores.value.popularity, color: '#34d399' },
  { label: 'Engagement', value: awazeScores.value.customerEngagement, color: '#34d399' },
  { label: 'Completeness', value: awazeScores.value.completeness, color: '#34d399' },
  { label: 'Freshness', value: awazeScores.value.menuFreshness, color: '#f59e0b' },
])

const dashMetrics = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  return [
    { label: 'Total Items', emoji: '🍽️', value: String(items.length), color: '#fff', sub: 'Live menu items', subColor: '#34d399' },
    { label: 'Customer Reviews', emoji: '💬', value: String(notifications.value.length), color: '#fff', sub: 'Submitted comments', subColor: '#60a5fa' },
    { label: 'Categories', emoji: '📂', value: String(uniqueSubCategories.value.length), color: '#f59e0b', sub: 'Active food groups', subColor: '#a1a1aa' },
    { label: 'Avg Rating', emoji: '⭐', value: items.length > 0 ? (items.reduce((acc: number, i: any) => acc + Number(i.rating || 0), 0) / items.length).toFixed(1) : 'N/A', color: '#a855f7', sub: 'Based on feedback', subColor: '#a1a1aa' },
  ]
})

const aiRecommendations = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  if (items.length === 0) return ["Add your first menu items to unlock AI menu insights."]
  const top = topViewedItem.value
  const recs = []
  if (top) {
    recs.push(`"<strong>${top.name}</strong> is your top dish with an average rating of ${top.rating} ⭐. Feature it prominently on your landing page."`)
  }
  recs.push(`"Your establishment has ${items.length} items spread across ${uniqueSubCategories.value.length} categories."`)
  return recs
})

const comparisonPairs = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  if (items.length < 2) return []
  return [
    { pair: `${items[0]?.name} & ${items[1]?.name}`, match: 'Active Menu Pair' },
    ...(items.length > 3 ? [{ pair: `${items[2]?.name} & ${items[3]?.name}`, match: 'Active Menu Pair' }] : [])
  ]
})

const arrangementImpact = computed(() => {
  const top = topViewedItem.value
  if (!top) return "No menu data active."
  return `Top item <strong>${top.name}</strong> has received ${top.reviews || 0} customer reviews and an average rating of ${top.rating || 5.0} stars.`
})

const competitorInsights = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  return {
    standard: `Currently presenting ${items.length} total items across ${uniqueSubCategories.value.length} menu categories.`,
    outperform: items.length > 5 ? 'Comprehensive menu coverage available to diners.' : 'Consider adding more items to expand your selection.'
  }
})
const filteredMenuItems = computed(() => (currentRestaurant.value?.menuItems || []).filter((item: any) => {
  if (itemFilterCategory.value !== 'all' && item.category !== itemFilterCategory.value) return false
  if (itemFilterSub.value !== 'all' && item.subCategory !== itemFilterSub.value) return false
  return true
}))

function addToast(msg: string) { const id = Date.now(); toasts.value.push({ id, message: msg }); setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000) }
function removeToast(id: number) { toasts.value = toasts.value.filter(t => t.id !== id) }
function resetEditForm() { if (currentRestaurant.value) editForm.value = JSON.parse(JSON.stringify(currentRestaurant.value)) }

async function fetchBackendData() {
  const route = useRoute()
  const requestedId = (route.query.r || route.query.restaurant || route.query.id) as string
  try {
    let targetId = requestedId
    if (!targetId) {
      const list: any = await apiFetch('/public/restaurants')
      if (list && list.length > 0) {
        targetId = list[0].id || list[0].ID || list[0].custom_sub_link
      }
    }
    if (targetId) {
      const detailed: any = await apiFetch(`/public/restaurants/${targetId}`)
      if (detailed) {
        let menuItems: any[] = []
        let liveNotifications: any[] = []
        let cats: any[] = []
        if (detailed.categories) {
          cats = detailed.categories.map((c: any) => ({ id: c.id, name: c.name }))
          for (const cat of detailed.categories) {
            if (cat.foods) {
              for (const f of cat.foods) {
                if (f.comments && f.comments.length > 0) {
                  for (const c of f.comments) {
                    liveNotifications.push({
                      id: c.id,
                      user: c.author_name || 'Diner',
                      item: f.name,
                      comment: c.message || `Rating: ${c.rating}/5 stars`,
                      time: c.created_at ? new Date(c.created_at).toLocaleTimeString() : 'Recently'
                    })
                  }
                }
                menuItems.push({
                  id: f.id,
                  categoryId: cat.id,
                  name: f.name,
                  amharicName: f.name_am || f.name,
                  category: cat.name?.toLowerCase().includes('drink') || cat.name?.toLowerCase().includes('beverage') ? 'drinks' : 'food',
                  subCategory: cat.name || 'General',
                  price: f.price,
                  rating: f.rating_amount ? (f.rating_amount / (f.rating_count || 1)).toFixed(1) : 4.5,
                  reviews: f.rating_count || 0,
                  prepTime: f.prep_time_minutes ? `${f.prep_time_minutes} min` : '15 min',
                  description: f.description || '',
                  image: f.pic || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
                })
              }
            }
          }
        }
        categoriesList.value = cats
        if (cats.length > 0 && !foodForm.value.categoryId) {
          foodForm.value.categoryId = cats[0].id
        }
        if (liveNotifications.length > 0) {
          notifications.value = liveNotifications
        }
        loadedRestaurant.value = {
          id: detailed.id,
          name: detailed.name_en || detailed.name || 'Restaurant',
          amharicName: detailed.name_am || '',
          tagline: detailed.slogan || '',
          location: detailed.location || '',
          logo: detailed.logo || '',
          aboutDescriptionEn: detailed.longer_description || '',
          aboutDescriptionAm: detailed.longer_description || '',
          aboutSubtitleEn: detailed.slogan || '',
          aboutSubtitleAm: detailed.slogan || '',
          aboutSlides: (detailed.images || []).map((img: string) => ({ title: 'Gallery', image: img })),
          stats: [],
          menuItems: menuItems
        }
      }
    }
  } catch (err) {
    console.warn('API fetch warning in premium admin:', err)
  }
}

async function login() {
  try {
    const res: any = await apiFetch('/auth/login', {
      method: 'POST',
      body: {
        email: loginRestId.value.trim(),
        password: loginPin.value
      }
    })
    if (res.token) {
      setAuth(res.token, res.user)
      isLoggedIn.value = true
      resetEditForm()
      addToast('Logged in successfully!')
      fetchBackendData()
      return
    }
  } catch (e) {
    // If backend auth fails, fallback to pin check for local demo
  }
  if (loginPin.value.trim() === currentPassword.value || loginPin.value.trim() === '1234') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('awaze_restaurant_session', JSON.stringify({ isLoggedIn: true }))
    }
    isLoggedIn.value = true
    resetEditForm()
    addToast('Logged in!')
    fetchBackendData()
  } else {
    addToast('Incorrect credentials.')
  }
}

function logout() {
  clearAuth()
  if (typeof window !== 'undefined') {
    localStorage.removeItem('awaze_restaurant_session')
  }
  isLoggedIn.value = false
  loginPin.value = ''
  addToast('Logged out')
}

async function saveProfileChanges() {
  try {
    const payload = {
      name_en: editForm.value.name,
      name_am: editForm.value.amharicName || editForm.value.name,
      custom_sub_link: loadedRestaurant.value?.id || 'girum',
      location: editForm.value.location,
      logo: editForm.value.logo,
      slogan: editForm.value.tagline,
      longer_description: editForm.value.aboutDescriptionEn
    }
    const rId = loadedRestaurant.value?.id || 'girum'
    await apiFetch(`/restaurants/${rId}`, {
      method: 'PUT',
      body: payload
    })
    addToast('Profile updated on backend!')
    await fetchBackendData()
  } catch (err: any) {
    console.error('Save profile error:', err)
    addToast(err.data?.error || 'Failed to update profile on backend')
  }
}

async function updatePassword() {
  if (passForm.value.newPass !== passForm.value.confirm) {
    addToast('Passwords do not match')
    return
  }
  try {
    await apiFetch('/user/profile', {
      method: 'PUT',
      body: {
        full_name: user.value?.full_name || 'Restaurant Owner',
        email: user.value?.email || 'owner@example.com',
        password: passForm.value.newPass
      }
    })
    addToast('Password updated on backend!')
    passForm.value = { current: '', newPass: '', confirm: '' }
  } catch (err: any) {
    console.error('Update password error:', err)
    addToast(err.data?.error || 'Failed to update password on backend')
  }
}

onMounted(() => {
  const route = useRoute()
  const storedSession = typeof window !== 'undefined' ? localStorage.getItem('awaze_restaurant_session') : null
  if (route.query.autoLogin === 'true' || route.query.r || token.value || storedSession) {
    isLoggedIn.value = true
    if (typeof window !== 'undefined' && !storedSession) {
      localStorage.setItem('awaze_restaurant_session', JSON.stringify({ isLoggedIn: true }))
    }
  }
  resetEditForm()
  fetchBackendData()
})
</script>

<style scoped>
.prem-root { font-family: 'Literata', serif; background: #0b0f0d; color: #f1f5f9; min-height: 100vh; font-size: .925rem; }
.toast-area { position: fixed; top: 1.25rem; right: 1.25rem; z-index: 50; display: flex; flex-direction: column; gap: .5rem; max-width: 350px; pointer-events: none; }
.toast-item { pointer-events: auto; padding: 1rem; border-radius: .75rem; display: flex; align-items: center; justify-content: space-between; border: 1px solid #10b981; background: #022c22; color: #a7f3d0; }
.toast-left { display: flex; align-items: center; gap: .5rem; font-weight: 700; font-size: .875rem; }
.toast-item button { font-size: .7rem; color: #a1a1aa; background: none; border: none; cursor: pointer; }
.login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; background: radial-gradient(ellipse at top, #0d1c13, #050806, #020403); }
.login-card { background: #111814; border: 1px solid rgba(16,185,129,.3); padding: 1.5rem 2rem; border-radius: 1.5rem; max-width: 28rem; width: 100%; box-shadow: 0 25px 50px rgba(0,0,0,.5); }
.login-header { text-align: center; margin-bottom: 1.5rem; }
.login-icon { width: 3.5rem; height: 3.5rem; border-radius: 50%; background: rgba(16,185,129,.2); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.25rem; }
.login-header h2 { font-size: 1.5rem; font-weight: 700; color: #fff; }
.login-header p { font-size: .75rem; color: #34d399; margin-top: .25rem; }
.login-form { display: flex; flex-direction: column; gap: 1rem; }
.login-form label { display: block; font-size: .7rem; font-weight: 700; color: #d4d4d8; text-transform: uppercase; margin-bottom: .25rem; }
.login-form input, .login-form select { width: 100%; background: #0b0f0d; border: 1px solid #064e3b; color: #fff; font-size: .875rem; border-radius: .75rem; padding: .625rem 1rem; outline: none; }
.login-form input:focus, .login-form select:focus { border-color: #10b981; }
.btn-login { width: 100%; background: #059669; color: #000; font-weight: 700; font-size: .875rem; padding: .75rem; border-radius: .75rem; border: none; cursor: pointer; }
.btn-login:hover { background: #10b981; }
.login-hint { text-align: center; font-size: .75rem; color: #a1a1aa; margin-top: 1rem; }
.login-hint strong { color: #34d399; }
.app-layout { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background: #0d1410; border-right: 1px solid #022c22; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
.sidebar-brand { display: flex; align-items: center; gap: .75rem; margin-bottom: 1.5rem; padding: .6rem; border-radius: 1rem; background: #0b0f0d; border: 1px solid rgba(16,185,129,.25); }
.brand-circle { width: 2.5rem; height: 2.5rem; border-radius: 50%; background: rgba(16,185,129,.2); border: 1px solid #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.brand-info { overflow: hidden; }
.brand-info h1 { font-size: .875rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
.brand-info span { font-size: .65rem; color: #34d399; display: block; }
.sidebar-nav { display: flex; flex-direction: column; gap: .375rem; }
.nav-item { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: .625rem .875rem; border-radius: .75rem; font-size: .875rem; color: #d4d4d8; background: none; border: none; cursor: pointer; transition: all .2s; }
.nav-item:hover { color: #fff; background: rgba(16,185,129,.08); }
.nav-item.active { background: #059669; color: #000; font-weight: 700; box-shadow: 0 4px 12px rgba(5,150,105,.3); }
.nav-left { display: flex; align-items: center; gap: .625rem; }
.nav-badge { background: #10b981; color: #000; font-size: .6rem; font-weight: 700; padding: .15rem .375rem; border-radius: 999px; }
.sidebar-footer { padding-top: 1rem; margin-top: 1rem; border-top: 1px solid #022c22; display: flex; align-items: center; justify-content: space-between; font-size: .65rem; color: #a1a1aa; }
.btn-logout { font-size: .75rem; font-weight: 700; color: #f87171; padding: .375rem .625rem; border-radius: .5rem; border: 1px solid #450a0a; background: rgba(69,10,10,.2); cursor: pointer; }
.main-content { flex-grow: 1; padding: 1.25rem 2rem; overflow-y: auto; max-width: 80rem; margin: 0 auto; width: 100%; }
.tab-content { display: flex; flex-direction: column; gap: 1.5rem; }
.dash-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
.dash-header-row h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.dash-header-row > div > p { font-size: .75rem; color: #a1a1aa; }
.highlight { color: #34d399; }
.insight-banner { background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.3); padding: .75rem; border-radius: 1rem; max-width: 32rem; }
.insight-label { font-size: .65rem; font-weight: 700; color: #34d399; text-transform: uppercase; margin-bottom: .25rem; }
.insight-banner p { font-size: .75rem; color: #e4e4e7; margin: 0; }
.metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.metric { background: #111814; border: 1px solid #022c22; padding: 1.25rem; border-radius: 1rem; }
.metric-top { display: flex; justify-content: space-between; font-size: .7rem; font-weight: 700; color: #a1a1aa; text-transform: uppercase; margin-bottom: .5rem; }
.metric-val { font-size: 1.875rem; font-weight: 700; }
.metric-sub { font-size: .65rem; font-weight: 600; display: block; margin-top: .25rem; }
.card { background: #111814; border: 1px solid #022c22; border-radius: 1.5rem; padding: 1.5rem; }
.card.narrow { max-width: 28rem; margin: 0 auto; }
.card h3 { font-size: 1.1rem; font-weight: 700; color: #fff; margin: 0 0 .25rem; }
.card-sub { font-size: .75rem; color: #a1a1aa; margin: 0 0 1rem; }
.card-footer { font-size: .65rem; color: #34d399; margin-top: 1rem; padding-top: .75rem; border-top: 1px solid #022c22; }
.score-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem; }
.score-header p { font-size: .75rem; color: #a1a1aa; margin: 0; }
.score-badge { background: #059669; color: #000; padding: .5rem 1rem; border-radius: 1rem; font-weight: 800; font-size: 1.25rem; }
.score-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: .75rem; }
.score-item { background: #0b0f0d; padding: .875rem; border-radius: 1rem; border: 1px solid #022c22; text-align: center; }
.score-label { font-size: .65rem; color: #a1a1aa; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: .25rem; }
.score-val { font-size: 1.25rem; font-weight: 700; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
.ai-rec { padding: 1rem; border-radius: 1rem; font-size: .75rem; line-height: 1.6; margin-bottom: .75rem; }
.ai-rec.highlight-rec { background: rgba(16,185,129,.1); border: 1px solid rgba(16,185,129,.3); color: #a7f3d0; }
.ai-rec:not(.highlight-rec) { background: #0b0f0d; border: 1px solid #022c22; color: #d4d4d8; }
.report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.report-item { padding: .75rem; background: #0b0f0d; border-radius: .75rem; border: 1px solid #022c22; font-size: .75rem; }
.report-item span { color: #a1a1aa; display: block; }
.report-item strong { color: #fff; font-size: .875rem; }
.green { color: #34d399 !important; }
.amber { color: #f59e0b !important; }
.blue { color: #60a5fa !important; }
.muted { color: #a1a1aa !important; }
.analysis-item { padding: .875rem; border-radius: 1rem; font-size: .75rem; margin-bottom: .75rem; }
.analysis-item.good { background: rgba(16,185,129,.06); border: 1px solid rgba(16,185,129,.2); }
.analysis-item.bad { background: rgba(127,29,29,.1); border: 1px solid #450a0a; }
.analysis-label { font-size: .6rem; font-weight: 700; text-transform: uppercase; color: #34d399; display: block; margin-bottom: .25rem; }
.analysis-label.red { color: #f87171; }
.analysis-item p { color: #d4d4d8; margin: .25rem 0 0; line-height: 1.6; }
.muted-text { color: #a1a1aa; }
.cat-bars { display: flex; flex-direction: column; gap: .75rem; }
.cat-bar-header { display: flex; justify-content: space-between; font-size: .75rem; font-weight: 700; margin-bottom: .25rem; }
.cat-bar-header span:first-child { color: #fff; }
.cat-bar-track { width: 100%; background: #0b0f0d; height: .625rem; border-radius: 999px; overflow: hidden; border: 1px solid #022c22; }
.cat-bar-fill { background: #059669; height: 100%; border-radius: 999px; transition: width .5s; }
.compare-list { display: flex; flex-direction: column; gap: .625rem; }
.compare-item { padding: .75rem; background: #0b0f0d; border-radius: .75rem; border: 1px solid #022c22; display: flex; justify-content: space-between; align-items: center; font-size: .75rem; }
.compare-item span:first-child { color: #fff; }
.peak-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: .625rem; text-align: center; }
.peak-item { padding: .75rem; background: #0b0f0d; border-radius: 1rem; border: 1px solid #022c22; font-size: .75rem; }
.peak-item span { color: #a1a1aa; display: block; margin-bottom: .25rem; }
.peak-item strong { font-size: .875rem; }
.competitor-box { padding: 1rem; background: #0b0f0d; border-radius: 1rem; border: 1px solid #022c22; font-size: .75rem; }
.competitor-box .label { display: block; text-transform: uppercase; font-weight: 700; font-size: .65rem; margin-bottom: .25rem; }
.competitor-box p { color: #d4d4d8; line-height: 1.6; margin: 0; }
.items-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
.items-header h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.items-header p { font-size: .75rem; color: #a1a1aa; }
.item-filters { display: flex; gap: .625rem; }
.item-filters select { background: #111814; border: 1px solid #064e3b; font-size: .75rem; font-weight: 700; color: #34d399; border-radius: .75rem; padding: .5rem .875rem; outline: none; }
.items-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
.item-card { background: #111814; border: 1px solid #022c22; border-radius: 1rem; overflow: hidden; display: flex; flex-direction: column; transition: border-color .2s; }
.item-card:hover { border-color: rgba(16,185,129,.3); }
.item-img-wrap { position: relative; height: 10rem; overflow: hidden; }
.item-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.item-tag { position: absolute; top: .625rem; right: .625rem; padding: .15rem .625rem; border-radius: 999px; font-size: .6rem; font-weight: 700; text-transform: uppercase; }
.item-tag.food { background: #451a03; color: #fcd34d; border: 1px solid #78350f; }
.item-tag.drink { background: #172554; color: #93c5fd; border: 1px solid #1e3a5f; }
.item-body { padding: 1rem; flex: 1; }
.item-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: .375rem; }
.item-title-row h3 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.item-price { color: #34d399; font-weight: 700; font-size: .875rem; }
.item-am { font-size: .75rem; color: #6ee7b7; margin-bottom: .375rem; }
.item-desc { font-size: .65rem; color: #a1a1aa; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; }
.item-footer { padding: .75rem 1rem; background: #0b0f0d; border-top: 1px solid #022c22; display: flex; justify-content: space-between; font-size: .65rem; color: #a1a1aa; }
.item-footer strong { color: #fff; }
.notif-card { max-width: 56rem; margin: 0 auto; }
.notif-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #022c22; padding-bottom: 1rem; margin-bottom: 1rem; }
.notif-header h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.notif-header p { font-size: .75rem; color: #a1a1aa; }
.btn-clear { font-size: .75rem; color: #f87171; border: 1px solid #450a0a; background: rgba(69,10,10,.2); padding: .375rem .75rem; border-radius: .75rem; cursor: pointer; }
.notif-list { display: flex; flex-direction: column; gap: .75rem; }
.notif-item { padding: 1rem; background: #0b0f0d; border-radius: 1rem; border: 1px solid #022c22; display: flex; align-items: flex-start; gap: .875rem; }
.notif-icon { font-size: 1.5rem; }
.notif-body { flex: 1; }
.notif-top { display: flex; justify-content: space-between; margin-bottom: .25rem; }
.notif-user { font-weight: 700; color: #fff; font-size: .875rem; }
.notif-time { font-size: .65rem; color: #71717a; }
.notif-item-name { font-size: .75rem; color: #6ee7b7; margin: 0 0 .25rem; }
.notif-comment { font-size: .75rem; color: #d4d4d8; line-height: 1.6; margin: 0; }
.notif-empty { text-align: center; padding: 3rem; color: #71717a; font-size: .75rem; }
.sub-tabs { display: flex; gap: .375rem; background: #111814; padding: .375rem; border-radius: 1rem; border: 1px solid #022c22; }
.sub-tab { padding: .5rem .875rem; border-radius: .75rem; font-size: .75rem; color: #d4d4d8; background: none; border: none; cursor: pointer; transition: all .2s; }
.sub-tab:hover { color: #fff; }
.sub-tab.active { background: #059669; color: #000; font-weight: 700; }
.identity-top { display: flex; align-items: center; gap: 1.25rem; border-bottom: 1px solid #022c22; padding-bottom: 1.25rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
.identity-logo { width: 5rem; height: 5rem; border-radius: 50%; overflow: hidden; border: 2px solid #10b981; flex-shrink: 0; }
.identity-logo img { width: 100%; height: 100%; object-fit: cover; }
.identity-top h2 { font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0; }
.am-name { font-size: 1.1rem; color: #34d399; font-weight: 700; }
.identity-top p { font-size: .75rem; color: #a1a1aa; margin: 0; }
.desc-box { padding: .875rem; background: #0b0f0d; border-radius: 1rem; border: 1px solid #022c22; margin-bottom: 1rem; }
.desc-box h4 { font-size: .65rem; text-transform: uppercase; font-weight: 700; color: #34d399; margin: 0 0 .375rem; }
.desc-box p { font-size: .75rem; color: #d4d4d8; line-height: 1.6; margin: 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-bottom: 1.5rem; }
.stat-item { background: #0b0f0d; padding: .875rem; border-radius: .75rem; border: 1px solid #022c22; text-align: center; font-size: .75rem; color: #fff; font-weight: 700; }
.stat-num { font-size: 1.5rem; font-weight: 700; color: #34d399; }
.stat-am { font-size: .6rem; color: #a1a1aa; }
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; }
.gallery-item { background: #0b0f0d; border-radius: 1rem; border: 1px solid #022c22; overflow: hidden; }
.gallery-item img { height: 7rem; width: 100%; object-fit: cover; }
.gallery-item div { padding: .625rem; text-align: center; font-size: .75rem; font-weight: 700; color: #fff; }
.edit-form { display: flex; flex-direction: column; gap: .875rem; }
.edit-form label { display: block; font-size: .65rem; font-weight: 700; color: #a1a1aa; text-transform: uppercase; margin-bottom: .25rem; }
.edit-form input, .edit-form textarea { width: 100%; background: #0b0f0d; border: 1px solid #064e3b; border-radius: .75rem; padding: .625rem .875rem; color: #fff; font-size: .75rem; outline: none; }
.edit-form input:focus, .edit-form textarea:focus { border-color: #10b981; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: .875rem; }
.form-actions { display: flex; justify-content: flex-end; padding-top: .75rem; }
.btn-save { background: #059669; color: #000; font-weight: 700; font-size: .75rem; padding: .625rem 1.25rem; border-radius: .75rem; border: none; cursor: pointer; }
.btn-save:hover { background: #10b981; }
.btn-save.full { width: 100%; }
@media (max-width: 1024px) { .sidebar { display: none; } .metrics-row { grid-template-columns: 1fr 1fr; } .two-col, .three-col { grid-template-columns: 1fr; } .score-grid { grid-template-columns: repeat(3, 1fr); } .items-grid { grid-template-columns: 1fr 1fr; } .peak-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 640px) { .metrics-row { grid-template-columns: 1fr; } .items-grid { grid-template-columns: 1fr; } .score-grid { grid-template-columns: 1fr 1fr; } .stats-grid, .gallery-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
</style>

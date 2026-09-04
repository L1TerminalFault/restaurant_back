<template>
  <div class="min-h-screen flex flex-col pt-10 pb-10 bg-black">
    <!-- Toast Notifications -->
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <div v-for="toast in toasts" :key="toast.id" class="pointer-events-auto p-4 rounded-xl shadow-xl flex items-center justify-between border bg-emerald-950 border-emerald-500 text-emerald-200">
        <div class="flex items-center space-x-2">
          <span>✓</span>
          <span class="text-sm font-bold" v-text="toast.message"></span>
        </div>
        <button @click="removeToast(toast.id)" class="text-xs ml-3 text-zinc-400 hover:text-white">✕</button>
      </div>
    </div>

    <!-- Login Screen -->
    <template v-if="!isLoggedIn">
      <div class="min-h-[80vh] flex items-center justify-center p-4">
        <div class="bg-[#111814] border border-emerald-900/60 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
          <div class="flex flex-col items-center text-center mb-6">
            <div class="h-14 w-14 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center mb-3">
              <span class="text-xl">🏨</span>
            </div>
            <h2 class="text-2xl font-bold text-white tracking-tight">AWAZE RESTAURANT PORTAL</h2>
            <p class="text-xs text-emerald-400 mt-1">Select your establishment to log in</p>
          </div>

          <form @submit.prevent="login" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Email</label>
              <input type="email" v-model="loginEmail" placeholder="Enter your email" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500" required />
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Password</label>
              <input type="password" v-model="loginPin" placeholder="Enter your password" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500" required />
            </div>

            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm py-3 rounded-xl transition shadow-lg shadow-emerald-950/50 cursor-pointer">
              Login to Dashboard
            </button>
          </form>
          <div class="mt-4 text-center text-xs text-zinc-400">Default PIN: <strong class="text-emerald-400">1234</strong></div>
        </div>
      </div>
    </template>

    <!-- Main Logged-In App Layout -->
    <template v-else>
      <div class="flex flex-col lg:flex-row min-h-[80vh] max-w-[1400px] mx-auto w-full">
        <!-- Sidebar Navigation -->
        <aside class="w-full lg:w-64 bg-[#0d1410] border lg:border-r border-emerald-950 p-5 flex flex-col justify-between shrink-0 rounded-2xl lg:rounded-r-none mb-4 lg:mb-0">
          <div>
            <div class="flex items-center space-x-3 mb-6 p-2.5 rounded-2xl bg-[#0b0f0d] border border-emerald-900/50">
              <div class="h-10 w-10 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center shrink-0">
                <span class="text-base">🏢</span>
              </div>
              <div class="overflow-hidden">
                <h1 class="font-bold text-sm text-white truncate" v-text="currentRestaurant?.name"></h1>
                <span class="text-emerald-400 text-[11px] block truncate" v-text="currentRestaurant?.location"></span>
              </div>
            </div>

            <nav class="space-y-1.5">
              <button @click="activeMainTab = 'dashboard'" :class="activeMainTab === 'dashboard' ? 'bg-emerald-600 text-black font-bold shadow-lg shadow-emerald-950/50' : 'text-zinc-300 hover:text-white hover:bg-emerald-950/30'" class="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer">
                <span>📊</span><span>Dashboard</span>
              </button>
              <button @click="activeMainTab = 'items'" :class="activeMainTab === 'items' ? 'bg-emerald-600 text-black font-bold shadow-lg shadow-emerald-950/50' : 'text-zinc-300 hover:text-white hover:bg-emerald-950/30'" class="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer">
                <span>🍽️</span><span>Items</span>
              </button>
              <button @click="activeMainTab = 'identity'" :class="activeMainTab === 'identity' ? 'bg-emerald-600 text-black font-bold shadow-lg shadow-emerald-950/50' : 'text-zinc-300 hover:text-white hover:bg-emerald-950/30'" class="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer">
                <span>⚙️</span><span>Identity & Profile</span>
              </button>
            </nav>
          </div>

          <div class="pt-4 mt-4 border-t border-emerald-950 flex items-center justify-between">
            <span class="text-[11px] text-zinc-400">Locked session</span>
            <button @click="logout" class="text-xs font-bold text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-lg border border-red-950 bg-red-950/20 cursor-pointer">
              Logout
            </button>
          </div>
        </aside>

        <!-- Main Content View Area -->
        <main class="flex-grow p-5 md:p-8 overflow-y-auto w-full bg-[#080d0a] rounded-2xl lg:rounded-l-none border border-emerald-950 border-l-0">
          
          <!-- TAB 1: DASHBOARD -->
          <template v-if="activeMainTab === 'dashboard'">
            <div class="space-y-6">
              <div>
                <h2 class="text-2xl font-bold text-white">Management Dashboard</h2>
                <p class="text-zinc-400 text-xs">Overview of menu metrics, food/drink counts, and average pricing for <span class="text-emerald-400" v-text="currentRestaurant?.name"></span>.</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-[#111814] border border-emerald-950 p-5 rounded-2xl">
                  <div class="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase mb-2">
                    <span>Total Foods</span><span class="text-emerald-400 text-lg">🍲</span>
                  </div>
                  <div class="text-3xl font-bold text-white" v-text="foodCount"></div>
                  <span class="text-[11px] text-emerald-400 mt-1 block">Registered food dishes</span>
                </div>
                <div class="bg-[#111814] border border-emerald-950 p-5 rounded-2xl">
                  <div class="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase mb-2">
                    <span>Total Drinks</span><span class="text-blue-400 text-lg">🍹</span>
                  </div>
                  <div class="text-3xl font-bold text-white" v-text="drinkCount"></div>
                  <span class="text-[11px] text-blue-400 mt-1 block">Registered beverages</span>
                </div>
                <div class="bg-[#111814] border border-emerald-950 p-5 rounded-2xl">
                  <div class="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase mb-2">
                    <span>Avg Food Price</span><span class="text-amber-400 text-lg">💰</span>
                  </div>
                  <div class="text-2xl font-bold text-amber-400">ETB <span v-text="avgFoodPrice"></span></div>
                  <span class="text-[11px] text-zinc-400 mt-1 block">Average menu cost for food</span>
                </div>
                <div class="bg-[#111814] border border-emerald-950 p-5 rounded-2xl">
                  <div class="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase mb-2">
                    <span>Avg Drink Price</span><span class="text-purple-400 text-lg">🥤</span>
                  </div>
                  <div class="text-2xl font-bold text-purple-400">ETB <span v-text="avgDrinkPrice"></span></div>
                  <span class="text-[11px] text-zinc-400 mt-1 block">Average menu cost for drinks</span>
                </div>
              </div>

              <div class="bg-[#111814] border border-emerald-950 rounded-2xl p-5">
                <h3 class="text-lg font-bold text-white mb-3">Establishment Quick Facts</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div class="p-3 bg-[#0b0f0d] rounded-xl border border-emerald-950">
                    <span class="text-zinc-400 block mb-0.5">Amharic Name:</span>
                    <span class="text-emerald-400 font-bold text-sm" v-text="currentRestaurant?.amharicName"></span>
                  </div>
                  <div class="p-3 bg-[#0b0f0d] rounded-xl border border-emerald-950">
                    <span class="text-zinc-400 block mb-0.5">Primary Location:</span>
                    <span class="text-white font-bold text-sm" v-text="currentRestaurant?.location"></span>
                  </div>
                  <div class="p-3 bg-[#0b0f0d] rounded-xl border border-emerald-950">
                    <span class="text-zinc-400 block mb-0.5">Tagline:</span>
                    <span class="text-zinc-200 font-bold text-sm" v-text="currentRestaurant?.tagline"></span>
                  </div>
                  <div class="p-3 bg-[#0b0f0d] rounded-xl border border-emerald-950">
                    <span class="text-zinc-400 block mb-0.5">Total Menu Items:</span>
                    <span class="text-emerald-400 font-bold text-sm" v-text="currentRestaurant?.menuItems?.length || 0"></span>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- TAB 2: ITEMS -->
          <template v-if="activeMainTab === 'items'">
            <div class="space-y-5">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 class="text-2xl font-bold text-white">Menu Items & Categorization</h2>
                  <p class="text-zinc-400 text-xs">Browse and manage all foods and drinks with backend synchronization.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <button @click="addCategoryModalOpen = true" class="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl border border-emerald-600 transition cursor-pointer">
                    + Add Category
                  </button>
                  <button @click="addItemModalOpen = true" class="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-lg shadow-emerald-950/50">
                    + Add Menu Item
                  </button>
                  <select v-model="itemFilterCategory" class="bg-[#111814] border border-emerald-900 text-xs font-bold text-emerald-400 rounded-xl px-3.5 py-2 focus:outline-none">
                    <option value="all">All Categories</option>
                    <option value="food">Foods Only</option>
                    <option value="drinks">Drinks Only</option>
                  </select>
                  <select v-model="itemFilterSub" class="bg-[#111814] border border-emerald-900 text-xs font-bold text-zinc-300 rounded-xl px-3.5 py-2 focus:outline-none">
                    <option value="all">All Sub-Categories</option>
                    <option v-for="sub in uniqueSubCategories" :key="sub" :value="sub" v-text="sub"></option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div v-for="item in filteredMenuItems" :key="item.id" class="bg-[#111814] border border-emerald-950 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition">
                  <div>
                    <div class="relative h-40 w-full overflow-hidden">
                      <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).src='https://placehold.co/600x400/111814/10b981?text=Food'">
                      <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" :class="item.category === 'food' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-blue-950 text-blue-300 border border-blue-800'" v-text="item.subCategory"></span>
                    </div>
                    <div class="p-4">
                      <div class="flex justify-between items-start mb-1.5">
                        <h3 class="text-base font-bold text-white" v-text="item.name"></h3>
                        <span class="text-emerald-400 font-bold text-sm">ETB <span v-text="item.price"></span></span>
                      </div>
                      <div class="text-emerald-300 text-xs mb-1.5" v-text="item.amharicName"></div>
                      <p class="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed" v-text="item.description"></p>
                    </div>
                  </div>
                  <div class="px-4 py-3 bg-[#0b0f0d] border-t border-emerald-950 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Prep: <strong class="text-white" v-text="item.prepTime"></strong></span>
                    <div class="flex items-center space-x-2">
                      <button @click="deleteFoodItem(item)" class="text-red-400 hover:text-red-300 font-bold text-xs bg-red-950/40 border border-red-800/50 px-2 py-0.5 rounded-md cursor-pointer">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- ADD CATEGORY MODAL -->
          <div v-if="addCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-[#111814] border border-emerald-500/50 w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-white">Add New Category</h3>
                <button @click="addCategoryModalOpen = false" class="text-zinc-400 hover:text-white">✕</button>
              </div>
              <form @submit.prevent="saveCategory" class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Category Name</label>
                  <input v-model="categoryName" placeholder="e.g. Traditional Dishes, Hot Drinks" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-emerald-500" required />
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" @click="addCategoryModalOpen = false" class="px-4 py-2 bg-[#0b0f0d] text-zinc-400 border border-zinc-800 rounded-xl text-xs font-bold">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-emerald-600 text-black font-bold rounded-xl text-xs">Create Category</button>
                </div>
              </form>
            </div>
          </div>

          <!-- ADD ITEM MODAL -->
          <div v-if="addItemModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div class="bg-[#111814] border border-emerald-500/50 w-full max-w-md rounded-2xl p-6 shadow-2xl">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-white">Add New Menu Item</h3>
                <button @click="addItemModalOpen = false" class="text-zinc-400 hover:text-white">✕</button>
              </div>
              <form @submit.prevent="saveFoodItem" class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Item Name</label>
                  <input v-model="foodForm.name" placeholder="Dish or Drink Name" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500" required />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Price (ETB)</label>
                    <input type="number" v-model.number="foodForm.price" placeholder="0" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Category</label>
                    <select v-model="foodForm.categoryId" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none" required>
                      <option v-for="c in categoriesList" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Description</label>
                  <textarea v-model="foodForm.description" rows="2" placeholder="Brief description of the item" class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-xs rounded-xl px-3.5 py-2 focus:outline-none focus:border-emerald-500"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Image URL</label>
                  <input v-model="foodForm.pic" placeholder="https://..." class="w-full bg-[#0b0f0d] border border-emerald-900 text-white text-xs rounded-xl px-3.5 py-2 focus:outline-none" />
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" @click="addItemModalOpen = false" class="px-4 py-2 bg-[#0b0f0d] text-zinc-400 border border-zinc-800 rounded-xl text-xs font-bold">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-emerald-600 text-black font-bold rounded-xl text-xs">Save Item</button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { apiFetch } = useApi()
const { token, user, setAuth, clearAuth } = useAuth()

const isLoggedIn = ref(!!token.value)
const loginEmail = ref('')
const loginPin = ref('')
const currentRestaurantId = ref('girum')
const activeMainTab = ref('dashboard')
const identitySubTab = ref('informations')
const itemFilterCategory = ref('all')
const itemFilterSub = ref('all')
const toasts = ref<any[]>([])

const passForm = ref({ current: '', newPass: '', confirm: '' })
const editForm = ref<any>({})
const addCategoryModalOpen = ref(false)
const addItemModalOpen = ref(false)
const categoryName = ref('')
const categoriesList = ref<any[]>([])
const foodForm = ref({
  name: '',
  price: 0,
  categoryId: '',
  description: '',
  pic: ''
})

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

const foodCount = computed(() => {
  return currentRestaurant.value?.menuItems?.filter((i: any) => i.category === 'food').length || 0
})

const drinkCount = computed(() => {
  return currentRestaurant.value?.menuItems?.filter((i: any) => i.category === 'drinks').length || 0
})

const avgFoodPrice = computed(() => {
  const foods = currentRestaurant.value?.menuItems?.filter((i: any) => i.category === 'food') || []
  if (foods.length === 0) return 0
  const sum = foods.reduce((acc: any, i: any) => acc + i.price, 0)
  return (sum / foods.length).toFixed(0)
})

const avgDrinkPrice = computed(() => {
  const drinks = currentRestaurant.value?.menuItems?.filter((i: any) => i.category === 'drinks') || []
  if (drinks.length === 0) return 0
  const sum = drinks.reduce((acc: any, i: any) => acc + i.price, 0)
  return (sum / drinks.length).toFixed(0)
})

const uniqueSubCategories = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  return [...new Set(items.map((i: any) => i.subCategory))]
})

const filteredMenuItems = computed(() => {
  const items = currentRestaurant.value?.menuItems || []
  return items.filter((item: any) => {
    if (itemFilterCategory.value !== 'all' && item.category !== itemFilterCategory.value) return false
    if (itemFilterSub.value !== 'all' && item.subCategory !== itemFilterSub.value) return false
    return true
  })
})

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
        let cats: any[] = []
        if (detailed.categories) {
          cats = detailed.categories.map((c: any) => ({ id: c.id, name: c.name }))
          for (const cat of detailed.categories) {
            if (cat.foods) {
              for (const f of cat.foods) {
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
    console.warn('API fetch warning:', err)
  }
}

async function saveCategory() {
  if (!categoryName.value.trim()) return
  try {
    const rId = loadedRestaurant.value?.id || 'girum'
    await apiFetch(`/restaurants/${rId}/categories`, {
      method: 'POST',
      body: { name: categoryName.value.trim() }
    })
    addToast('Category created on backend!')
    categoryName.value = ''
    addCategoryModalOpen.value = false
    await fetchBackendData()
  } catch (err: any) {
    console.error('Error creating category:', err)
    addToast(err.data?.error || 'Failed to create category on backend')
  }
}

async function saveFoodItem() {
  if (!foodForm.value.name || !foodForm.value.categoryId) {
    addToast('Please fill in required fields')
    return
  }
  try {
    const rId = loadedRestaurant.value?.id || 'girum'
    const catId = foodForm.value.categoryId
    const payload = {
      name: foodForm.value.name,
      price: Number(foodForm.value.price),
      description: foodForm.value.description,
      pic: foodForm.value.pic || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      prep_time_minutes: 15
    }
    await apiFetch(`/restaurants/${rId}/categories/${catId}/foods`, {
      method: 'POST',
      body: payload
    })
    addToast('Item created on backend!')
    foodForm.value = { name: '', price: 0, categoryId: categoriesList.value[0]?.id || '', description: '', pic: '' }
    addItemModalOpen.value = false
    await fetchBackendData()
  } catch (err: any) {
    console.error('Error creating item:', err)
    addToast(err.data?.error || 'Failed to create item on backend')
  }
}

async function deleteFoodItem(item: any) {
  if (!confirm(`Delete ${item.name}?`)) return
  try {
    const rId = loadedRestaurant.value?.id || 'girum'
    const catId = item.categoryId || categoriesList.value[0]?.id
    await apiFetch(`/restaurants/${rId}/categories/${catId}/foods/${item.id}`, {
      method: 'DELETE'
    })
    addToast('Item deleted on backend!')
    await fetchBackendData()
  } catch (err: any) {
    console.error('Error deleting item:', err)
    addToast(err.data?.error || 'Failed to delete item on backend')
  }
}

function resetEditForm() {
  editForm.value = JSON.parse(JSON.stringify(currentRestaurant.value))
}

async function login() {
  try {
    const res: any = await apiFetch('/auth/login', {
      method: 'POST',
      body: {
        email: loginEmail.value.trim(),
        password: loginPin.value
      }
    })
    
    if (res.token) {
      setAuth(res.token, res.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('awaze_restaurant_session', JSON.stringify({ isLoggedIn: true }))
      }
      isLoggedIn.value = true
      resetEditForm()
      addToast('Logged in successfully!')
      fetchBackendData()
    }
  } catch (error: any) {
    console.error('Login error:', error)
    // Fallback to local session if demo PIN 1234 used
    if (loginPin.value === '1234') {
      setAuth('demo_token', { email: loginEmail.value })
      if (typeof window !== 'undefined') {
        localStorage.setItem('awaze_restaurant_session', JSON.stringify({ isLoggedIn: true }))
      }
      isLoggedIn.value = true
      resetEditForm()
      addToast('Logged in successfully!')
      fetchBackendData()
      return
    }
    addToast(error.data?.error || 'Login failed. Verify credentials.')
  }
}

function logout() {
  clearAuth()
  if (typeof window !== 'undefined') {
    localStorage.removeItem('awaze_restaurant_session')
  }
  isLoggedIn.value = false
  loginEmail.value = ''
  loginPin.value = ''
  addToast('Logged out successfully')
}

function addToast(message: string) {
  const id = Date.now()
  toasts.value.push({ id, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t: any) => t.id !== id)
  }, 3000)
}

function removeToast(id: number) {
  toasts.value = toasts.value.filter((t: any) => t.id !== id)
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
/* Scoped overrides to protect Nuxt */
input, textarea, select {
  font-family: inherit;
}
</style>

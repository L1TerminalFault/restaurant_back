<template>
  <div :class="{ 'light-theme': !isDark }" class="flex flex-col min-h-screen transition-colors duration-300 bg-[#050806] text-white font-sans antialiased selection:bg-emerald-500 selection:text-black">
    
    <!-- Login Screen -->
    <template v-if="!isLoggedIn">
      <div class="min-h-[80vh] flex items-center justify-center p-4">
        <div class="bg-[#0c1611] border border-emerald-900/60 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-center">
          <div class="h-16 w-16 rounded-full bg-emerald-600/20 border border-emerald-500 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">👨‍🍳</span>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">KITCHEN TERMINAL LOGIN</h2>
          <p class="text-xs text-emerald-400 mt-1 mb-6">Sign in with the restaurant owner email and password</p>
          
          <form @submit.prevent="login" class="space-y-4 text-left">
            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Owner Email</label>
              <input type="email" v-model="loginEmail" placeholder="owner@example.com" required class="w-full bg-[#050806] border border-emerald-900 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Password</label>
              <input type="password" v-model="loginPin" placeholder="Owner password" class="w-full bg-[#050806] border border-emerald-900 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500" required />
            </div>
            <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-sm py-3 rounded-xl transition shadow-lg cursor-pointer">
              Enter Kitchen Terminal
            </button>
          </form>
          <div class="mt-4 text-xs text-zinc-500">Use the owner email/password set when the restaurant was created in the admin dashboard.</div>
        </div>
      </div>
    </template>

    <template v-else>
    <!-- Header Section -->
    <header class="sticky top-0 z-40 bg-[#050806]/95 backdrop-blur-md border-b border-emerald-950/40 px-4 py-3.5 md:px-8">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div class="flex items-center space-x-3 self-start sm:self-center min-w-[150px]">
          <div class="h-10 w-10 md:h-12 md:w-12 p-[3px] shadow-lg shadow-emerald-950/50">
            <div class="w-full h-full flex items-center justify-center">
              <img 
                src="/assets/images/awaze_logo.png" 
                alt="Logo" 
                @error="onImgError($event, 'https://placehold.co/100x100/0d1410/10b981?text=AWAZE')"
                class="object-contain"
              />
            </div>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-lg md:text-xl font-bold tracking-tight text-white">{{ restaurantName }}</h1>
            </div>
            <p class="text-xs text-zinc-400">{{ restaurantName }} Kitchen</p>
          </div>
        </div>

        <!-- Metrics Overview Counters -->
        <div class="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <div class="flex items-center space-x-2 bg-[#0c1611] border border-emerald-950/60 px-3 py-1.5 rounded-xl">
            <div class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span class="text-xs text-zinc-300">Pending:</span>
            <span class="text-xs font-bold text-amber-400">{{ pendingCount }}</span>
          </div>
          <div class="flex items-center space-x-2 bg-[#0c1611] border border-emerald-950/60 px-3 py-1.5 rounded-xl">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span class="text-xs text-zinc-300">Delivered:</span>
            <span class="text-xs font-bold text-emerald-400">{{ deliveredCount }}</span>
          </div>
          
          <!-- Theme Toggle -->
          <button 
            @click="isDark = !isDark" 
            class="p-2 rounded-xl bg-[#0c1611] border border-emerald-950/60 text-zinc-400 hover:text-emerald-400 transition-colors"
            title="Toggle Theme"
          >
            <span v-if="isDark">☀️</span>
            <span v-else>🌙</span>
          </button>

          <!-- Logout Button -->
          <button 
            @click="logout" 
            class="px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-800 text-xs font-bold text-red-300 hover:bg-red-900 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
      
      <!-- Category Filter Bar -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-emerald-950/30">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="selectedCategory = cat.id"
          :class="[
            'px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2',
            selectedCategory === cat.id 
              ? 'bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20' 
              : 'bg-[#0c1611] text-zinc-400 border border-emerald-950/60 hover:text-white hover:border-emerald-800/60'
          ]"
        >
          <span>{{ cat.label }}</span>
          <span v-if="cat.count > 0" class="px-1.5 py-0.2 rounded-full text-[10px]" :class="selectedCategory === cat.id ? 'bg-black/20 text-black' : 'bg-emerald-950 text-emerald-400'">
            {{ cat.count }}
          </span>
        </button>
      </div>
    
      <!-- Orders Grid -->
      <div v-if="filteredOrders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-[#0d1410] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl"
          :class="[
            order.isDelayed ? 'shadow-none' : 'border-emerald-950/60 hover:border-emerald-800/80',
            order.status === 'New' ? 'ring-1 ring-emerald-500/30' : ''
          ]"
        >
          <!-- Card Header: Table & Timer -->
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-emerald-950/50 mb-4">
              <div class="flex items-center space-x-2">
                <span class="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-lg text-sm">
                  Table #{{ order.tableNumber }}
                </span>
                <span v-if="order.status === 'New'" class="flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <!-- Timer Display with dynamic color coding -->
              <div 
                class="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold border"
                :class="getTimerClass(order)"
              >
                <span>⏱️</span>
                <span>{{ order.timeLeftMins }} mins left</span>
              </div>
            </div>

            <!-- Foods List Container -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between mb-2">
                <div class="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Ordered Items:</div>
              </div>
              <div 
                v-for="(item, idx) in order.items" 
                :key="idx"
                class="flex items-center justify-between bg-[#050806]/60 border border-emerald-950/40 p-2.5 rounded-xl gap-2"
              >
                <div class="flex items-center space-x-3 overflow-hidden">
                  <span class="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-400 font-bold rounded-md text-xs border border-emerald-500/20">
                    {{ item.quantity }}x
                  </span>
                  <div class="truncate">
                    <h4 class="text-sm font-medium text-white truncate" :class="{ 'line-through text-zinc-500': item.isUnavailable }">{{ item.name }}</h4>
                    <p v-if="item.notes" class="text-xs text-amber-400/90 italic truncate">Note: {{ item.notes }}</p>
                  </div>
                </div>

                <!-- Unavailable Button per item -->
                <button 
                  @click="toggleItemUnavailable(item)"
                  class="px-2 py-1 rounded-lg text-[10px] font-semibold transition-all border whitespace-nowrap flex-shrink-0"
                  :class="item.isUnavailable ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:text-zinc-200'"
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>

          <!-- Card Footer: Action Button & Status Badge -->
          <div class="pt-3 border-t border-emerald-950/40 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium px-2.5 py-1 rounded-lg border" :class="getStatusBadgeClass(order.status)">
                {{ order.status }}
              </span>
              <!-- "Not delivered" button style for Ready or Delivered states -->
              <button 
                v-if="order.status === 'Ready' || order.status === 'Delivered'"
                @click="markNotDelivered(order)"
                class="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-[10px] font-semibold transition-all"
                title="Revert delivery status"
              >
                Not Delivered
              </button>
            </div>

            <button 
              @click="handleActionClick(order)"
              class="flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5"
              :class="getActionButtonClass(order.status)"
            >
              <span>{{ getActionButtonText(order.status) }}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 bg-[#0c1611]/50 border border-emerald-950/40 rounded-3xl text-center px-4">
        <div class="text-4xl mb-3">📋</div>
        <h3 class="text-lg font-bold text-white mb-1">{{ activeRestaurantId ? 'No orders found' : 'No restaurant linked' }}</h3>
        <p class="text-xs text-zinc-400 max-w-sm">
          {{ activeRestaurantId
            ? 'There are no orders matching this filter criterion right now.'
            : 'This account has no restaurant. As super admin, create a restaurant with this owner email and password.' }}
        </p>
      </div>

    </main>

  </template>
  </div>
</template>

<script>
export default {
  name: 'KitchenTerminal',
  setup() {
    const { apiFetch } = useApi()
    const { setAuth, clearAuth, user } = useAuth()
    return { apiFetch, setAuth, clearAuth, user }
  },
  data() {
    return {
      isDark: true,
      restaurantName: 'AWAZE Kitchen',
      selectedCategory: 'all',
      orders: [],
      isLoggedIn: false,
      loginEmail: '',
      loginPin: ''
    }
  },
  mounted() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const autoLogin = urlParams.get('autoLogin') === 'true'
      const hasToken = !!localStorage.getItem('auth_token')
      const savedAuth = localStorage.getItem('awaze_kitchen_auth') === 'true'
      if ((autoLogin || savedAuth) && hasToken && this.user) {
        this.isLoggedIn = true
        this.refreshSession()
      } else if (savedAuth && !hasToken) {
        localStorage.removeItem('awaze_kitchen_auth')
      }
    }
    this.pollInterval = setInterval(() => {
      if (this.isLoggedIn) this.loadSavedOrders()
    }, 3000)
  },
  beforeUnmount() {
    if (this.pollInterval) clearInterval(this.pollInterval)
  },
  computed: {
    ownedRestaurants() {
      const list = this.user?.restaurants || this.user?.Restaurants || []
      return Array.isArray(list) ? list : []
    },
    activeRestaurantId() {
      const r = this.ownedRestaurants[0]
      return r ? (r.id || r.ID || r.custom_sub_link) : null
    },
    pendingCount() {
      return this.orders.filter(o => o.status !== 'Delivered').length;
    },
    deliveredCount() {
      return this.orders.filter(o => o.status === 'Delivered').length;
    },
    categories() {
      return [
        { id: 'all', label: 'All', count: this.orders.length },
        { id: 'undelivered', label: 'Undelivered', count: this.orders.filter(o => o.status !== 'Delivered').length },
        { id: 'New', label: 'New', count: this.orders.filter(o => o.status === 'New').length },
        { id: 'Preparing', label: 'Preparing', count: this.orders.filter(o => o.status === 'Preparing').length },
        { id: 'Ready', label: 'Ready', count: this.orders.filter(o => o.status === 'Ready').length },
        { id: 'Delivered', label: 'Delivered', count: this.orders.filter(o => o.status === 'Delivered').length },
        { id: 'Delayed', label: 'Delayed', count: this.orders.filter(o => o.isDelayed).length }
      ];
    },
    filteredOrders() {
      if (this.selectedCategory === 'all') return this.orders;
      if (this.selectedCategory === 'undelivered') return this.orders.filter(o => o.status !== 'Delivered');
      if (this.selectedCategory === 'Delayed') return this.orders.filter(o => o.isDelayed);
      return this.orders.filter(o => o.status === this.selectedCategory);
    }
  },
  methods: {
    async refreshSession() {
      try {
        const profile = await this.apiFetch('/user/profile')
        if (profile) {
          const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
          this.setAuth(token || '', profile)
          const r = (profile.restaurants || profile.Restaurants || [])[0]
          if (r) {
            this.restaurantName = r.name_en || r.NameEn || r.name || 'Kitchen'
          }
        }
      } catch (e) {
        console.warn('Failed to refresh kitchen session:', e)
      }
      await this.loadSavedOrders()
    },
    async loadSavedOrders() {
      if (!this.isLoggedIn) return;
      const rId = this.activeRestaurantId;
      if (!rId) {
        this.orders = [];
        return;
      }
      try {
        const list = await this.apiFetch(`/restaurants/${rId}/orders`);
        if (list && Array.isArray(list)) {
          this.orders = list.map(o => ({
            ...o,
            id: o.id || o.ID,
            tableNumber: o.table_number ?? o.TableNumber ?? o.tableNumber ?? 0,
            timeLeftMins: o.time_left_mins ?? o.TimeLeftMins ?? o.timeLeftMins ?? 15,
            isDelayed: o.is_delayed ?? o.IsDelayed ?? o.isDelayed ?? false,
            status: o.status || o.Status || 'New',
            items: (o.items || o.Items || []).map(i => ({
              ...i,
              name: i.name || i.Name || 'Item',
              quantity: i.quantity ?? i.Quantity ?? 1,
              notes: i.notes || i.Notes || '',
              isUnavailable: i.is_unavailable ?? i.IsUnavailable ?? i.isUnavailable ?? false
            }))
          }));
        }
      } catch (e) {
        console.warn('Failed to load kitchen orders from API:', e);
      }
    },
    onImgError(event, fallbackUrl) {
      event.target.src = fallbackUrl;
    },
    getTimerClass(order) {
      if (order.timeLeftMins <= 3 || order.isDelayed) {
        return 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse';
      } else if (order.timeLeftMins <= 8) {
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      } else {
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      }
    },
    getStatusBadgeClass(status) {
      switch(status) {
        case 'New': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case 'Preparing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        case 'Ready': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'Delivered': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      }
    },
    getActionButtonText(status) {
      switch(status) {
        case 'New': return 'Start Order';
        case 'Preparing': return 'Mark Ready';
        case 'Ready': return 'Mark Delivered';
        case 'Delivered': return 'Completed';
        default: return 'Process';
      }
    },
    getActionButtonClass(status) {
      switch(status) {
        case 'New': 
          return 'bg-emerald-500 text-black hover:bg-emerald-400 font-bold';
        case 'Preparing': 
          return 'bg-amber-400 text-black hover:bg-amber-300 font-bold';
        case 'Ready': 
          return 'bg-blue-600 text-white hover:bg-blue-500 font-bold';
        case 'Delivered': 
          return 'bg-zinc-800 text-zinc-500 cursor-not-allowed';
        default: 
          return 'bg-emerald-500 text-black font-bold';
      }
    },
    async setOrderStatus(order, nextStatus) {
      const rId = this.activeRestaurantId;
      if (!rId) return;
      try {
        await this.apiFetch(`/restaurants/${rId}/orders/${order.id || order.ID}/status`, {
          method: 'PUT',
          body: { status: nextStatus }
        });
        order.status = nextStatus;
      } catch(e) {
        console.error('Failed to update status', e);
      }
    },
    handleActionClick(order) {
      if (order.status === 'New') {
        this.setOrderStatus(order, 'Preparing');
      } else if (order.status === 'Preparing') {
        this.setOrderStatus(order, 'Ready');
      } else if (order.status === 'Ready') {
        this.setOrderStatus(order, 'Delivered');
      }
    },
    markNotDelivered(order) {
      if (order.status === 'Delivered') {
        this.setOrderStatus(order, 'Ready');
      } else if (order.status === 'Ready') {
        this.setOrderStatus(order, 'Preparing');
      }
    },
    toggleItemUnavailable(item) {
      item.isUnavailable = !item.isUnavailable;
    },
    async login() {
      if (!this.loginEmail.trim() || !this.loginPin.trim()) {
        alert("Please enter both email and password.");
        return;
      }
      try {
        const res = await this.apiFetch("/auth/login", {
          method: "POST",
          body: {
            email: this.loginEmail.trim(),
            password: this.loginPin.trim()
          }
        });
        if (res && res.token) {
          this.setAuth(res.token, res.user);
          this.isLoggedIn = true;
          if (typeof window !== 'undefined') {
            localStorage.setItem('awaze_kitchen_auth', 'true');
          }
          await this.refreshSession();
          if (!this.activeRestaurantId) {
            alert("Logged in, but this account has no restaurant. Ask a super admin to create one with your owner email.");
          }
        } else {
          alert("Login failed: missing token");
        }
      } catch (err) {
        console.error("Kitchen login failed:", err);
        alert(err.data?.error || "Login failed");
      }
    },
    logout() {
      this.clearAuth();
      this.isLoggedIn = false;
      this.orders = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('awaze_kitchen_auth');
      }
      this.loginPin = '';
      this.loginEmail = '';
    }
  }
}
</script>

<style scoped>
.light-theme {
  background-color: #ffffff !important;
  color: #0f172a !important;
}

.light-theme header {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: #e2e8f0 !important;
}

.light-theme .bg-\[\#0c1611\] {
  background-color: #f8fafc !important;
  border-color: #e2e8f0 !important;
}

.light-theme .bg-\[\#050806\]\/60 {
  background-color: #f1f5f9 !important;
  border-color: #cbd5e1 !important;
}

.light-theme .text-white {
  color: #0f172a !important;
}

.light-theme .text-zinc-300,
.light-theme .text-zinc-400,
.light-theme .text-zinc-500 {
  color: #475569 !important;
}
</style>

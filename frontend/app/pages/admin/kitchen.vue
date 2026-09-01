<template>
  <div :class="{ 'light-theme': !isDark }" class="flex flex-col min-h-screen transition-colors duration-300 bg-[#050806] text-white font-sans antialiased selection:bg-emerald-500 selection:text-black">
    
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
        <h3 class="text-lg font-bold text-white mb-1">No orders found</h3>
        <p class="text-xs text-zinc-400 max-w-sm">There are no orders matching this filter criterion right now.</p>
      </div>

    </main>

  </div>
</template>

<script>
export default {
  name: 'KitchenTerminal',
  data() {
    return {
      isDark: true,
      restaurantName: 'AWAZE Kitchen',
      selectedCategory: 'all',
      orders: [
        {
          id: 101,
          tableNumber: 4,
          timeLeftMins: 2,
          isDelayed: true,
          status: 'New',
          items: [
            { name: 'Traditional Doro Wat', quantity: 2, notes: 'Extra spicy', isUnavailable: false },
            { name: 'Injera Platter', quantity: 1, notes: '', isUnavailable: false }
          ]
        },
        {
          id: 102,
          tableNumber: 7,
          timeLeftMins: 12,
          isDelayed: false,
          status: 'Preparing',
          items: [
            { name: 'Kitfo Special', quantity: 1, notes: 'Lebleb (medium rare)', isUnavailable: false },
            { name: 'Ayibe with Gomen', quantity: 1, notes: '', isUnavailable: false }
          ]
        },
        {
          id: 103,
          tableNumber: 2,
          timeLeftMins: 5,
          isDelayed: false,
          status: 'New',
          items: [
            { name: 'Tibs Firfir', quantity: 3, notes: '', isUnavailable: false }
          ]
        },
        {
          id: 104,
          tableNumber: 12,
          timeLeftMins: 0,
          isDelayed: true,
          status: 'Ready',
          items: [
            { name: 'Shiro Special', quantity: 2, notes: 'No butter (Vegan)', isUnavailable: false }
          ]
        },
        {
          id: 105,
          tableNumber: 9,
          timeLeftMins: 18,
          isDelayed: false,
          status: 'Preparing',
          items: [
            { name: 'Bozena Shiro', quantity: 1, notes: '', isUnavailable: false },
            { name: 'Spiced Honey Wine (Tej)', quantity: 2, notes: '', isUnavailable: false }
          ]
        }
      ]
    }
  },
  computed: {
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
    handleActionClick(order) {
      if (order.status === 'New') {
        order.status = 'Preparing';
      } else if (order.status === 'Preparing') {
        order.status = 'Ready';
      } else if (order.status === 'Ready') {
        order.status = 'Delivered';
      }
    },
    markNotDelivered(order) {
      if (order.status === 'Delivered') {
        order.status = 'Ready';
      } else if (order.status === 'Ready') {
        order.status = 'Preparing';
      }
    },
    toggleItemUnavailable(item) {
      item.isUnavailable = !item.isUnavailable;
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
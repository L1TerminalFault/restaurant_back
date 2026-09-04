<template>
  <div :class="{ 'light-theme': !isDark }" class="flex flex-col min-h-screen transition-colors duration-300 bg-[#050806] text-white font-sans antialiased selection:bg-emerald-500 selection:text-black">
    
    <header class="sticky top-0 z-40 bg-[#050806]/95 backdrop-blur-md border-b border-emerald-950/40 px-4 py-3.5 md:px-8">
      <div class="max-w-7xl mx-auto flex sm:flex-row items-center justify-between gap-4">
        
        <NuxtLink to="/">
          <div class="flex items-center space-x-3 self-start sm:self-center min-w-[150px]">
            <div class="h-10 w-10 md:h-12 md:w-12 p-[3px] shadow-lg shadow-emerald-950/50">
              <div class="w-full h-full flex items-center justify-center">
                <img 
                  src="/assets/images/awaze_logo.png" 
                  alt="Logo" 
                  @error="onImgError($event, 'https://placehold.co/100x100/0d1410/10b981?text=AWAZE')"
                />
              </div>
            </div>
            <div>
              <div class="flex flex-col">
                <div class="flex items-baseline gap-1.5">
                  <h1 class="font-black text-lg md:text-2xl tracking-tight text-white uppercase leading-none">AWAZE</h1>
                  <span class="text-zinc-400 font-bold text-xs md:text-sm">/ አዋዜ</span>
                </div>
                <span class="text-emerald-400 text-[10px] uppercase font-semibold tracking-widest mt-1">Digital Menu</span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-2.5 w-full sm:w-auto sm:max-w-md">
          <div class="relative w-full">
            <svg class="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              :placeholder="showingDirectory ? (lang === 'am' ? 'ምግብ ቤት ፈልግ...' : 'Search restaurants...') : t('searchPlaceholder')" 
              v-model="searchQuery"
              @input="showingDirectory ? undefined : scrollToMenu()"
              @focus="showingDirectory ? undefined : scrollToMenu()"
              class="w-full bg-[#0d1410] border border-emerald-950/80 text-white placeholder-zinc-500 rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''"
              class="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <button 
            @click="toggleLang" 
            type="button"
            class="px-3 py-2.5 rounded-lg border border-emerald-950/80 bg-[#0d1410] hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-all flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Toggle Language"
            :title="lang === 'en' ? 'Switch to Amharic' : 'Switch to English'"
          >
            <span class="flex items-center gap-1.5">
              <span class="font-extrabold tracking-wide">{{ lang === 'en' ? 'አማ' : 'EN' }}</span>
            </span>
          </button>

          <button 
            @click="toggleTheme" 
            type="button"
            class="p-2.5 rounded-lg border border-emerald-950/80 bg-[#0d1410] hover:border-emerald-500 text-emerald-400 hover:text-emerald-300 transition-all flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Toggle Theme"
          >
            <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>

      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-6 md:py-8 md:px-8 flex-grow w-full">

      <!-- Restaurant directory (no restaurant selected) -->
      <div v-if="showingDirectory" class="w-full">
        <div class="mb-8">
          <p class="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Browse</p>
          <h2 class="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-tight">Restaurants</h2>
          <p class="text-zinc-400 text-sm mt-2 max-w-xl">Choose a restaurant to open its digital menu and place an order.</p>
        </div>

        <div v-if="directoryLoading" class="py-20 text-center text-zinc-400 text-sm">
          Loading restaurants…
        </div>

        <div v-else-if="directoryError" class="py-16 text-center bg-[#0d1410] border border-red-900/40 rounded-2xl px-4">
          <p class="text-red-400 text-sm mb-4">{{ directoryError }}</p>
          <button
            type="button"
            @click="loadRestaurantDirectory"
            class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl cursor-pointer"
          >Retry</button>
        </div>

        <div v-else-if="filteredDirectory.length === 0" class="py-16 text-center bg-[#0d1410] border border-emerald-950/60 rounded-2xl px-4">
          <p class="text-zinc-300 text-sm font-semibold">{{ restaurantDirectory.length === 0 ? 'No restaurants available yet.' : 'No restaurants match your search.' }}</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="r in filteredDirectory"
            :key="restaurantRouteId(r)"
            :to="`/menu/${restaurantRouteId(r)}`"
            class="group block bg-[#0d1410] border border-emerald-950/60 hover:border-emerald-600/70 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-emerald-950/20"
          >
            <div class="h-36 bg-[#080f0c] overflow-hidden relative">
              <img
                :src="(r.images && r.images[0]) || r.banner || r.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'"
                :alt="restaurantDisplayName(r)"
                class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-300"
                @error="onImgError($event, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800')"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0d1410] via-transparent to-transparent"></div>
            </div>
            <div class="p-4 flex items-start gap-3">
              <img
                :src="r.logo || '/assets/images/awaze_logo.png'"
                :alt="restaurantDisplayName(r) + ' logo'"
                class="h-11 w-11 object-cover rounded-lg bg-[#050806] border border-emerald-950 shrink-0"
                @error="onImgError($event, 'https://placehold.co/100x100/0d1410/10b981?text=LOGO')"
              />
              <div class="min-w-0 flex-1">
                <h3 class="text-white font-bold text-base truncate group-hover:text-emerald-300 transition-colors">{{ restaurantDisplayName(r) }}</h3>
                <p v-if="restaurantDisplayNameAm(r)" class="text-emerald-400/80 text-sm truncate">{{ restaurantDisplayNameAm(r) }}</p>
                <p v-if="r.location" class="text-zinc-500 text-xs mt-1 truncate">{{ r.location }}</p>
                <p v-else-if="r.slogan" class="text-zinc-500 text-xs mt-1 truncate">{{ r.slogan }}</p>
              </div>
              <span class="text-emerald-500 text-xs font-bold self-center shrink-0 group-hover:translate-x-0.5 transition-transform">Open →</span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Loading / not found for a specific restaurant -->
      <div v-else-if="menuLoading" class="py-20 text-center text-zinc-400 text-sm">
        Loading menu…
      </div>

      <div v-else-if="menuLoadError" class="py-16 text-center bg-[#0d1410] border border-emerald-950/60 rounded-2xl px-4 max-w-lg mx-auto">
        <p class="text-zinc-200 font-semibold mb-2">{{ menuLoadError }}</p>
        <p class="text-zinc-500 text-xs mb-5">Pick a restaurant from the list to continue.</p>
        <NuxtLink
          to="/menu"
          class="inline-block px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl"
        >View all restaurants</NuxtLink>
      </div>

      <template v-else>
      
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a140f] to-[#030604] border border-emerald-950/60 p-4 md:p-8 mb-4">
        <div class="absolute right-0 top-0 h-full w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
        <div class="relative z-10 max-w-2xl">
          <div class="flex items-center gap-4">
            <NuxtLink to="/menu" class="text-zinc-500 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider shrink-0 self-start mt-1">← All</NuxtLink>
            <img 
              :src="currentRestaurant.logo" 
              :alt="currentRestaurant.name + ' logo'"
              class="h-12 w-12 md:h-14 md:w-14 object-cover shadow-md shrink-0 bg-[#050806]"
              @error="onImgError($event, 'https://placehold.co/100x100/0d1410/10b981?text=LOGO')"
            />
            <div class="flex flex-col">
              <h2 class="text-emerald-400 text-2xl md:text-3xl uppercase tracking-wide font-extrabold leading-tight">{{ currentRestaurant.name }}</h2>
              <span v-if="currentRestaurant.amharicName" class="text-emerald-300 text-lg md:text-xl font-bold mt-1">{{ currentRestaurant.amharicName }}</span>
            </div>
          </div>
        </div>
      </div>

      <div id="menu-list-section" ref="menuListSection" class="scroll-mt-20 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-emerald-950/40">
        <div class="flex bg-[#0d1410] p-1 rounded-lg border border-emerald-950 max-w-max">
          <button 
            @click="setMenuType('all')"
            :class="activeType === 'all' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'"
            class="px-5 py-2 rounded-md text-xs font-bold transition-all"
          >
            {{ t('fullMenu') }}
          </button>
          <button 
            @click="setMenuType('food')"
            :class="activeType === 'food' ? 'bg-emerald-600 text-black shadow-lg' : 'text-zinc-400 hover:text-white'"
            class="px-5 py-2 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>{{ t('foodPlates') }}</span>
          </button>
          <button 
            @click="setMenuType('drinks')"
            :class="activeType === 'drinks' ? 'bg-emerald-600 text-black shadow-lg' : 'text-zinc-400 hover:text-white'"
            class="px-5 py-2 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ t('beverages') }}</span>
          </button>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex space-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-emerald-950 scrollbar-track-transparent">
          <button
            v-for="cat in visibleCategories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="activeCategory === cat.id ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md' : 'bg-[#0d1410] border-emerald-950/60 hover:border-emerald-800 text-zinc-300'"
            class="flex items-center space-x-2 px-5 py-3 rounded-lg border whitespace-nowrap transition-all duration-200"
          >
            <span v-html="getCategoryIcon(cat.iconName)" :class="activeCategory === cat.id ? 'text-emerald-400' : 'text-zinc-400'" class="h-4 w-4"></span>
            <span class="text-xs font-semibold tracking-wide">{{ getCatName(cat) }}</span>
          </button>
        </div>
      </div>

      <div v-if="filteredItems.length === 0" class="text-center py-16 bg-[#0d1410] rounded-2xl border border-emerald-950/60 max-w-lg mx-auto px-4">
        <div class="bg-[#101b15] p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-emerald-900/40">
          <svg class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">{{ t('noResultsTitle') }}</h3>
        <p class="text-zinc-400 text-xs max-w-sm mx-auto mb-6">{{ t('noResultsDesc') }}</p>
        <button 
          @click="resetFilters"
          class="bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold px-6 py-2.5 rounded-lg transition"
        >
          {{ t('resetFilters') }}
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="item in filteredItems" 
          :key="item.id"
          @click.stop="selectItem(item)"
          class="group bg-[#0d1410] border border-emerald-950/60 hover:border-emerald-700/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/10 cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98] select-none"
          role="button"
          tabindex="0"
          @keydown.enter.prevent="selectItem(item)"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-zinc-900">
            <img 
              :src="item.image" 
              :alt="getItemMainTitle(item)"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              @error="onImgError($event, 'https://placehold.co/600x450/0d1410/10b981?text=' + encodeURIComponent(getItemMainTitle(item)))"
            />
            
            <span class="absolute top-3 left-3 bg-[#050806]/90 text-white border border-emerald-950 text-[10px] font-extrabold px-2.5 py-1 rounded-md backdrop-blur-md">
              {{ getItemTag(item) }}
            </span>
            
            <span v-if="item.spicy" class="absolute top-3 right-3 bg-red-950/90 text-red-400 border border-red-900/40 text-[10px] font-extrabold px-2 py-1 rounded-md backdrop-blur-md flex items-center">
              <svg class="h-3 w-3 mr-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.486 2.58c-.027.205-.052.411-.073.614C7.03 9.242 6.5 8.12 6.5 7A1 1 0 005 6.2a8.035 8.035 0 00-1.785 2.33C2.409 10.03 2 11.47 2 13a7 7 0 1014 0c0-1.502-.409-2.943-1.215-4.47a8.035 8.035 0 00-1.785-2.33s-.336.575-.61 1.258c-.287.712-.52 1.543-.655 2.378-.016.096-.03.19-.041.285a4.774 4.774 0 01-.01.077c-.1.353-.306.66-.583.874a1.004 1.004 0 01-1.218-.12 3.77 3.77 0 01-.937-2.652c.033-.902.164-1.921.393-2.966.223-1.012.545-2.029.932-2.946a9.585 9.585 0 01.91-1.636z" clip-rule="evenodd" />
              </svg>
              <span>{{ t('spicy') }}</span>
            </span>
          </div>

          <div class="p-4 flex-grow flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                <span class="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">{{ getItemSubCategory(item) }}</span>
                <div class="flex items-center space-x-1 text-amber-400">
                  <svg class="h-3.5 w-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="font-bold text-white text-[11px]">{{ item.rating }}</span>
                  <span class="text-zinc-500 text-[10px]">({{ item.reviews }})</span>
                </div>
              </div>

              <h3 class="font-bold text-base md:text-base text-white tracking-tight leading-snug group-hover:text-emerald-400 transition-colors">{{ getItemMainTitle(item) }}</h3>
              <span class="block text-xs font-semibold text-emerald-400/90 mt-0.5 tracking-wide">{{ getItemSubTitle(item) }}</span>
            </div>

            <div class="flex items-center justify-between pt-3 mt-3 border-t border-emerald-950/40">
              <div>
                <span class="text-[10px] text-zinc-500 block uppercase font-semibold">{{ t('price') }}</span>
                <span class="font-black text-emerald-400 text-base md:text-lg">{{ (Number(item.price) || 0).toLocaleString() }} Birr</span>
              </div>

              <div class="flex items-center gap-1.5">
                <button 
                  type="button" 
                  @click.stop="triggerOrder(item)"
                  class="bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors shadow-md cursor-pointer"
                >
                  <span>🛒 Order</span>
                </button>
                <button 
                  type="button" 
                  @click.stop="selectItem(item)"
                  class="bg-emerald-950/60 hover:bg-emerald-800/80 text-emerald-400 hover:text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-900/60 flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>{{ t('details') }}</span>
                  <svg class="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      </template>

    </main>

    <div 
      v-if="selectedItem"
      @click.self="closeModal"
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
    >
      <div 
        @click.stop
        class="bg-[#0d1410] border border-emerald-800/50 w-full max-w-5xl h-[92vh] max-h-[850px] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col lg:flex-row my-auto"
      >
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 z-20 bg-black/75 hover:bg-black p-2.5 rounded-full text-white border border-emerald-900/60 shadow-lg transition-transform hover:scale-105"
          aria-label="Close detail view"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="relative w-full lg:w-1/2 h-64 lg:h-full bg-zinc-900 shrink-0 overflow-hidden">
          <img 
            :src="selectedItem.image" 
            :alt="getItemMainTitle(selectedItem)" 
            class="w-full h-full object-cover"
            @error="onImgError($event, 'https://placehold.co/800x800/0d1410/10b981?text=' + encodeURIComponent(getItemMainTitle(selectedItem)))"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0d1410] via-transparent to-black/40 lg:bg-gradient-to-r lg:from-transparent lg:to-[#0d1410]"></div>
          
          <div class="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span class="bg-emerald-600/90 text-black font-black text-xs uppercase px-3 py-1 rounded-md backdrop-blur-md shadow-md">{{ getItemTag(selectedItem) }}</span>
            <span v-if="selectedItem.spicy" class="bg-red-950/90 text-red-400 border border-red-800/60 font-bold text-xs px-2.5 py-1 rounded-md backdrop-blur-md flex items-center gap-1">
              <svg class="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.486 2.58c-.027.205-.052.411-.073.614C7.03 9.242 6.5 8.12 6.5 7A1 1 0 005 6.2a8.035 8.035 0 00-1.785 2.33C2.409 10.03 2 11.47 2 13a7 7 0 1014 0c0-1.502-.409-2.943-1.215-4.47a8.035 8.035 0 00-1.785-2.33s-.336.575-.61 1.258c-.287.712-.52 1.543-.655 2.378-.016.096-.03.19-.041.285a4.774 4.774 0 01-.01.077c-.1.353-.306.66-.583.874a1.004 1.004 0 01-1.218-.12 3.77 3.77 0 01-.937-2.652c.033-.902.164-1.921.393-2.966.223-1.012.545-2.029.932-2.946a9.585 9.585 0 01.91-1.636z" clip-rule="evenodd" />
              </svg>
              <span>{{ t('spicy') }}</span>
            </span>
          </div>

          <div class="absolute bottom-4 left-4 right-4 hidden lg:flex items-center justify-between text-xs text-zinc-300 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div class="flex items-center space-x-1.5 text-amber-400">
              <svg class="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-bold text-white">{{ selectedItem.rating }}</span>
              <span class="text-zinc-400">({{ selectedItem.reviews }} {{ t('reviews') }})</span>
            </div>
            <div class="flex items-center space-x-3 text-zinc-300 font-medium">
              <span>⏱️ {{ selectedItem.prepTime }}</span>
              <span>•</span>
              <span>🔥 {{ selectedItem.calories }}</span>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto p-5 sm:p-6 md:p-8 scrollbar-thin">
          <div class="mb-4">
            <span class="text-emerald-400 text-xs font-black uppercase tracking-widest">{{ getItemSubCategory(selectedItem) }}</span>
            <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight mt-1 leading-tight">{{ getItemMainTitle(selectedItem) }}</h2>
            <p class="text-emerald-400 text-sm md:text-base font-semibold mt-0.5">{{ getItemSubTitle(selectedItem) }}</p>
            
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-xs text-zinc-400 uppercase font-semibold">{{ t('price') }}:</span>
              <span class="text-2xl md:text-3xl font-black text-emerald-400">{{ (Number(selectedItem.price) || 0).toLocaleString() }} Birr</span>
            </div>
          </div>

          <div class="lg:hidden flex items-center justify-between text-xs text-zinc-300 bg-[#101b15] p-3 rounded-lg border border-emerald-950 mb-5">
            <div class="flex items-center space-x-1 text-amber-400">
              <svg class="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-bold text-white">{{ selectedItem.rating }}</span>
            </div>
            <span>{{ t('prep') }} {{ selectedItem.prepTime }}</span>
            <span>{{ selectedItem.calories }}</span>
          </div>

          <div class="mb-6">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">{{ t('storyHeader') }}</h3>
            <p class="text-zinc-300 text-sm leading-relaxed">{{ getItemDescription(selectedItem) }}</p>
          </div>

          <div class="mb-6" v-if="getItemIngredients(selectedItem) && getItemIngredients(selectedItem).length > 0">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2.5">{{ t('ingredientsHeader') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(ing, idx) in getItemIngredients(selectedItem)" 
                :key="idx"
                class="bg-[#101b15] text-zinc-300 border border-emerald-950 px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{{ ing }}</span>
              </span>
            </div>
          </div>

          <div class="mb-6 bg-[#101b15] p-4 rounded-xl border border-emerald-950" v-if="getItemPairing(selectedItem)">
            <div class="flex items-center gap-2 mb-1">
              <svg class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h4 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400">{{ t('pairingHeader') }}</h4>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ getItemPairing(selectedItem) }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">{{ t('qualityHeader') }}</h3>
            <div class="grid grid-cols-2 gap-2 text-xs text-zinc-300">
              <div class="flex items-center space-x-2 bg-[#050806] p-2.5 rounded-lg border border-emerald-950">
                <span class="text-emerald-400">🌿</span>
                <span>{{ t('q1') }}</span>
              </div>
              <div class="flex items-center space-x-2 bg-[#050806] p-2.5 rounded-lg border border-emerald-950">
                <span class="text-emerald-400">👨‍🍳</span>
                <span>{{ t('q2') }}</span>
              </div>
              <div class="flex items-center space-x-2 bg-[#050806] p-2.5 rounded-lg border border-emerald-950">
                <span class="text-emerald-400">✨</span>
                <span>{{ t('q3') }}</span>
              </div>
              <div class="flex items-center space-x-2 bg-[#050806] p-2.5 rounded-lg border border-emerald-950">
                <span class="text-emerald-400">🛡️</span>
                <span>{{ t('q4') }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2.5">{{ t('customerFeedback') }}</h3>
            
            <div 
              @click="openCommentsModal = true"
              class="bg-[#101b15] hover:bg-[#15271e] border border-emerald-900/60 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all duration-200 flex items-center justify-between group"
            >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  <span>{{ getLatestComment(selectedItem)?.author ? getLatestComment(selectedItem).author.charAt(0).toUpperCase() : '⭐' }}</span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-xs text-white">{{ getLatestComment(selectedItem)?.author || 'Anonymous' }}</span>
                    <span class="text-[10px] text-zinc-400">{{ getLatestComment(selectedItem)?.date || '' }}</span>
                  </div>
                  <div class="flex items-center space-x-1 text-amber-400 my-0.5">
                    <svg 
                      v-for="i in 5" 
                      :key="i"
                      class="h-3 w-3" 
                      :class="i <= (getLatestComment(selectedItem)?.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p class="text-xs text-zinc-300 italic line-clamp-1">{{ getLatestComment(selectedItem)?.text || 'No comments yet' }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform pl-2">
                <span>{{ t('viewAllComments') }} ({{ getComments(selectedItem).length }})</span>
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-emerald-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-xs text-zinc-400 text-center sm:text-left">{{ t('waiterNote') }}</div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <button 
                @click="triggerOrder(selectedItem)"
                class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-6 py-3 rounded-lg transition shadow-lg shadow-emerald-950/40 shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🛒 Order Dish</span>
              </button>
              <button 
                @click="closeModal"
                class="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs px-6 py-3 rounded-lg transition shrink-0 cursor-pointer border border-zinc-800"
              >
                {{ t('closeCard') }}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div 
      v-if="openCommentsModal && selectedItem"
      @click.self="openCommentsModal = false"
      class="fixed inset-0 z-[60] bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
    >
      <div class="bg-[#0d1410] border border-emerald-800/80 w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        <div class="p-5 border-b border-emerald-950/80 flex items-center justify-between bg-[#080f0c]">
          <div>
            <h3 class="font-black text-lg text-white">{{ t('allCommentsTitle') }}</h3>
            <p class="text-xs text-emerald-400 font-semibold">{{ getItemMainTitle(selectedItem) }}</p>
          </div>
          <button 
            @click="openCommentsModal = false"
            class="bg-black/75 hover:bg-black p-2 rounded-full text-white border border-emerald-900/60 transition"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-5 overflow-y-auto space-y-4 flex-grow scrollbar-thin">
          <div 
            v-for="comment in getComments(selectedItem)" 
            :key="comment.id"
            class="bg-[#101b15] border border-emerald-950 p-4 rounded-xl"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  <span>{{ comment.author.charAt(0).toUpperCase() }}</span>
                </div>
                <span class="font-bold text-sm text-white">{{ comment.author }}</span>
              </div>
              <span class="text-xs text-zinc-400">{{ comment.date }}</span>
            </div>

            <div class="flex items-center space-x-1 text-amber-400 mb-2">
              <svg 
                v-for="i in 5" 
                :key="i"
                class="h-3.5 w-3.5" 
                :class="i <= comment.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed">{{ comment.text }}</p>
          </div>
        </div>

        <div class="p-4 bg-[#080f0c] border-t border-emerald-950/80">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">{{ t('leaveComment') }}</h4>
          
          <form @submit.prevent="submitComment(selectedItem)" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                v-model="newCommentAuthor" 
                :placeholder="t('yourNamePlaceholder')" 
                required
                class="bg-[#050806] border border-emerald-950 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
              <div class="flex items-center gap-1 bg-[#050806] border border-emerald-950 px-3 py-2 rounded-lg">
                <span class="text-xs text-zinc-400 font-semibold">{{ t('ratingLabel') }}:</span>
                <div class="flex items-center space-x-1 ml-2 cursor-pointer">
                  <svg 
                    v-for="star in 5" 
                    :key="star"
                    @click="newCommentRating = star"
                    class="h-4 w-4" 
                    :class="star <= newCommentRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>

            <textarea 
              v-model="newCommentText" 
              :placeholder="t('yourCommentPlaceholder')" 
              rows="2"
              required
              class="w-full bg-[#050806] border border-emerald-950 text-white placeholder-zinc-500 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none"
            ></textarea>

            <div class="flex justify-end">
              <button 
                type="submit"
                class="bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-extrabold px-5 py-2 rounded-lg transition shadow-md"
              >
                {{ t('postCommentBtn') }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>

    <section
      v-if="!showingDirectory && !menuLoading && !menuLoadError && currentRestaurant.name"
      class="max-w-7xl mx-auto px-4 md:px-8 py-12 w-full border-t border-emerald-950/40"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1410] border border-emerald-950/60 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        <div class="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="lg:col-span-5 flex flex-col justify-center space-y-6 z-10">
          <div class="space-y-2">
            <span class="text-emerald-400 font-black text-sm tracking-widest uppercase"> / <span>{{ t('aboutUsTag') }}</span></span>
            <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">{{ lang === 'am' ? currentRestaurant.amharicName : currentRestaurant.name }}</h2>
          </div>

          <p class="text-zinc-300 text-sm leading-relaxed">{{ lang === 'am' ? currentRestaurant.aboutDescriptionAm : currentRestaurant.aboutDescriptionEn }}</p>
          <p class="text-zinc-400 text-xs leading-relaxed">{{ lang === 'am' ? currentRestaurant.aboutSubtitleAm : currentRestaurant.aboutSubtitleEn }}</p>
        </div>

        <div class="lg:col-span-7 relative z-10">
          <div class="relative aspect-[16/10] rounded-xl overflow-hidden border border-emerald-900/60 shadow-2xl group bg-black">
            
            <div 
              v-for="(slide, index) in currentRestaurant.aboutSlides" 
              :key="index"
              v-show="currentSlide === index"
              class="absolute inset-0 w-full h-full transition-opacity duration-500"
            >
              <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="bg-emerald-600/90 text-black text-xs font-black px-3 py-1 rounded-md backdrop-blur-md">{{ slide.title }}</span>
                <span class="text-zinc-300 text-xs font-semibold">{{ index + 1 }} / {{ currentRestaurant.aboutSlides.length }}</span>
              </div>
            </div>

            <button 
              @click="prevSlide" 
              class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full border border-emerald-900/50 backdrop-blur-md transition-all z-20"
              aria-label="Previous slide"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              @click="nextSlide" 
              class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-full border border-emerald-900/50 backdrop-blur-md transition-all z-20"
              aria-label="Next slide"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
              <button 
                v-for="(slide, index) in currentRestaurant.aboutSlides" 
                :key="'dot-' + index"
                @click="currentSlide = index"
                :class="currentSlide === index ? 'bg-emerald-400 w-6' : 'bg-white/50 w-2'"
                class="h-2 rounded-full transition-all duration-300"
              ></button>
            </div>

          </div>
        </div>

      </div>

      <div 
        v-if="currentRestaurant.stats && currentRestaurant.stats.length > 0"
        :class="{
          'grid grid-cols-1 gap-4 mt-6': currentRestaurant.stats.length === 1,
          'grid grid-cols-2 gap-4 mt-6': currentRestaurant.stats.length === 2,
          'grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6': currentRestaurant.stats.length === 3,
          'grid grid-cols-2 md:grid-cols-4 gap-4 mt-6': currentRestaurant.stats.length === 4,
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6': currentRestaurant.stats.length >= 5
        }"
      >
        <div 
          v-for="stat in currentRestaurant.stats" 
          :key="stat.num"
          class="bg-[#0d1410] border border-emerald-950/60 p-5 rounded-xl text-center"
        >
          <span class="block text-2xl md:text-3xl font-black text-emerald-400">{{ stat.num }}</span>
          <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1 block">{{ lang === 'am' ? (stat.amharicText || stat.text) : stat.text }}</span>
        </div>
      </div>
    </section>

    <footer
      v-if="!showingDirectory && !menuLoading && !menuLoadError"
      class="mt-auto border-t border-emerald-950/40 bg-[#030504] py-12 px-4 md:px-8 text-xs text-zinc-400"
    >
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center space-x-3">
          <span class="font-extrabold text-sm tracking-tight text-white uppercase">{{ t('digitalMenu') }}</span>
        </div>
        
        <div class="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
          <span class="hover:text-white transition cursor-pointer">{{ t('standards') }}</span>
          <span class="hover:text-white transition cursor-pointer">{{ t('terms') }}</span>
          <span class="hover:text-white transition cursor-pointer">{{ t('desk') }}</span>
        </div>

        <div>
          <p class="text-[11px] text-zinc-500">{{ t('rights') }}</p>
        </div>
      </div>
    </footer>

    <!-- ORDER MODAL -->
    <div 
      v-if="openOrderModal && orderItem"
      @click.self="openOrderModal = false"
      class="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="bg-[#0d1410] border border-emerald-800/80 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button 
          @click="openOrderModal = false"
          class="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold text-lg"
        >
          ✕
        </button>
        <div v-if="!orderSuccess">
          <div class="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-950">
            <span class="text-2xl">🍲</span>
            <div>
              <h3 class="font-bold text-white text-base">{{ getItemMainTitle(orderItem) }}</h3>
              <span class="text-xs text-emerald-400 font-semibold">{{ (Number(orderItem.price) || 0).toLocaleString() }} Birr</span>
            </div>
          </div>

          <form @submit.prevent="submitOrder" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Table Number</label>
              <input 
                type="number" 
                v-model.number="orderForm.tableNumber" 
                min="1"
                max="100"
                required 
                class="w-full bg-[#050806] border border-emerald-950 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Quantity / Amount</label>
              <div class="flex items-center gap-3">
                <button 
                  type="button" 
                  @click="orderForm.quantity = Math.max(1, orderForm.quantity - 1)"
                  class="w-10 h-10 bg-[#050806] border border-emerald-950 text-white font-bold rounded-xl text-sm hover:border-emerald-500 cursor-pointer"
                >-</button>
                <input 
                  type="number" 
                  v-model.number="orderForm.quantity" 
                  min="1"
                  required 
                  class="w-20 text-center bg-[#050806] border border-emerald-950 text-white font-bold rounded-xl py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
                <button 
                  type="button" 
                  @click="orderForm.quantity += 1"
                  class="w-10 h-10 bg-[#050806] border border-emerald-950 text-white font-bold rounded-xl text-sm hover:border-emerald-500 cursor-pointer"
                >+</button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-300 uppercase mb-1">Notes / Special Instructions</label>
              <textarea 
                v-model="orderForm.notes" 
                placeholder="e.g. Extra spicy, no onions, extra injera..." 
                rows="3"
                class="w-full bg-[#050806] border border-emerald-950 text-white placeholder-zinc-600 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 resize-none"
              ></textarea>
            </div>

            <p v-if="orderError" class="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-3 py-2">
              {{ orderError }}
            </p>

            <div class="pt-2 flex justify-end gap-2">
              <button 
                type="button" 
                @click="openOrderModal = false"
                class="px-4 py-2.5 bg-zinc-900 text-zinc-400 text-xs font-bold rounded-xl border border-zinc-800 cursor-pointer"
              >Cancel</button>
              <button 
                type="submit"
                :disabled="orderSubmitting"
                class="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-xs font-extrabold rounded-xl transition shadow-lg shadow-emerald-950/50 cursor-pointer"
              >{{ orderSubmitting ? 'Sending…' : 'Send Order to Kitchen' }}</button>
            </div>
          </form>
        </div>

        <div v-else class="text-center py-6">
          <div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mx-auto mb-3">✓</div>
          <h3 class="font-bold text-white text-base">Order Sent to Kitchen!</h3>
          <p class="text-xs text-zinc-400 mt-1">Table #{{ orderForm.tableNumber }} • {{ orderForm.quantity }}x {{ getItemMainTitle(orderItem) }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, reactive } from 'vue'

const isDark = ref(true)
const lang = ref('en')
const activeCategory = ref('all')
const activeType = ref('all')
const searchQuery = ref('')
const selectedItem = ref(null)
const openCommentsModal = ref(false)
const openOrderModal = ref(false)
const orderItem = ref<any>(null)
const orderForm = ref({
  tableNumber: 1,
  quantity: 1,
  notes: ''
})
const orderSuccess = ref(false)
const orderSubmitting = ref(false)
const orderError = ref('')

function triggerOrder(item: any) {
  orderItem.value = item
  orderForm.value = {
    tableNumber: 1,
    quantity: 1,
    notes: ''
  }
  orderSuccess.value = false
  orderError.value = ''
  openOrderModal.value = true
}

async function submitOrder() {
  if (!orderItem.value || orderSubmitting.value) return

  const targetId = currentRestaurant.value?.id || currentSlug.value
  if (!targetId || targetId === 'default') {
    orderError.value = 'Restaurant not loaded. Please refresh and try again.'
    return
  }

  const payload = {
    table_number: Number(orderForm.value.tableNumber) || 1,
    time_left_mins: 15,
    is_delayed: false,
    status: 'New',
    items: [
      {
        name: orderItem.value.name || getItemMainTitle(orderItem.value),
        quantity: Number(orderForm.value.quantity) || 1,
        notes: (orderForm.value.notes || '').trim(),
        is_unavailable: false
      }
    ]
  }

  const config = useRuntimeConfig()
  orderSubmitting.value = true
  orderError.value = ''
  try {
    await $fetch(`/public/restaurants/${targetId}/orders`, {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: payload
    })

    orderSuccess.value = true
    setTimeout(() => {
      orderSuccess.value = false
      openOrderModal.value = false
    }, 2000)
  } catch (e: any) {
    console.error('Error saving order to backend:', e)
    orderError.value = e?.data?.error || e?.message || 'Failed to send order. Please try again.'
  } finally {
    orderSubmitting.value = false
  }
}

const currentSlide = ref(0)
const currentSlug = ref('girum')
const menuListSection = ref(null)

const newCommentAuthor = ref('')
const newCommentRating = ref(5)
const newCommentText = ref('')

let slideInterval: Number | null = null

const i18n = {
  en: {
    searchPlaceholder: "Search for foods and drinks...",
    fullMenu: "Full Menu",
    foodPlates: "Food & Special Plates",
    beverages: "Soft Drinks & Beverages",
    noResultsTitle: "No matching items found",
    noResultsDesc: "We couldn't find any menu items matching your criteria. Let's try adjusting the filters or search keywords.",
    resetFilters: "Reset Filters",
    spicy: "Spicy",
    price: "Price",
    details: "Details",
    storyHeader: "Chef's Special Story & Description",
    ingredientsHeader: "Key Ingredients",
    pairingHeader: "Recommended Pairing",
    qualityHeader: "Quality & Dietary Highlights",
    q1: "Fresh Local Ingredients",
    q2: "Made Fresh to Order",
    q3: "Authentic Spices",
    q4: "Hygienic Preparation",
    waiterNote: "Need customized spice levels or dietary adaptations? Inform your table waiter.",
    closeCard: "Close Detail Card",
    digitalMenu: "AWAZE DIGITAL MENU",
    standards: "Quality Standards",
    terms: "Terms of Dining",
    desk: "Chef's Desk",
    rights: "© 2026 Awaze Menu. All rights reserved.",
    prep: "Prep:",
    reviews: "reviews",
    customerFeedback: "Customer Ratings & Feedback",
    viewAllComments: "View all comments",
    allCommentsTitle: "All Customer Comments",
    leaveComment: "Leave a comment & rating",
    yourNamePlaceholder: "Your full name",
    ratingLabel: "Rating",
    yourCommentPlaceholder: "Write your dining experience...",
    postCommentBtn: "Submit Review",
    aboutUsTag: "A LITTLE ABOUT US"
  },
  am: {
    searchPlaceholder: "ምግብ እና መጠጦችን ይፈልጉ...",
    fullMenu: "ሙሉ ሜኑ",
    foodPlates: "ምግብ እና ልዩ ምግቦች",
    beverages: "ለስላሳዎች እና መጠጦች",
    noResultsTitle: "ምንም የተገኘ ነገር የለም",
    noResultsDesc: "ከመረጡት መስፈርት ጋር የሚስማማ ምንም የሜኑ እቃ አላገኘንም። እባክዎን ፍለጋውን ወይም ፊልተሩን ያስካክሉ።",
    resetFilters: "ፊልተሮችን መልስ",
    spicy: "ሚቃጠል",
    price: "ዋጋ",
    details: "ዝርዝር",
    storyHeader: "የሼፉ ልዩ መግለጫ እና ታሪክ",
    ingredientsHeader: "ዋና ዋና ግብአቶች",
    pairingHeader: "ተመራጭ ጥምረት",
    qualityHeader: "የጥራት እና የጤና ማረጋገጫዎች",
    q1: "ትኩስ የሀገር ውስጥ ግብአቶች",
    q2: "በትእዛዝ ትኩሱ የሚሰራ",
    q3: "እውነተኛ የሀገር ባህል ቅመሞች",
    q4: "በጸዳ ሁኔታ የተዘጋጀ",
    waiterNote: "የቃሪያ መጠን ወይም የዝግጅት ለውጥ ይፈልጋሉ? እባክዎን አሰናጋጅዎን ይንገሩ።",
    closeCard: "ዝጋ",
    digitalMenu: "አዋዜ ዲጂታል ሜኑ",
    standards: "የጥራት መመዘኛዎች",
    terms: "የአገልግሎት ደንቦች",
    desk: "የሼፉ ክፍል",
    rights: "© 2026 አዋዜ ሜኑ። መብቱ በሕግ የተጠበቀ ነው።",
    prep: "ጊዜ:",
    reviews: "አስተያየቶች",
    customerFeedback: "የደንበኞች አስተያየት እና ደረጃ",
    viewAllComments: "ሁሉንም አስተያየቶች ይመልከቱ",
    allCommentsTitle: "ሁሉም የደንበኞች አስተያየቶች",
    leaveComment: "አስተያየትዎን እና ደረጃዎን ያስገቡ",
    yourNamePlaceholder: "ሙሉ ስምዎ",
    ratingLabel: "ደረጃ",
    yourCommentPlaceholder: "ስለ ምግቡ ያለዎትን ስሜት ይፃፉ...",
    postCommentBtn: "አስተያየት ላክ",
    aboutUsTag: "ስለ ኩባንያችን"
  }
}

const categories = reactive([
  { id: 'all', name: 'All Items', amharicName: 'ሁሉም እቃዎች', iconName: 'grid' },
  /*
  { id: 'Meat', name: 'Meat', amharicName: 'ሥጋ', iconName: 'utensils' },
  { id: 'Burger', name: 'Burger', amharicName: 'በርገር', iconName: 'utensils' },
  { id: 'Pizza', name: 'Pizza', amharicName: 'ፒዛ', iconName: 'utensils' },
  { id: 'Chicken', name: 'Chicken', amharicName: 'ዶሮ', iconName: 'utensils' },
  { id: 'Health', name: 'Health & Veg', amharicName: 'ጤናማ / የፆም', iconName: 'leaf' },
  { id: 'Bakery', name: 'Bakery', amharicName: 'ቤከሪ', iconName: 'cake' },
  { id: 'Seafood', name: 'Seafood', amharicName: 'የባህር ምግብ', iconName: 'fish' },
  { id: 'Beverage', name: 'Beverage', amharicName: 'መጠጦች', iconName: 'cup' },
  { id: 'Coffee', name: 'Coffee & Tea', amharicName: 'ቡና እና ሻይ', iconName: 'cup' }
  */
])

const restaurants = ref({
  /*
  girum: {
    id: 'girum',
    name: 'Girum Burger & Pizza',
    amharicName: 'ግሩም በርገር እና ፒዛ',
    tagline: 'Girum Recommendations',
    location: 'Old Airport, Addis Ababa',
    logo: '/assets/images/girum_logo.png',
    aboutDescriptionEn: 'Girum Burger & Pizza has been serving exquisite culinary delights in Addis Ababa for over 15 years, combining traditional recipes with modern artisan baking and sizzling grill craftsmanship.',
    aboutDescriptionAm: 'ግሩም በርገር እና ፒዛ ከ15 ዓመታት በላይ በኢትዮጵያ አዲስ አበባ ውስጥ ልዩ የምግብ ጣዕሞችን በማቅረብ ላይ የሚገኝ ታዋቂ ሬስቶራንት ነው።',
    aboutSubtitleEn: 'Our master chefs craft every single dish using organic locally-sourced ingredients, ensuring unforgettable dining experiences for families and food enthusiasts alike.',
    aboutSubtitleAm: 'ዋና ሼፎቻችን እያንዳንዱን ምግብ ከሀገር ውስጥ ካሉ ንጹህ ግብአቶች ጋር በማዘጋጀት የማይረሳ የምግብ ተሞክሮ ይሰጣሉ።',
    aboutSlides: [
      {
        title: "Girum Interior Dining",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000"
      },
      {
        title: "Master Chef's Kitchen",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=1000"
      },
      {
        title: "VIP Lounge & Bar",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000"
      }
    ],
    stats: [
      { num: '15', text: 'years on market', amharicText: 'ዓመታት በገበያ ላይ' },
      { num: '185', text: 'unique dishes', amharicText: 'ልዩ ምግቦች' },
      { num: '110', text: 'staff members', amharicText: 'ሰራተኞች' }
    ],
    menuItems: [
      {
        id: 'g-f1',
        name: 'Special Sizzling Tibs',
        amharicName: 'ልዩ የጋለ ጥብስ',
        category: 'food',
        subCategory: 'Meat',
        amharicSubCategory: 'ሥጋ',
        price: 680,
        rating: 4.9,
        reviews: 142,
        prepTime: '15-20 min',
        tag: 'Chef Choice',
        amharicTag: 'የሼፉ ምርጫ',
        description: 'Fresh pan-fried prime beef cubes sautéed with onions, rosemary, garlic, and jalapeños, served sizzling hot on a traditional clay burner with sourdough injera.',
        amharicDescription: 'በሽንኩርት፣ ሮዝመሪ፣ ነጭ ሽንኩርት እና ቃሪያ በጋለ የሸክላ ምጣድ ላይ የቀረበ ምርጥ የጥብስ ሥጋ ከእናት እንጀራ ጋር።',
        ingredients: ['Prime Beef Cutlets', 'Organic Rosemary', 'Red Onions', 'Garlic Butter', 'Fresh Jalapeños', 'Awaze Chili Paste'],
        amharicIngredients: ['ምርጥ የሥጋ ቁራጮች', 'ሮዝመሪ', 'ቀይ ሽንኩርት', 'የነጭ ሽንኩርት ቅቤ', 'ቃሪያ', 'አዋዜ'],
        pairing: 'Best enjoyed with our Aged Tej or an ice-cold Habesha Lager.',
        amharicPairing: 'ከእኛ ማር ጠጅ ወይም ከቀዘቀዘ ሐበሻ ቢራ ጋር ቢወሰድ ተመራጭ ነው።',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
        spicy: true,
        calories: '420 kcal'
      },
      {
        id: 'g-f2',
        name: 'Royal Beyaynetu Platter',
        amharicName: 'ሮያል የፆም በያይነቱ',
        category: 'food',
        subCategory: 'Health',
        amharicSubCategory: 'ጤናማ / የፆም',
        price: 490,
        rating: 4.8,
        reviews: 98,
        prepTime: '10-15 min',
        tag: 'Popular',
        amharicTag: 'ተወዳጅ',
        description: 'A colorful, nutritious assortment of traditional vegan stews including split peas (Kik Alicha), spicy lentil stew (Misir Wot), collard greens (Gomen), beetroot, and shiro.',
        amharicDescription: 'ክክ አልጫ፣ ምስር ወጥ፣ ጎመን፣ ቀይ ስር እና የሽንብራ ሽሮ ከተለያዩ ጣፋጭ የፆም ወጦች ጋር የቀረበ።',
        ingredients: ['Yellow Split Peas', 'Red Lentils', 'Collard Greens', 'Roasted Chickpea Shiro', 'Beetroot Salad', 'Sourdough Injera'],
        amharicIngredients: ['ክክ አልጫ', 'ምስር ወጥ', 'ጎመን', 'የሽንብራ ሽሮ', 'ቀይ ስር', 'እንጀራ'],
        pairing: 'Complements wonderfully with our fresh Spris Juice or Hibiscus Tea.',
        amharicPairing: 'ከስፕሪስ ጭማቂ ወይም ከኮርከዴ ሻይ ጋር በጣም ይስማማል።',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '310 kcal'
      },
      {
        id: 'g-f3',
        name: 'Special Burger',
        amharicName: 'ልዩ በርገር',
        category: 'food',
        subCategory: 'Meat',
        amharicSubCategory: 'ሥጋ',
        price: 720,
        rating: 4.9,
        reviews: 210,
        prepTime: '10-15 min',
        tag: 'Signature',
        amharicTag: 'ልዩ ምልክት',
        description: 'Finely minced extra-lean beef gently warmed with clarified spiced butter (Niter Kibbeh) and fiery Mitmita. Served alongside house Ayib (cottage cheese) and Gomen.',
        amharicDescription: 'በለሰለሰ የበርገር ዳቦ፣ በደቀቀ በጥ በጥ ስጋ፣ አይብ እና በልዩ መሶብ ቅመሞች የተዘጋጀ ልዩ በርገር።',
        ingredients: ['Lean Tenderloin Beef', 'Niter Kibbeh Butter', 'Pure Mitmita Spice', 'Homemade Ayib Cheese', 'Steamed Collard Greens'],
        amharicIngredients: ['ልዩ የተቀመመ ሥጋ', 'የለሰለሰ ቅቤ', 'ሚጥሚጣ', 'የቤት አይብ', 'የተቀቀለ ጎመን'],
        pairing: 'Pairs seamlessly with cold sparkling water or draft beer.',
        amharicPairing: 'ከቀዘቀዘ ጋዝ ያለው ውኃ ወይም ረቂቅ ቢራ ጋር ይስማማል።',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: true,
        calories: '550 kcal'
      },
      {
        id: 'g-f4',
        name: 'Gourmet Sheger Burger',
        amharicName: 'ጉርሜ ሸገር በርገር',
        category: 'food',
        subCategory: 'Burger',
        amharicSubCategory: 'በርገር',
        price: 420,
        rating: 4.7,
        reviews: 85,
        prepTime: '15-20 min',
        tag: 'Classic',
        amharicTag: 'ክላሲክ',
        description: 'Premium grilled beef patty with sharp cheddar cheese, caramelized onions, signature burger aioli, and crisp lettuce on a toasted sesame brioche bun.',
        amharicDescription: 'በከሰል የተጠበሰ የከብት ሥጋ በርገር ከቼዳር አይብ፣ ከተጠበሰ ሽንኩርት እና ከልዩ ሶስ ጋር የቀረበ።',
        ingredients: ['100% Angus Beef Patty', 'Sharp Cheddar', 'Caramelized Onions', 'Brioche Bun', 'House Garlic Aioli'],
        amharicIngredients: ['የከብት ሥጋ በርገር', 'ቼዳር አይብ', 'የተጠበሰ ሽንኩርት', 'የበርገር ዳቦ', 'ጋርሊክ አዮሊ ሶስ'],
        pairing: 'Try with chilled craft draft lager or iced lemon tea.',
        amharicPairing: 'ከቀዘቀዘ ድራፍት ቢራ ወይም አይስድ ሌመን ቲ ጋር ይሞክሩት።',
        image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: false,
        calories: '620 kcal'
      },
      {
        id: 'g-f5',
        name: 'Smoked Yellow Cocktail',
        amharicName: 'ስሞክድ የሎው ኮክቴል',
        category: 'food',
        subCategory: 'Bakery',
        amharicSubCategory: 'ቤከሪ',
        price: 580,
        rating: 4.6,
        reviews: 44,
        prepTime: '10 min',
        tag: 'Fresh',
        amharicTag: 'ትኩስ',
        description: 'House-baked rustic sourdough bread topped with creamy herb dill cheese spread, cold-smoked salmon slices, pickled onions, and organic microgreens.',
        amharicDescription: 'በተጠበሰ የቤት ዳቦ ላይ የቀረበ የሳልሞን ዓሳ ከተለየ አይብ እና ቅጠላቅጠሎች ጋር።',
        ingredients: ['Artisan Sourdough', 'Smoked Salmon Slices', 'Dill Cream Cheese', 'Capers & Pickled Onions', 'Fresh Microgreens'],
        amharicIngredients: ['የቤት ዳቦ', 'ስሞክድ ሳልሞን ዓሳ', 'ዲል ክሬም አይብ', 'ቃሪያ እና የተቀመመ ሽንኩርት', 'ትኩስ ቅጠላቅጠል'],
        pairing: 'Pairs excellently with Grand Macchiato or freshly squeezed juices.',
        amharicPairing: 'ከግራንድ ማኪያቶ ወይም ከተፈጥሮ ጭማቂዎች ጋር በጣም ይስማማል።',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: false,
        calories: '280 kcal'
      },
      {
        id: 'g-f6',
        name: 'Spiced Chicken Skewers',
        amharicName: 'የተቀመመ የዶሮ ሺሽ',
        category: 'food',
        subCategory: 'Chicken',
        amharicSubCategory: 'ዶሮ',
        price: 490,
        rating: 4.7,
        reviews: 62,
        prepTime: '20-25 min',
        tag: 'Spicy Delight',
        amharicTag: 'የሚቃጠል ጣዕም',
        description: 'Tender chicken thighs marinated in home-blended Berbere and garlic rub, charcoal-grilled to perfection. Served with spicy avocado dips.',
        amharicDescription: 'በበርበሬ እና ነጭ ሽንኩርት የተቀመመ በከሰል የተጠበሰ የዶሮ ሥጋ ከልዩ አቮካዶ ሶስ ጋር።',
        ingredients: ['Farm Chicken Thighs', 'Berbere Blend', 'Smoked Garlic', 'Fresh Lime Juice', 'Avocado Crema'],
        amharicIngredients: ['የዶሮ ሥጋ', 'የቤት በርበሬ', 'ነጭ ሽንኩርት', 'ሎሚ', 'የአቮካዶ ክሬም'],
        pairing: 'Great with cold craft beers or sparkling iced tea.',
        amharicPairing: 'ከቀዘቀዘ ቢራ ወይም ከበረዶ የሻይ መጠጥ ጋር ተመራጭ ነው።',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
        spicy: true,
        calories: '390 kcal'
      },
      {
        id: 'g-f7',
        name: 'Smokey Pepperoni Pizza',
        amharicName: 'ስሞኪ ፔፔሮኒ ፒዛ',
        category: 'food',
        subCategory: 'Pizza',
        amharicSubCategory: 'ፒዛ',
        price: 540,
        rating: 4.8,
        reviews: 130,
        prepTime: '15-20 min',
        tag: 'Bestseller',
        amharicTag: 'ተመራጭ',
        description: 'Artisanal thin sourdough crust layered with spicy marinara, dry-cured beef pepperoni, fresh shredded mozzarella, and dried wild oregano.',
        amharicDescription: 'በቀጭኑ በተጋገረ ፒዛ ላይ የተሰራ ፔፔሮኒ፣ ሞዛሬላ አይብ እና የቲማቲም ሶስ።',
        ingredients: ['Sourdough Pizza Crust', 'Beef Pepperoni', 'Low-Moisture Mozzarella', 'San Marzano Tomato Sauce', 'Wild Oregano'],
        amharicIngredients: ['የፒዛ ሊቅ', 'ፔፔሮኒ', 'ሞዛሬላ አይብ', 'የቲማቲም ሶስ', 'ኦሬጋኖ'],
        pairing: 'Pairs ideally with soft drinks, lager beer, or iced hibiscus tea.',
        amharicPairing: 'ከልስላሴ መጠጦች፣ ከቢራ ወይም ከኮርከዴ ሻይ ጋር ይስማማል።',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '780 kcal'
      },
      {
        id: 'g-f8',
        name: 'Herb Grilled Sea Bass',
        amharicName: 'የዓሳ ግሪል',
        category: 'food',
        subCategory: 'Seafood',
        amharicSubCategory: 'የባህር ምግብ',
        price: 950,
        rating: 4.9,
        reviews: 77,
        prepTime: '25 min',
        tag: 'Luxury Selection',
        amharicTag: 'የላቀ መረጣ',
        description: 'Fresh sea bass fillet marinated in lemon zest and garden herbs, oven-grilled, and accompanied with creamy buttered herbal rice.',
        amharicDescription: 'በትኩሱ የተጠበሰ የባህር ዓሳ በሎሚ እና በቅጠላቅጠል የተቀመመ ከቅቤ ሩዝ ጋር።',
        ingredients: ['Fresh Sea Bass Fillet', 'Lemon Zest & Thyme', 'Extra Virgin Olive Oil', 'Herbed Butter Rice', 'Steamed Asparagus'],
        amharicIngredients: ['ትኩስ የዓሳ ሥጋ', 'ሎሚ እና ታይም', 'የወይራ ዘይት', 'የቅቤ ሩዝ', 'አስፓራገስ'],
        pairing: 'Pairs wonderfully with chilled Tej honey wine or sparkling water.',
        amharicPairing: 'ከቀዘቀዘ ማር ጠጅ ወይም ከጋዝ ውኃ ጋር በጣም ይስማማል።',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '450 kcal'
      },
      {
        id: 'g-d1',
        name: 'Premium Aged Tej',
        amharicName: 'ፕሪሚየም ማር ጠጅ',
        category: 'drinks',
        subCategory: 'Beverage',
        amharicSubCategory: 'መጠጦች',
        price: 320,
        rating: 4.9,
        reviews: 160,
        prepTime: '5 min',
        tag: 'Heritage Brew',
        amharicTag: 'የባህል መጠጥ',
        description: 'Our house-crafted organic honey wine, slowly fermented with Gesho roots. Offers a smooth, delightfully sweet and crisp finish.',
        amharicDescription: 'ከንጹህ ማር እና ከጌሾ ተመርቶ በባህል መንገድ የተዘጋጀ ጣፋጭ ማር ጠጅ።',
        ingredients: ['Pure Wildflower Honey', 'Gesho (Rhamnus prinoides)', 'Natural Spring Water'],
        amharicIngredients: ['ንጹህ የማር ጠጅ', 'ጌሾ', 'የምንጭ ውኃ'],
        pairing: 'Pairs perfectly with Special Tibs, Kitfo, or grilled spicy dishes.',
        amharicPairing: 'ከጋለ ጥብስ፣ ከክትፎ እና ከሚቃጠሉ ምግቦች ጋር ምርጥ ጥምረት ነው።',
        image: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '180 kcal'
      },
      {
        id: 'g-d2',
        name: 'Spris Juice',
        amharicName: 'ስፕሪስ ጭማቂ',
        category: 'drinks',
        subCategory: 'Beverage',
        amharicSubCategory: 'መጠጦች',
        price: 180,
        rating: 4.8,
        reviews: 112,
        prepTime: '5-10 min',
        tag: 'Healthy',
        amharicTag: 'ጤናማ',
        description: 'Thick, beautifully layered natural fruit juice made from ripe avocados, sweet mangoes, and red papayas. Finished with a slice of lime.',
        amharicDescription: 'ከተፈጥሮ አቮካዶ፣ ማንጎ እና ፓፓያ ተደራርቦ የተዘጋጀ አልሚ እና ጣፋጭ የፍራፍሬ ጭማቂ።',
        ingredients: ['Ripe Hass Avocado', 'Fresh Mango Puree', 'Red Papaya Pulp', 'Fresh Lime Wedge'],
        amharicIngredients: ['አቮካዶ', 'ማንጎ', 'ፓፓያ', 'ሎሚ'],
        pairing: 'Enjoy alongside Beyaynetu vegetarian platters or light bakery toasts.',
        amharicPairing: 'ከበያይነቱ ወይም ከዳቦ ምግቦች ጋር ይውሰዱት።',
        image: 'https://plus.unsplash.com/premium_photo-1681826664053-5f50e4a0c513?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: false,
        calories: '210 kcal'
      },
      {
        id: 'g-d3',
        name: 'Grand Macchiato',
        amharicName: 'ግራንድ ማኪያቶ',
        category: 'drinks',
        subCategory: 'Coffee',
        amharicSubCategory: 'ቡና እና ሻይ',
        price: 95,
        rating: 4.9,
        reviews: 320,
        prepTime: '5 min',
        tag: 'Barista Star',
        amharicTag: 'የባሪስታ ኮከብ',
        description: 'Our world-renowned, signature dark roast Ethiopian espresso poured through velvety steam-frothed milk layers to achieve absolute perfection.',
        amharicDescription: 'ከታወቀ የኢትዮጵያ ቡና ተቆልቶ ከለሰለሰ ወተት ጋር የተዘጋጀ ልዩ ማኪያቶ።',
        ingredients: ['Organic Single-Origin Espresso Beans', 'Whole Steam-Foamed Milk'],
        amharicIngredients: ['የኢትዮጵያ ቡና', 'የተነቀረ ወተት'],
        pairing: 'Pairs wonderfully with breakfast pastries or gourmet sourdough toasts.',
        amharicPairing: 'ከቁርስ ዳቦዎች ወይም ከኬክ ጋር በጣም ይስማማል።',
        image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: false,
        calories: '90 kcal'
      },
      {
        id: 'g-d4',
        name: 'Chilled Hibiscus Herbal Tea',
        amharicName: 'የቀዘቀዘ የኮርከዴ ሻይ',
        category: 'drinks',
        subCategory: 'Coffee',
        amharicSubCategory: 'ቡና እና ሻይ',
        price: 140,
        rating: 4.7,
        reviews: 55,
        prepTime: '5 min',
        tag: 'Refreshed',
        amharicTag: 'አያናሽ',
        description: 'Invigorating organic dried hibiscus leaf infusion over ice, naturally sweetened with raw sugarcane honey syrup and fresh mint leaves.',
        amharicDescription: 'ከተፈጥሮ የኮርከዴ አበባ ተፈልቶ በበረዶ፣ በማር እና በምናና ቅጠል የቀረበ ማቀዝቀዣ መጠጥ።',
        ingredients: ['Dried Hibiscus Flowers', 'Raw Honey Syrup', 'Fresh Mint Leaves', 'Crushed Ice'],
        amharicIngredients: ['የኮርከዴ አበባ', 'የማር ሶስ', 'የምናና ቅጠል', 'በረዶ'],
        pairing: 'Ideal for refreshing your palate between spicy dishes.',
        amharicPairing: 'የሚቃጠሉ ምግቦችን ከተመገቡ በኋላ አፌን ለማቀዝቀዝ ምርጥ ነው።',
        image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '75 kcal'
      },
      {
        id: 'g-d5',
        name: 'Habesha Cold Lager',
        amharicName: 'ሐበሻ የቀዘቀዘ ቢራ',
        category: 'drinks',
        subCategory: 'Beverage',
        amharicSubCategory: 'መጠጦች',
        price: 120,
        rating: 4.7,
        reviews: 189,
        prepTime: '2 min',
        tag: 'Chilled',
        amharicTag: 'የቀዘቀዘ',
        description: 'Premium local beer crafted from pure spring waters, featuring a deep rich malt aroma and exceptionally crisp golden bubbles.',
        amharicDescription: 'ከንጹህ ምንጭ ውኃ እና ብቅል የተጠመቀ የቀዘቀዘ ባህላዊ ሐበሻ ቢራ።',
        ingredients: ['Barley Malt', 'Hops', 'Pure Mountain Water'],
        amharicIngredients: ['የገብስ ብቅል', 'ሆፕስ', 'የምንጭ ውኃ'],
        pairing: 'The classic pairing for Sizzling Tibs and burgers.',
        amharicPairing: 'ከጋለ ጥብስ እና በርገር ጋር ክላሲክ ጥምረት።',
        image: 'https://images.unsplash.com/photo-1500217052183-bc01eee1a74e?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        spicy: false,
        calories: '140 kcal'
      }
    ]
  },
  dell: {
    id: 'dell',
    name: 'Dell Hotel & Restaurant',
    amharicName: 'ዴል ሆቴል እና ሬስቶራንት',
    tagline: 'Dell Executive Culinary Experience',
    location: 'Bole, Addis Ababa',
    logo: '/assets/dell_logo.png',
    aboutDescriptionEn: 'Dell Hotel & Restaurant offers upscale executive dining in the heart of Bole. Known for premium steaks, international gastronomy, and luxurious ambiance.',
    aboutDescriptionAm: 'ዴል ሆቴል እና ሬስቶራንት በቦሌ መሀል የሚገኝ ዘመናዊ እና የላቀ የሆቴል አገልግሎት የሚሰጥ ተቋም ነው።',
    aboutSubtitleEn: 'We curate elite culinary experiences for business leaders and travelers, blending top-tier hospitality with world-class kitchen standards.',
    aboutSubtitleAm: 'ለעግዶች እና ለንግድ ሰዎች ልዩ የምግብ ዝግጅቶችን እና የላቀ እንክብካቤን እናቀርባለን።',
    aboutSlides: [
      {
        title: "Dell Luxury Suite",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=1000"
      },
      {
        title: "Executive Dining Hall",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000"
      }
    ],
    stats: [
      { num: '10', text: 'years of excellence', amharicText: 'የላቀ አገልግሎት ዓመታት' },
      { num: '85', text: 'expert staff', amharicText: 'ባለሙያ ሰራተኞች' }
    ],
    menuItems: [
      {
        id: 'd-f1',
        name: 'Dell Prime Ribeye Steak',
        amharicName: 'ዴል ፕራይም ሪባይ እስቴክ',
        category: 'food',
        subCategory: 'Meat',
        amharicSubCategory: 'ሥጋ',
        price: 890,
        rating: 4.9,
        reviews: 115,
        prepTime: '20-25 min',
        tag: 'Chef Special',
        amharicTag: 'የሼፉ ልዩ',
        description: '300g aged tender ribeye cooked to preference, served with garlic mashed potatoes and grilled asparagus with red wine reduction.',
        amharicDescription: '300 ግራም የከብት ሪባይ እስቴክ በነጭ ሽንኩርት ድንች እና አስፓራገስ ከተጠበሰ ሬድ ዋይን ሶስ ጋር የቀረበ።',
        ingredients: ['Aged Beef Ribeye', 'Garlic Butter', 'Idaho Potatoes', 'Fresh Asparagus', 'Red Wine Sauce'],
        amharicIngredients: ['የከብት ሪባይ', 'የነጭ ሽንኩርት ቅቤ', 'ድንች', 'አስፓራገስ', 'ሬድ ዋይን ሶስ'],
        pairing: 'Best accompanied by chilled mineral water or house red brew.',
        amharicPairing: 'ከቀዘቀዘ ሚነራል ውኃ ወይም ከቀይ መጠጥ ጋር ይስማማል።',
        image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '650 kcal'
      }
    ]
  }
  */
})

const currentRestaurant = computed(() => {
  return restaurants.value[currentSlug.value] || {
    name: '', amharicName: '', logo: '', aboutSlides: [], stats: [], menuItems: []
  }
})

const visibleCategories = computed(() => {
  /*
  if (activeType.value === 'food') {
    return categories.filter(c => c.id === 'all' || ['Meat', 'Burger', 'Pizza', 'Chicken', 'Health', 'Bakery', 'Seafood'].includes(c.id))
  } else if (activeType.value === 'drinks') {
    return categories.filter(c => c.id === 'all' || ['Beverage', 'Coffee'].includes(c.id))
  }
  */
  return categories
})

const filteredItems = computed(() => {
  let items = currentRestaurant.value.menuItems || []
  if (activeType.value === 'food') {
    items = items.filter(i => i.category === 'food')
  } else if (activeType.value === 'drinks') {
    items = items.filter(i => i.category === 'drinks')
  }

  if (activeCategory.value !== 'all') {
    items = items.filter(i => i.subCategory === activeCategory.value)
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.amharicName && i.amharicName.toLowerCase().includes(q)) ||
      i.subCategory.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    )
  }
  return items
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function toggleLang() {
  lang.value = lang.value === 'en' ? 'am' : 'en'
}

function t(key) {
  return (i18n[lang.value] && i18n[lang.value][key]) ? i18n[lang.value][key] : (i18n['en'][key] || key)
}

function getCatName(cat) {
  return lang.value === 'am' ? (cat.amharicName || cat.name) : cat.name
}

function getItemMainTitle(item) {
  if (!item) return ''
  return lang.value === 'en' ? item.name : (item.amharicName || item.name)
}

function getItemSubTitle(item) {
  if (!item) return ''
  return lang.value === 'en' ? item.amharicName : item.name
}

function getItemDescription(item) {
  if (!item) return ''
  return lang.value === 'am' ? (item.amharicDescription || item.description) : item.description
}

function getItemIngredients(item) {
  if (!item) return []
  return lang.value === 'am' ? (item.amharicIngredients || item.ingredients) : item.ingredients
}

function getItemPairing(item) {
  if (!item) return ''
  return lang.value === 'am' ? (item.amharicPairing || item.pairing) : item.pairing
}

function getItemSubCategory(item) {
  if (!item) return ''
  if (lang.value === 'am') {
    const cat = categories.find(c => c.id === item.subCategory)
    return cat ? cat.amharicName : (item.amharicSubCategory || item.subCategory)
  }
  return item.subCategory
}

function getItemTag(item) {
  if (!item) return ''
  return lang.value === 'am' ? (item.amharicTag || item.tag) : item.tag
}

function setMenuType(type) {
  activeType.value = type
  activeCategory.value = 'all'
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'all'
  activeType.value = 'all'
}

function getCategoryIcon(iconName) {
  return `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>`
}

function getComments(item) {
  if (!item || !item.comments) return []
  return item.comments
}

function getLatestComment(item) {
  const list = getComments(item)
  return list.length > 0 ? list[0] : null
}

async function submitComment(item) {
  if (!newCommentAuthor.value.trim() || !newCommentText.value.trim()) return
  const config = useRuntimeConfig()
  
  if (item.id) {
    try {
      await $fetch(`/public/foods/${item.id}/comments`, {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: {
          author_name: newCommentAuthor.value.trim(),
          rating: Number(newCommentRating.value),
          message: newCommentText.value.trim()
        }
      })
    } catch(e) {
      console.error('Error submitting comment to backend:', e)
    }
  }

  const newComment = {
    id: Date.now(),
    author: newCommentAuthor.value.trim(),
    rating: Number(newCommentRating.value),
    text: newCommentText.value.trim(),
    date: 'Just now'
  }
  if (!item.comments) {
    item.comments = []
  }
  item.comments.unshift(newComment)
  
  const commentsList = item.comments
  const avgRating = commentsList.reduce((acc, c) => acc + c.rating, 0) / commentsList.length
  item.rating = Number(avgRating.toFixed(1))
  item.reviews = commentsList.length

  newCommentAuthor.value = ''
  newCommentRating.value = 5
  newCommentText.value = ''
}

function selectItem(item) {
  selectedItem.value = item
  openCommentsModal.value = false
}

function closeModal() {
  selectedItem.value = null
  openCommentsModal.value = false
}

function scrollToMenu() {
  nextTick(() => {
    if (menuListSection.value) {
      const rect = menuListSection.value.getBoundingClientRect()
      if (rect.top > 100 || rect.top < 0) {
        menuListSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
}

function nextSlide() {
  if (!currentRestaurant.value.aboutSlides?.length) return
  currentSlide.value = (currentSlide.value + 1) % currentRestaurant.value.aboutSlides.length
}

function prevSlide() {
  if (!currentRestaurant.value.aboutSlides?.length) return
  currentSlide.value = (currentSlide.value - 1 + currentRestaurant.value.aboutSlides.length) % currentRestaurant.value.aboutSlides.length
}

function onImgError(event, fallback) {
  event.target.src = fallback
}

const route = useRoute()

const restaurantDirectory = ref<any[]>([])
const directoryLoading = ref(false)
const directoryError = ref('')
const menuLoadError = ref('')

const selectedRestaurantKey = computed(() =>
  String(route.params.id || route.query.id || route.query.restaurant || route.query.r || '').trim()
)

const showingDirectory = computed(() => !selectedRestaurantKey.value)
const menuLoading = ref(!!selectedRestaurantKey.value)

function restaurantRouteId(r: any) {
  return r?.custom_sub_link || r?.id || r?.ID || ''
}

function restaurantDisplayName(r: any) {
  return r?.name_en || r?.NameEn || r?.name || 'Restaurant'
}

function restaurantDisplayNameAm(r: any) {
  return r?.name_am || r?.NameAm || ''
}

async function loadRestaurantDirectory() {
  directoryLoading.value = true
  directoryError.value = ''
  const config = useRuntimeConfig()
  try {
    const list: any = await $fetch('/public/restaurants', { baseURL: config.public.apiBase })
    restaurantDirectory.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error('Failed to load restaurant list:', e)
    directoryError.value = 'Could not load restaurants. Please try again.'
    restaurantDirectory.value = []
  } finally {
    directoryLoading.value = false
  }
}

const filteredDirectory = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return restaurantDirectory.value
  return restaurantDirectory.value.filter((r: any) => {
    const name = restaurantDisplayName(r).toLowerCase()
    const nameAm = restaurantDisplayNameAm(r).toLowerCase()
    const location = String(r.location || '').toLowerCase()
    const slug = String(r.custom_sub_link || '').toLowerCase()
    return name.includes(q) || nameAm.includes(q) || location.includes(q) || slug.includes(q)
  })
})

async function updateRestaurantSlug() {
  const queryParam = selectedRestaurantKey.value
  const config = useRuntimeConfig()

  // No restaurant selected — show the public directory instead of picking the first one
  if (!queryParam) {
    restaurants.value = {}
    menuLoadError.value = ''
    await loadRestaurantDirectory()
    return
  }

  menuLoading.value = true
  menuLoadError.value = ''
  let restData: any = null

  try {
    restData = await $fetch(`/public/restaurants/${queryParam}`, { baseURL: config.public.apiBase })
  } catch (e) {
    console.warn(`Could not find restaurant '${queryParam}' directly, checking full list...`)
  }

  // Resolve by id / custom_sub_link from the list if direct fetch failed — never auto-pick another restaurant
  if (!restData) {
    try {
      const list: any = await $fetch('/public/restaurants', { baseURL: config.public.apiBase })
      if (list && Array.isArray(list) && list.length > 0) {
        const match = list.find((r: any) =>
          (r.id && String(r.id) === queryParam) ||
          (r.ID && String(r.ID) === queryParam) ||
          (r.custom_sub_link && r.custom_sub_link === queryParam)
        )
        if (match) {
          const targetId = match.id || match.ID || match.custom_sub_link
          restData = await $fetch(`/public/restaurants/${targetId}`, { baseURL: config.public.apiBase })
        }
      }
    } catch (e) {
      console.error('Failed to load restaurants from API backend:', e)
    }
  }

  if (!restData) {
    restaurants.value = {}
    menuLoadError.value = 'Restaurant not found.'
    menuLoading.value = false
    return
  }

  const restId = restData.id || restData.ID || restData.custom_sub_link || 'default'
  currentSlug.value = restId

  const newRest = {
    id: restId,
    name: restData.name_en || restData.NameEn || restData.name || 'Restaurant',
    amharicName: restData.name_am || restData.NameAm || '',
    tagline: restData.slogan || '',
    location: restData.location || '',
    logo: restData.logo || '/assets/images/awaze_logo.png',
    aboutDescriptionEn: restData.longer_description || restData.LongerDescription || '',
    aboutDescriptionAm: restData.longer_description || restData.LongerDescription || '',
    aboutSubtitleEn: restData.food_specifications || restData.FoodSpecifications || '',
    aboutSubtitleAm: restData.food_specifications || restData.FoodSpecifications || '',
    aboutSlides: (restData.images || restData.Images || []).map((img: string) => ({ title: 'Gallery', image: img })),
    stats: [],
    menuItems: [] as any[]
  }

  categories.length = 0
  categories.push({ id: 'all', name: 'All Items', amharicName: 'ሁሉም እቃዎች', iconName: 'grid' })

  if (restData.categories && Array.isArray(restData.categories)) {
    for (const cat of restData.categories) {
      const cId = cat.id || cat.ID || cat.name
      const cName = cat.name || cat.Name || 'General'
      categories.push({ id: cId, name: cName, amharicName: cName, iconName: 'utensils' })

      if (cat.foods && Array.isArray(cat.foods)) {
        for (const food of cat.foods) {
          const isDrink = cName.toLowerCase().includes('drink') || cName.toLowerCase().includes('beverage')
          newRest.menuItems.push({
            id: food.id || food.ID,
            name: food.name || food.Name || 'Food Item',
            amharicName: food.name_am || food.NameAm || food.name || food.Name,
            category: isDrink ? 'drinks' : 'food',
            subCategory: cId,
            price: food.price || food.Price || 0,
            rating: food.rating_amount && food.rating_count ? Number((food.rating_amount / food.rating_count).toFixed(1)) : 5.0,
            reviews: food.rating_count || 0,
            prepTime: food.prep_time_minutes ? `${food.prep_time_minutes} min` : '15 min',
            tag: food.tag || food.Tag || '',
            description: food.description || food.Description || '',
            ingredients: food.ingredients || food.Ingredients || [],
            pairing: (food.best_pairings || food.BestPairings || []).join(', '),
            image: food.pic || food.Pic || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
            spicy: food.spicy_or_not || food.IsSpicy || false,
            calories: food.calories ? `${food.calories} kcal` : '',
            comments: (food.comments || food.Comments || []).map((c: any) => ({
              id: c.id || c.ID,
              author: c.author_name || c.AuthorName || 'Guest',
              rating: c.rating || c.Rating || 5,
              text: c.message || c.Message || '',
              date: 'Recently'
            }))
          })
        }
      }
    }
  }

  if (newRest.menuItems.length === 0) {
    const defaultCategories = [
      { id: 'Meat', name: 'Meat & Grills', amharicName: 'ሥጋ እና ጥብስ', iconName: 'fire' },
      { id: 'Burger', name: 'Gourmet Burgers', amharicName: 'በርገር', iconName: 'hamburger' },
      { id: 'Health', name: 'Healthy & Vegan', amharicName: 'ጤናማ / የፆም', iconName: 'leaf' },
      { id: 'Beverage', name: 'Beverages & Drinks', amharicName: 'መጠጦች', iconName: 'glass' }
    ]
    categories.push(...defaultCategories)
    
    newRest.menuItems = [
      {
        id: 'default-f1',
        name: 'Sizzling Beef Tibs',
        amharicName: 'የጋለ የጥብስ ሥጋ',
        category: 'food',
        subCategory: 'Meat',
        amharicSubCategory: 'ሥጋ',
        price: 680,
        rating: 4.9,
        reviews: 142,
        prepTime: '15-20 min',
        tag: "Chef's Choice",
        amharicTag: 'የሼፉ መራጭ',
        description: 'Tender cubed prime beef sauteed with rosemary, red onions, garlic, and fresh green peppers on a piping hot clay skillet. Served with authentic injera.',
        ingredients: ['Prime Beef Cutlets', 'Rosemary', 'Red Onions', 'Garlic Butter', 'Fresh Jalapeños', 'Awaze Chili Paste'],
        pairing: 'Best enjoyed with cold draft beer or tej.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
        spicy: true,
        calories: '420 kcal'
      },
      {
        id: 'default-f2',
        name: 'Royal Beyaynetu Platter',
        amharicName: 'ሮያል የፆም በያይነቱ',
        category: 'food',
        subCategory: 'Health',
        amharicSubCategory: 'ጤናማ / የፆም',
        price: 490,
        rating: 4.8,
        reviews: 98,
        prepTime: '10-15 min',
        tag: 'Popular',
        amharicTag: 'ተወዳጅ',
        description: 'A colorful assortment of traditional vegan stews including Kik Alicha, Misir Wot, Gomen, beetroot salad, and chickpea Shiro served over fresh sourdough injera.',
        ingredients: ['Yellow Split Peas', 'Red Lentils', 'Collard Greens', 'Roasted Chickpea Shiro', 'Beetroot Salad', 'Sourdough Injera'],
        pairing: 'Complements wonderfully with fresh fruit juices.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
        spicy: false,
        calories: '310 kcal'
      },
      {
        id: 'default-f3',
        name: 'Awaze Sheger Burger',
        amharicName: 'አዋዜ ሸገር በርገር',
        category: 'food',
        subCategory: 'Burger',
        amharicSubCategory: 'በርገር',
        price: 520,
        rating: 4.7,
        reviews: 85,
        prepTime: '15 min',
        tag: 'Classic',
        amharicTag: 'ክላሲክ',
        description: 'Premium grilled beef patty with sharp cheddar cheese, caramelized onions, signature burger aioli, and crisp lettuce on a toasted sesame brioche bun.',
        ingredients: ['Angus Beef Patty', 'Sharp Cheddar', 'Caramelized Onions', 'Brioche Bun', 'Garlic Aioli'],
        pairing: 'Try with iced lemon tea or cold lager.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=999&auto=format&fit=crop',
        spicy: false,
        calories: '620 kcal'
      },
      {
        id: 'default-d1',
        name: 'Habesha Cold Lager',
        amharicName: 'ሐበሻ የቀዘቀዘ ቢራ',
        category: 'drinks',
        subCategory: 'Beverage',
        amharicSubCategory: 'መጠጦች',
        price: 120,
        rating: 4.7,
        reviews: 189,
        prepTime: '2 min',
        tag: 'Chilled',
        amharicTag: 'የቀዘቀዘ',
        description: 'Premium local beer crafted from pure spring waters, featuring a deep rich malt aroma and exceptionally crisp golden bubbles.',
        ingredients: ['Barley Malt', 'Hops', 'Pure Mountain Water'],
        pairing: 'The classic pairing for Sizzling Tibs and burgers.',
        image: 'https://images.unsplash.com/photo-1500217052183-bc01eee1a74e?q=80&w=688&auto=format&fit=crop',
        spicy: false,
        calories: '140 kcal'
      }
    ]
  }

  restaurants.value = { [restId]: newRest }
  menuLoading.value = false
}

watch(searchQuery, (val) => {
  if (val && val.trim().length > 0) {
    scrollToMenu()
  }
})

watch(() => [route.params.id, route.query.id, route.query.restaurant, route.query.r], () => {
  searchQuery.value = ''
  updateRestaurantSlug()
})

onMounted(() => {
  updateRestaurantSlug()
  if (process.client) {
    window.addEventListener('popstate', updateRestaurantSlug)
    window.addEventListener('hashchange', updateRestaurantSlug)
  }

  slideInterval = setInterval(() => {
    nextSlide()
  }, 5000)
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('popstate', updateRestaurantSlug)
    window.removeEventListener('hashchange', updateRestaurantSlug)
  }
  if (slideInterval) clearInterval(slideInterval)
})
</script>
<style scoped>
/* Force Literata font on all english text and document elements */
body, h1, h2, h3, h4, h5, h6, span, p, button, input, textarea, a {
  font-family: 'Literata', serif !important;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #064e3b;
  border-radius: 5px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

/* Light Theme Overrides (Applied ONLY when Light Theme is toggled on) */
.light-theme {
  background-color: #f8fafc !important;
  color: #0f172a !important;
}

.light-theme header {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: #e2e8f0 !important;
}

.light-theme header input {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #0f172a !important;
}

.light-theme header input::placeholder {
  color: #64748b !important;
}

.light-theme button[aria-label="Toggle Theme"] {
  background-color: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #059669 !important;
}

.light-theme .relative.overflow-hidden.rounded-2xl.bg-gradient-to-r {
  background: linear-gradient(to right, #ecfdf5, #f8fafc) !important;
  border-color: #a7f3d0 !important;
}

.light-theme .bg-\[\#0d1410\] {
  background-color: #ffffff !important;
  border-color: #e2e8f0 !important;
}

.light-theme .bg-\[\#050806\] {
  background-color: #f1f5f9 !important;
}

.light-theme .bg-\[\#101b15\] {
  background-color: #f0fdf4 !important;
  border-color: #d1fae5 !important;
}

.light-theme .bg-\[\#030504\],
.light-theme .bg-\[\#030604\] {
  background-color: #ffffff !important;
  border-color: #e2e8f0 !important;
}

.light-theme .bg-\[\#0c1611\] {
  background-color: #ecfdf5 !important;
  border-color: #a7f3d0 !important;
}

.light-theme .text-white {
  color: #0f172a !important;
}

.light-theme .text-zinc-300 {
  color: #334155 !important;
}

.light-theme .text-zinc-400 {
  color: #475569 !important;
}

.light-theme .text-zinc-500 {
  color: #64748b !important;
}

.light-theme .text-emerald-400 {
  color: #059669 !important;
}

.light-theme .border-emerald-950,
.light-theme .border-emerald-950\/40,
.light-theme .border-emerald-950\/60,
.light-theme .border-emerald-950\/80,
.light-theme .border-emerald-900\/40,
.light-theme .border-emerald-900\/60,
.light-theme .border-emerald-800\/60 {
  border-color: #e2e8f0 !important;
}

.light-theme .group.bg-\[\#0d1410\] {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.light-theme .group.bg-\[\#0d1410\]:hover {
  border-color: #059669 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.light-theme footer {
  background-color: #ffffff !important;
  border-color: #e2e8f0 !important;
}

.light-theme .scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}
.light-theme .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #059669;
}
</style>

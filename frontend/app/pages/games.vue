<template>
  <div class="flex flex-col min-h-screen bg-[#050806] text-white font-sans antialiased selection:bg-emerald-500 selection:text-black">
    
    <!-- Header Section -->
    <header class="sticky top-0 z-40 bg-[#050806]/95 backdrop-blur-md border-b border-emerald-950/40 px-4 py-3.5 md:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <div class="flex items-center space-x-3">
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
              <h1 class="text-lg md:text-xl font-bold tracking-tight text-white">Awaze Play</h1>
            </div>
            <p class="text-xs text-zinc-400">Interactive Entertainment Hub</p>
          </div>
        </div>

        <!-- Status -->
        <div class="flex items-center gap-3">
          <div class="flex items-center space-x-2 bg-[#0c1611] border border-emerald-950/60 px-3 py-1.5 rounded-xl">
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-xs text-zinc-300">Status:</span>
            <span class="text-xs font-bold text-emerald-400">Online</span>
          </div>
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
        </button>
      </div>

      <!-- Games Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="game in filteredGames" 
          :key="game.id"
          class="bg-[#0d1410] border border-emerald-950/85 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-2xl relative overflow-hidden group hover:border-emerald-500/40"
        >
          <!-- Unavailable Overlay Lock -->
          <div v-if="!game.isAvailable" class="absolute inset-0 bg-[#050806]/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 transition-all">
            <div class="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 text-xl mb-3 shadow-lg">
              🔒
            </div>
            <h4 class="text-sm font-bold text-white mb-1">Coming Soon / Unavailable</h4>
            <p class="text-xs text-zinc-400 max-w-[200px]">This game category or module is currently locked for maintenance.</p>
          </div>

          <!-- Card Header -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <!-- Rating on top left -->
              <div class="flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span>★</span>
                <span>{{ game.rating }}</span>
              </div>
              
              <div class="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span>🎮</span>
                <span>{{ game.type }}</span>
              </div>
            </div>

            <!-- Showcase Area -->
            <div class="mb-6 text-center flex flex-col items-center justify-center min-h-[120px]">
              <span class="text-4xl mb-3">{{ game.icon }}</span>
              <h3 class="text-xl md:text-2xl font-extrabold tracking-tight text-emerald-400 mb-2">
                {{ game.name }}
              </h3>
              <p class="text-xs text-zinc-300 leading-relaxed px-2">{{ game.description }}</p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="pt-4 border-t border-emerald-950/40 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Duration / Mode</span>
              <span class="text-xs font-bold text-emerald-400">{{ game.duration }}</span>
            </div>

            <button 
              @click="playGame(game)"
              class="w-full py-3 px-5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wider border border-emerald-500/30 bg-[#050806] text-emerald-400 hover:bg-emerald-950/40"
            >
              <span>Play Now</span>
              <span class="text-sm">›</span>
            </button>
          </div>

        </div>
      </div>

    </main>

  </div>
</template>

<script>
export default {
  name: 'AwazePlay',
  data() {
    return {
      selectedCategory: 'all',
      categories: [
        { id: 'all', label: 'All Games' },
        { id: 'Quick Play', label: 'Quick Play (30-60 sec)' },
        { id: 'Ethio Quiz', label: 'Ethio Quiz' },
        { id: 'Play Together', label: 'Play Together' }
      ],
      games: [
        {
          id: 1,
          name: 'Spot the Difference',
          category: 'Quick Play',
          type: 'Quick Play',
          duration: '30-60 Sec',
          icon: '🔍',
          rating: '4.8',
          description: 'Compare two images side-by-side and find subtle differences before the timer runs out.',
          isAvailable: true
        },
        {
          id: 2,
          name: 'Math Rush',
          category: 'Quick Play',
          type: 'Quick Play',
          duration: '30 Sec',
          icon: '⚡',
          rating: '4.9',
          description: 'Answer fast arithmetic challenges to rack up points in under a minute.',
          isAvailable: true
        },
        {
          id: 3,
          name: 'Ethiopian General Knowledge',
          category: 'Ethio Quiz',
          type: 'Ethio Quiz',
          duration: '1 Min',
          icon: '🇪🇹',
          rating: '5.0',
          description: 'Test your knowledge on Ethiopian history, geography, culture, and traditions.',
          isAvailable: true
        },
        {
          id: 4,
          name: 'Ludo',
          category: 'Play Together',
          type: 'Multiplayer',
          duration: 'Match-based',
          icon: '🎲',
          rating: '4.7',
          description: 'Classic board game experience. Roll the dice and race your tokens to home base.',
          isAvailable: false
        },
        {
          id: 5,
          name: 'Chess',
          category: 'Play Together',
          type: 'Multiplayer',
          duration: 'Strategy',
          icon: '♟️',
          rating: '4.9',
          description: 'Test your tactical brilliance against friends or online opponents.',
          isAvailable: false
        }
      ]
    }
  },
  computed: {
    filteredGames() {
      if (this.selectedCategory === 'all') return this.games;
      return this.games.filter(g => g.category === this.selectedCategory);
    }
  },
  methods: {
    onImgError(event, fallbackUrl) {
      event.target.src = fallbackUrl;
    },
    playGame(game) {
      if (!game.isAvailable) {
        alert('This game is currently locked/unavailable.');
        return;
      }
      alert(`Starting ${game.name}! Get ready.`);
    }
  }
}
</script>
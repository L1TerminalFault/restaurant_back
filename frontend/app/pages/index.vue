<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()
const firstRestaurantId = ref('')

onMounted(async () => {
  try {
    const res: any = await $fetch('/public/restaurants', {
      baseURL: config.public.apiBase
    })
    if (res && res.length > 0) {
      firstRestaurantId.value = res[0].id || res[0].ID || res[0].custom_sub_link
    }
  } catch (err) {
    console.error('Failed to fetch restaurants', err)
  }
})

const menuLink = '/sample-menu'
</script>

<template>
  <div class="bg-black">
  <!-- Top Header Bar -->
  <header class="sticky top-0 z-50 bg-obsidian-950/85 backdrop-blur-md border-b border-brand-900/30 px-6 lg:px-12 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center space-x-3 group">
        <div class="w-10 h-10 p-[2px] group-hover:scale-105 transition-transform">
          <img src="/assets/images/awaze_logo.png" alt="Logo">
        </div>
        <div class="flex flex-col">
          <span class="font-black text-xl tracking-tight text-white uppercase leading-none">AWAZE <span class="text-transparent text-[1px]">.</span><span class="text-brand-400 text-xl uppercase font-bold tracking-widest mt-1"> አዋዜ</span></span>
        </div>
      </a>

      <!-- Primary Action CTA -->
      <NuxtLink :to="menuLink">
      <div class="flex items-center space-x-4">
          <h1 class="shimmer-button bg-brand-500 hover:bg-brand-400 text-center text-black font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95">Look at sample <br><span class="font-bold">ናሙና ይመልከቱ</span></h1>
      </div>
      </NuxtLink>

    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative spotlight-hero min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
    <!-- Ambient Background Glow Circles -->
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto flex flex-col items-center text-center z-10 space-y-6">
      
      <!-- Concise Pill Badge -->
      <!-- Ultra-Brief Typography Headline -->
      <div class="space-y-3 max-w-3xl">
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none">
          Digital Menus <br/>
          <span class="font-bold block sm:inline-block bg-clip-text text-transparent bg-linear-to-r from-brand-400 via-emerald-200 to-amber-400">ዲጂታል የምግብ ዝርዝሮች</span><br>
        </h1>
        <p class="text-xs sm:text-sm text-zinc-400 uppercase tracking-widest font-semibold max-w-md mx-auto pt-2">
          Create Appetite. Eliminate Printing Costs.<br><span class="normal-case font-normal text-zinc-300 text-[11px]">ምግብዎን ማራኪ ያድርጉ • የታተመ ወረቀት ወጪን ያስወግዱ</span>
        </p>
      </div>

      <!-- Centerpiece 3D Smartphone Mockup -->
      <div class="relative pt-6 pb-4">
        
        <!-- Floating Accent Label - Left -->
        <div class="hidden md:flex absolute -left-36 top-1/3 z-20 items-center space-x-3 bg-obsidian-900/90 border border-brand-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-float">
          <div class="w-3 h-3 rounded-full bg-brand-400"></div>
          <div class="text-left">
            <p class="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Zero Printing</p>
            <p class="text-xs font-black text-white uppercase">Instant Updates</p>
          </div>
        </div>

        <!-- Floating Accent Label - Right -->
        <div class="hidden md:flex absolute -right-36 top-1/2 z-20 items-center space-x-3 bg-obsidian-900/90 border border-amber-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-float-delayed">
          <div class="w-3 h-3 rounded-full bg-amber-400"></div>
          <div class="text-left">
            <p class="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Visual Upselling</p>
            <p class="text-xs font-black text-white uppercase">+22% Avg. Order</p>
          </div>
        </div>

        <!-- The Smartphone Container (Redirects to menu.html on click) -->
        <NuxtLink :to="menuLink">
        <div 
          class="phone-body cursor-pointer relative w-[280px] sm:w-[310px] h-[570px] bg-zinc-950 rounded-[48px] p-3 border-[4px] border-zinc-700/80 group overflow-hidden select-none"
        >
          <!-- Outer Titanium Rim / Button Accents -->
          <div class="absolute -left-[7px] top-28 w-[3px] h-8 bg-zinc-700 rounded-l"></div>
          <div class="absolute -left-[7px] top-40 w-[3px] h-12 bg-zinc-700 rounded-l"></div>
          <div class="absolute -left-[7px] top-56 w-[3px] h-12 bg-zinc-700 rounded-l"></div>
          <div class="absolute -right-[7px] top-36 w-[3px] h-16 bg-zinc-700 rounded-r"></div>

          <!-- Glass Screen Overlay Glare -->
          <div class="phone-screen-glare absolute inset-0 z-30 pointer-events-none rounded-[44px]"></div>

          <!-- Screen Inner Viewport -->
          <div class="w-full h-full bg-obsidian-950 rounded-[40px] border border-zinc-800 overflow-hidden relative flex flex-col justify-between p-4">
            
            <!-- Phone Dynamic Island & Status Bar -->
            <div class="w-full flex justify-between items-center text-[9px] text-zinc-400 font-bold pt-1 px-3 z-20">
              <span>9:41</span>
              <!-- Dynamic Island Notch -->
              <div class="w-20 h-4 bg-black rounded-full border border-zinc-800/80 flex items-center justify-end px-2 space-x-1">
                <div class="w-2 h-2 rounded-full bg-blue-900/60"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>
              <span>5G</span>
            </div>

            <!-- Simulated Menu Preview Content inside Phone -->
            <div class="flex-1 my-3 space-y-3 overflow-hidden text-left relative z-10">
              <!-- Header Bar in Phone -->
              <div class="flex justify-between items-center pb-2 border-b border-brand-900/30">
                <div>
                  <h4 class="text-xs font-black text-white tracking-wider uppercase">Bole Hub Restaurant</h4>
                  <p class="text-[8px] text-brand-400 font-bold uppercase">Table 07 • Live Menu</p>
                </div>
                <span class="text-[8px] bg-brand-500/20 text-brand-400 font-black px-2 py-0.5 rounded-full">QR Connected</span>
              </div>

              <!-- Hero Dish Item inside Phone Screen -->
              <div class="relative h-36 rounded-2xl overflow-hidden border border-brand-900/40 group-hover:scale-[1.02] transition-transform">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
                <div class="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-end">
                  <div>
                    <span class="text-[7px] font-black uppercase text-amber-400 bg-black/60 px-1.5 py-0.5 rounded">Chef's Choice</span>
                    <h5 class="text-xs font-black text-white uppercase leading-tight mt-0.5">Sizzling Beef Tibs</h5>
                  </div>
                  <span class="text-xs font-black text-brand-400 bg-obsidian-950/80 px-2 py-0.5 rounded-lg">680 ETB</span>
                </div>
              </div>

              <!-- List Items inside Phone Screen -->
              <div class="space-y-2">
                <div class="bg-obsidian-900/90 p-2 rounded-xl border border-brand-950 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=150&auto=format&fit=crop" class="w-9 h-9 rounded-lg object-cover">
                    <div>
                      <h6 class="text-[10px] font-black text-white uppercase leading-none">Awaze Burger</h6>
                      <span class="text-[8px] text-zinc-500 font-bold">420 ETB</span>
                    </div>
                  </div>
                  <span class="text-[8px] bg-brand-500 text-black font-black px-2 py-1 rounded-md uppercase">Order</span>
                </div>

                <div class="bg-obsidian-900/90 p-2 rounded-xl border border-brand-950 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=150&auto=format&fit=crop" class="w-9 h-9 rounded-lg object-cover">
                    <div>
                      <h6 class="text-[10px] font-black text-white uppercase leading-none">Yirgacheffe Coffee</h6>
                      <span class="text-[8px] text-zinc-500 font-bold">95 ETB</span>
                    </div>
                  </div>
                  <span class="text-[8px] bg-brand-500 text-black font-black px-2 py-1 rounded-md uppercase">Order</span>
                </div>
              </div>
            </div>

            <!-- Tap Overlay Trigger Callout inside Phone Screen -->
            <div class="z-20 text-black! w-full py-2.5 bg-linear-to-r from-brand-500 to-amber-500 rounded-xl  font-black text-[10px] uppercase tracking-widest text-center shadow-lg group-hover:brightness-110 transition-all flex items-center justify-center space-x-2">
              <span >Touch Screen to Open</span>
              <span class="text-xs">→</span>
            </div>

            <!-- Home Bar Indicator -->
            <div class="w-24 h-1 bg-zinc-600 rounded-full mx-auto mt-2 z-20"></div>

          </div>
        </div>
      </NuxtLink>
      </div>
      <!-- Action Button below Hero Mockup -->
      <div class="pt-2">
        <NuxtLink :to="menuLink" class="bg-zinc-900 inline-block hover:bg-zinc-800 text-brand-400 border border-brand-500/30 font-black px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl">
          Explore Sample Modal
        </NuxtLink>
      </div>

    </div>
  </section>

  <!-- Core Deliverables Section (Non-Card Layout) -->
  <section class="py-24 px-6 max-w-6xl mx-auto border-t border-brand-900/20">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
      <div class="space-y-2">
        <span class="text-brand-400 text-[10px] font-black uppercase tracking-widest">Platform Breakdown <span class="normal-case font-normal text-zinc-400">/ የፕላትፎርም ዝርዝር</span></span>
        <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">What We Deliver <br><span class="block sm:inline text-xl sm:text-3xl font-bold normal-case text-brand-300">የምንሰጣቸው አገልግሎቶች</span></h2>
      </div>
      <p class="text-zinc-400 text-xs sm:text-sm max-w-sm font-semibold uppercase tracking-wider">
        Complete end-to-end digital menu setup for your physical dining tables. <br/>
        <span class="normal-case font-normal text-zinc-400 text-xs">ለሁለገብ የምግብ ጠረጴዛዎችዎ የተሟላ የዲጂታል ምናሌ ዝግጅት።</span>
      </p>
    </div>

    <!-- Line-Segmented Feature List instead of heavy cards -->
    <div class="divide-y divide-brand-900/40 border-y border-brand-900/40">
      
      <div class="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div class="flex items-baseline space-x-6">
          <span class="text-brand-500 font-black text-sm tracking-widest">01</span>
          <h3 class="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-brand-400 transition-colors">
            HD Menu Engine <span class="block text-sm font-normal normal-case text-brand-300">ጥራት ያለው የምናሌ ሲስተም</span>
          </h3>
        </div>
        <p class="text-zinc-400 text-xs max-w-md font-medium leading-relaxed">
          Stunning high-definition photos, ingredient tags, bi-lingual descriptions (English & Amharic), organized cleanly into categories.
          <span class="block text-zinc-300 font-normal text-[11px] mt-1">ማራኪ ባለከፍተኛ ጥራት ፎቶዎች፣ የግብአት ዝርዝሮች፣ በሁለት ቋንቋዎች (እንግሊዝኛ እና አማርኛ) የተዘጋጁ መግለጫዎች።</span>
        </p>
      </div>

      <div class="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div class="flex items-baseline space-x-6">
          <span class="text-amber-500 font-black text-sm tracking-widest">02</span>
          <h3 class="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-amber-400 transition-colors">
            Physical QR Standees <span class="block text-sm font-normal normal-case text-amber-300">የጠረጴዛ ኪውአር ኮድ (QR) სტንዶች</span>
          </h3>
        </div>
        <p class="text-zinc-400 text-xs max-w-md font-medium leading-relaxed">
          Custom acrylic table standees with high-precision QR codes designed matching your restaurant's brand identity.
          <span class="block text-zinc-300 font-normal text-[11px] mt-1">ከሬስቶራንትዎ አርማ እና የቀለም ገጽታ ጋር የተጣጣሙ ውብ የአክሪሊክ የጠረጴዛ ማቆሚያዎች።</span>
        </p>
      </div>

      <div class="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div class="flex items-baseline space-x-6">
          <span class="text-brand-500 font-black text-sm tracking-widest">03</span>
          <h3 class="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-brand-400 transition-colors">
            Instant Admin Control <span class="block text-sm font-normal normal-case text-brand-300">ቀላል የአስተዳደር ቁጥጥር</span>
          </h3>
        </div>
        <p class="text-zinc-400 text-xs max-w-md font-medium leading-relaxed">
          Update food items, adjust prices, or mark dishes "86'd / Out of Stock" live from your mobile phone in seconds.
          <span class="block text-zinc-300 font-normal text-[11px] mt-1">የምግብ አይነቶችን ማሻሻል፣ ዋጋ መቀየር ወይም «አልቋል» ማለት ከሞባይል ስልክዎ በሰከንዶች ውስጥ ይቻላል።</span>
        </p>
      </div>

      <div class="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
        <div class="flex items-baseline space-x-6">
          <span class="text-amber-500 font-black text-sm tracking-widest">04</span>
          <h3 class="text-xl sm:text-2xl font-black uppercase text-white group-hover:text-amber-400 transition-colors">
            Menu Analytics HUD <span class="block text-sm font-normal normal-case text-amber-300">የምናሌ ንባብ እና የሽያጭ መረጃዎች</span>
          </h3>
        </div>
        <p class="text-zinc-400 text-xs max-w-md font-medium leading-relaxed">
          Track customer item views, top ordered dishes, peak scanning hours, and dish popularity statistics in real time.
          <span class="block text-zinc-300 font-normal text-[11px] mt-1">ደንበኞች ምን ያህል እንደሚመለከቱ፣ በብዛት የሚታዘዙ ምግቦች እና የተጠኑ ሰዓቶች መረጃ በቀጥታ ይከታተሉ።</span>
        </p>
      </div>

    </div>
  </section>

  <!-- Re-imagined Interactive Profit Growth Simulator -->
  <section class="py-24 px-6 bg-obsidian-900/40 border-y border-brand-900/30 relative">
    <div class="max-w-5xl mx-auto space-y-12">
      
      <!-- Section Header -->
      <div class="text-center space-y-3">
        <span class="text-brand-400 text-[10px] font-black uppercase tracking-widest">Financial Impact Forecast</span>
        <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">Profit Growth Simulator <br><span class="block sm:inline text-xl sm:text-3xl font-bold normal-case text-brand-300">የትርፍ እድገት ማስያ</span></h2>
        <p class="text-zinc-400 text-xs max-w-md mx-auto font-medium">Adjust parameters below to estimate monthly revenue growth from digital upselling.</p>
      </div>

      <!-- Simulator HUD Container -->
      <div class="glass-panel p-8 sm:p-12 rounded-[36px] border border-brand-500/20 shadow-2xl relative overflow-hidden">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left Column: Controls -->
          <div class="lg:col-span-7 space-y-8">
            
            <!-- Control 1: Dining Tables -->
            <div class="space-y-4">
              <div class="flex justify-between items-center text-xs font-black tracking-widest uppercase">
                <span class="text-zinc-300">Dining Tables <span class="normal-case font-normal text-zinc-400">(የምግብ ጠረጴዛዎች ብዛት)</span></span>
                <span class="text-brand-400 bg-brand-950 px-3 py-1 rounded-lg border border-brand-900/80" x-text="roiTables + ' Tables'"></span>
              </div>
              <input type="range" min="5" max="80" x-model="roiTables" class="w-full accent-brand-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer">
              <div class="flex justify-between text-[9px] text-zinc-500 font-bold">
                <span>5 Tables</span>
                <span>40 Tables</span>
                <span>80 Tables</span>
              </div>
            </div>

            <!-- Control 2: Average Check Size -->
            <div class="space-y-4">
              <div class="flex justify-between items-center text-xs font-black tracking-widest uppercase">
                <span class="text-zinc-300">Average Bill Size <span class="normal-case font-normal text-zinc-400">(አማካይ የሂሳብ መጠን)</span></span>
                <span class="text-amber-400 bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-900/80" x-text="roiAvgBill + ' ETB'"></span>
              </div>
              <input type="range" min="250" max="2500" step="50" x-model="roiAvgBill" class="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer">
              <div class="flex justify-between text-[9px] text-zinc-500 font-bold">
                <span>250 ETB</span>
                <span>1,250 ETB</span>
                <span>2,500 ETB</span>
              </div>
            </div>

            <div class="pt-2 text-[10px] text-zinc-400 uppercase font-semibold leading-relaxed">
              ✦ Model assumes standard 2.5 average table turns per day & 22% average ticket lift from high-res appetite creation. <span class="block normal-case font-normal text-zinc-300 text-[10px] mt-1">* ሞዴሉ በቀን 2.5 ጊዜ ጠረጴዛዎች እንደሚቀየሩ እና ባለከፍተኛ ጥራት ፎቶዎች የ22% የሽያጭ ጭማሪ እንደሚያመጡ ያስረክባል።</span>
            </div>

          </div>

          <!-- Right Column: Visual Forecast Display HUD -->
          <div class="lg:col-span-5 bg-obsidian-950/90 rounded-3xl p-8 border border-brand-900/60 text-center space-y-6 flex flex-col justify-between shadow-inner">
            
            <div>
              <span class="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Projected Monthly Revenue Lift <span class="block normal-case font-normal text-[10px] text-brand-300">የተገመተ ወርሃዊ የገቢ ጭማሪ</span></span>
              <div class="text-4xl sm:text-5xl font-black text-brand-400 tracking-tight">
                ETB <span x-text="Math.round(roiTables * roiAvgBill * 0.22 * 2.5 * 30).toLocaleString()"></span>
              </div>
            </div>

            <!-- Growth Bar Meter -->
            <div class="space-y-2">
              <div class="flex justify-between text-[9px] font-black uppercase text-zinc-400">
                <span>Upsell Lift</span>
                <span class="text-brand-400">+22.4% Average</span>
              </div>
              <div class="w-full h-3 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div class="h-full bg-linear-to-r from-brand-500 to-amber-400 rounded-full transition-all duration-300" :style="'width: ' + Math.min(100, (roiTables * roiAvgBill) / 500) + '%'"></div>
              </div>
            </div>

            <button 
              @click="contactModalOpen = true" 
              class="w-full bg-brand-500 hover:bg-brand-400 text-black font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg transition-all"
            >
              Lock In Revenue Growth
            </button>

          </div>

        </div>

      </div>

    </div>
  </section>

  <!-- Stats & Impact Section (Minimal Line Grid, No Cards) -->
  <section class="py-20 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 sm:divide-x divide-brand-900/30 bg-[#0b100d]/95 rounded-[23px] py-8 px-6 md:px-10">
      
      <div class="text-center sm:text-left sm:pl-4">
        <div class="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">42%</div>
        <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Increase in Reach</p>
      </div>

      <div class="text-center sm:text-left sm:pl-8">
        <div class="text-4xl sm:text-5xl font-black text-brand-400 tracking-tight mb-1">100%</div>
        <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Uptime Guarantee</p>
      </div>

      <div class="text-center sm:text-left sm:pl-8">
        <div class="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight mb-1">#1 Rank</div>
        <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Search Discovery</p>
      </div>

      <div class="text-center sm:text-left sm:pl-8">
        <div class="text-4xl sm:text-5xl font-black text-white tracking-tight mb-1">30%</div>
        <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-black">More Repeat Visits</p>
      </div>

    </div>
  </section>

  <!-- Pricing Section -->
  <section class="py-24 px-6 max-w-6xl mx-auto border-t border-brand-900/20">
    <div class="text-center space-y-3 mb-16">
      <span class="text-brand-400 text-[10px] font-black uppercase tracking-widest">Investment <span class="normal-case font-normal text-zinc-400">/ የዋጋ እቅድ</span></span>
      <h2 class="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">Packages & Pricing <br><span class="block sm:inline text-xl sm:text-3xl font-bold normal-case text-brand-300">የዋጋ ዝርዝሮች</span></h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      
      <!-- Basic Plan -->
      <div class="bg-linear-to-b from-brand-950/80 to-obsidian-900 border-2 border-brand-500 p-8 rounded-[36px] flex flex-col justify-between shadow-2xl relative">
        <div class="absolute -top-3.5 right-8 bg-brand-500 text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
          Recommended / ተመራጭ
        </div>

        <div>
          <h3 class="text-2xl font-black text-white uppercase">Basic Plan <span class="text-lg font-bold normal-case text-brand-300 block">መሰረታዊ እቅድ</span></h3>
          <div class="mt-4 flex items-baseline">
            <span class="text-4xl sm:text-5xl font-black text-brand-400">17,999</span>
            <span class="text-xs font-black text-zinc-400 ml-2 uppercase">ETB / ብር</span>
          </div>
          <p class="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-wider">One-Time Complete Setup <span class="normal-case font-normal text-zinc-300">/ የአንድ ጊዜ ሙሉ ዝግጅት</span></p>
          <div class="mt-8 space-y-4 text-xs font-bold tracking-wider">
            <div class="flex items-start space-x-3 text-zinc-500">
              <span class="text-brand-400">✦</span>
              <span class="text-xs md:text-sm text-zinc-200">
                <strong class=" uppercase text-white">Digital Menu page</strong> on Awaze Platform 
                <span class="block font-normal normal-case text-zinc-300 text-[11px]">በአዋዜ ፕላትፎርም ላይ የዲጂታል ምናሌ ገጽ</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span class="text-brand-400">✦</span>
              <span class="text-xs md:text-sm text-zinc-200">
                <strong class=" uppercase text-white">10 QR Code presentations</strong> with Your & Awaze Logo
                <span class="block font-normal normal-case text-zinc-300 text-[11px]">የእርስዎን እና የአዋዜ አርማ የያዙ 10 የQR ኮድ ማቅረቢያዎች</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span class="text-brand-400">✦</span>
              <span class="text-xs md:text-sm text-zinc-200">
                <strong class=" uppercase text-white">Access Page:</strong> Full customization of Menu Items, Descriptions, Food Images, Stock Availability, and Prices with Preview & Publish features.
                <span class="block font-normal normal-case text-zinc-300 text-[11px]">የምናሌ ዕቃዎችን፣ መግለጫዎችን፣ የምግብ ፎቶዎችን፣ የአክሲዮን ሁኔታን እና ዋጋዎችን ከቅድመ-እይታ እና ማተሚያ ባህሪያት ጋር ሙሉ በሙሉ ማስተካከል ይችላሉ።</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span class="text-brand-400">✦</span>
              <span class="text-xs md:text-sm text-zinc-200">
                <strong class="uppercase text-white">Dashboard Page:</strong> Overview of total menu items, categories (Breakfast, Drinks, Desserts), Menu status (Published/Draft), Last updated date, and QR code download button.
                <span class="block font-normal normal-case text-zinc-300 text-[11px]">የዳሽቦርድ ገጽ፡ አጠቃላይ የምግብ ዝርዝር፣ ምድቦች (ቁርስ፣ መጠጦች፣ ጣፋጮች)፣ የምናሌ ሁኔታ (የታተመ/ረቂቅ)፣ የመጨረሻ ማሻሻያ ቀን እና የQR ኮድ ማውረጃ አዝራር።</span>
              </span>
            </div>

          </div>
        </div>
        
        <button 
          @click="contactModalOpen = true; contactForm.plan = 'Basic Plan (17,999 ETB / መሰረታዊ እቅድ)'" 
          class="w-full bg-brand-500 hover:bg-brand-400 text-black font-black uppercase py-4 rounded-xl text-xs tracking-widest mt-10 shadow-xl transition-all"
        >
          <div>Contact us to Get Started</div>
          <div class="text-[10px] font-bold normal-case mt-0.5">ለመጀመር ያግኙን</div>
        </button>

      </div>

      <!-- Enterprise / Premium Plan (Upcoming) -->
      <div class="bg-obsidian-900/50 border border-zinc-800 p-8 sm:p-10 rounded-[36px] flex flex-col justify-between opacity-75">
        <div>
          <span class="text-zinc-500 text-[9px] font-black uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
            Enterprise <span class="normal-case font-normal text-zinc-500">/ ኤንተርፕራይዝ</span>
          </span>
          <h3 class="text-2xl font-black text-white uppercase mt-4 mb-2">Premium Plan <span class="text-lg font-bold normal-case text-zinc-400 block">ፕሪሚየም እቅድ</span></h3>
          <span class="text-[15px] font-extrabold uppercase bg-amber-950/80 border border-amber-800/40 text-white px-2.5 py-1 rounded-md inline-block mb-3">Subscription Based <span class="normal-case font-normal text-xs text-amber-200">/ በወርሃዊ ክፍያ</span></span>
          <div class="mt-2 text-xl font-black text-zinc-500 uppercase">Coming Soon <span class="block text-sm font-normal normal-case text-zinc-500">በቅርብ ቀን የሚመጣ</span></div>

          <div class="space-y-3.5 pt-6 border-t border-emerald-950/80 text-zinc-500">
            
            <div class="flex items-start space-x-3">
              <span>✦</span>
              <span class="text-xs md:text-sm">
                <strong class="text-zinc-500">Custom QR Codes</strong> with your own brand logo and theme styling.
                <span class="block font-normal normal-case text-zinc-500 text-[11px]">የእራስዎ የንግድ አርማ እና ገጽታ ያላቸው ብጁ የQR ኮዶች።</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span><span>✦</span></span>
              <span class="text-xs md:text-sm">
                <strong class="text-zinc-500">Done-For-You Updates:</strong> Awaze team handles all updates for you within 24 hours.
                <span class="block font-normal normal-case text-zinc-500 text-[11px]">ማሻሻያዎችን በአዋዜ ቡድን በ24 ሰዓታት ውስጥ እንሰራለን።</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span>✦</span>
              <span class="text-xs md:text-sm">
                <strong class="text-zinc-500">Insights Page:</strong> Analytics on most viewed dishes, total menu scans, peak scan hours, and popular categories.
                <span class="block font-normal normal-case text-zinc-500 text-[11px]">የትንተና ገጽ፡ በብዛት የታዩ ምግቦች፣ የQR ኮድ ንባብ ብዛት እና ተወዳጅ ምድቦች።</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span>✦</span>
              <span class="text-xs md:text-sm">
                <strong class="text-zinc-500">Interactive Banners:</strong> Run custom promotion banners on guest screens (e.g., "20% Off Coffee Today", "New Pizza Available").
                <span class="block font-normal normal-case text-zinc-500 text-[11px]">የማስታወቂያ ባነሮች፡ በደንበኞች ስክሪን ላይ ልዩ ማስታወቂያዎችን ማሳየት።</span>
              </span>
            </div>

            <div class="flex items-start space-x-3">
              <span>✦</span>
              <span class="text-xs md:text-sm">
                <strong class="text-zinc-500">Awaze Platform Spotlight:</strong> Featured inclusions in Restaurant of the Week, Weekend Specials, and Holiday Promotions.
                <span class="block font-normal normal-case text-zinc-500 text-[11px]">የሳምንቱ ምርጥ ሬስቶራንት እና በበዓላት ማስታወቂያዎች ላይ መካተት።</span>
              </span>
            </div>

          </div>
        </div>

        <button disabled class="w-full bg-zinc-800 text-zinc-600 font-black uppercase py-4 rounded-xl text-xs tracking-widest mt-10 cursor-not-allowed">
          <div>Notify Me</div>
          <div class="text-[10px] font-bold normal-case">ሲጀመር አሳውቁኝ</div>
        </button>
      </div>

    </div>
  </section>

  <!-- CLIENTS SECTION: WHO WE ARE CURRENTLY WORKING WITH -->
  <section id="clients" class="py-16 px-4 md:px-8 bg-[#030604] border-y border-emerald-950/60">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <span class="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">Partner Restaurants</span>
        <h2 class="text-2xl md:text-4xl font-black text-white tracking-tight uppercase mt-2">
          Who We Are Currently Working With
        </h2>
      </div>

      <!-- Partner Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        
        <!-- Partner 1 -->
        <div class="bg-[#0d1410] border border-emerald-950/80 hover:border-emerald-600/60 rounded-2xl p-6 text-center transition-all group">
          <div class="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black font-black text-xl mb-4 group-hover:scale-110 transition-transform">
            K
          </div>
          <h3 class="text-lg font-extrabold text-white">Kaldi's Coffee</h3>
          <p class="text-xs text-zinc-400 mt-1">Ethiopia's premier coffee chain</p>
        </div>

        <!-- Partner 2 -->
        <div class="bg-[#0d1410] border border-emerald-950/80 hover:border-emerald-600/60 rounded-2xl p-6 text-center transition-all group">
          <div class="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-black font-black text-xl mb-4 group-hover:scale-110 transition-transform">
            F
          </div>
          <h3 class="text-lg font-extrabold text-white">Fikre Kunspagna</h3>
          <p class="text-xs text-zinc-400 mt-1">Authentic dining destination</p>
        </div>

        <!-- Partner 3 -->
        <div class="bg-[#0d1410] border border-emerald-950/80 hover:border-emerald-600/60 rounded-2xl p-6 text-center transition-all group">
          <div class="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-black font-black text-xl mb-4 group-hover:scale-110 transition-transform">
            L
          </div>
          <h3 class="text-lg font-extrabold text-white">London Cafe</h3>
          <p class="text-xs text-zinc-400 mt-1">Gourmet bakery & coffee lounge</p>
        </div>

        <!-- Partner 4 -->
        <div class="bg-[#0d1410] border border-emerald-950/80 hover:border-emerald-600/60 rounded-2xl p-6 text-center transition-all group">
          <div class="w-16 h-16 mx-auto rounded-full bg-linear-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-black font-black text-xl mb-4 group-hover:scale-110 transition-transform">
            L
          </div>
          <h3 class="text-lg font-extrabold text-white">London Cafe</h3>
          <p class="text-xs text-zinc-400 mt-1">Gourmet bakery & coffee lounge</p>
        </div>
        

      </div>
      
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section id="faq" class="py-20 px-4 md:px-8 max-w-5xl mx-auto">
    <div class="text-center mb-16">
      <span class="text-emerald-400 text-xs font-extrabold uppercase tracking-widest bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-900/60">Got Questions?</span>
      <h2 class="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mt-4">
        Frequently Asked Questions
      </h2>
    </div>

    <div class="space-y-4" x-data="{ openFaq: 1 }">
      
      <!-- FAQ 1 -->
      <div class="bg-[#0d1410] border border-emerald-950/80 rounded-2xl overflow-hidden transition-all">
        <button 
          @click="openFaq = (openFaq === 1 ? null : 1)"
          class="w-full text-left p-6 font-bold text-base md:text-lg text-white flex justify-between items-center space-x-4 focus:outline-none"
        >
          <span>What makes you unique?</span>
          <svg class="w-5 h-5 text-emerald-400 transform transition-transform" :class="{ 'rotate-180': openFaq === 1 }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div x-show="openFaq === 1" x-collapse class="px-6 pb-6 text-xs md:text-sm text-zinc-300 leading-relaxed border-t border-emerald-950/40 pt-4">
          We don't only give you a digital menu, We change the Digital Menu to a Sales tool. We provide Professional imaging planned to grab customer's attention on every food, we tap into promoting your company on social media and our apps, and also reduce your printing cost.
        </div>
      </div>

      <!-- FAQ 2 -->
      <div class="bg-[#0d1410] border border-emerald-950/80 rounded-2xl overflow-hidden transition-all">
        <button 
          @click="openFaq = (openFaq === 2 ? null : 2)"
          class="w-full text-left p-6 font-bold text-base md:text-lg text-white flex justify-between items-center space-x-4 focus:outline-none"
        >
          <span>What about updating subscription fees once I joined the plan?</span>
          <svg class="w-5 h-5 text-emerald-400 transform transition-transform" :class="{ 'rotate-180': openFaq === 2 }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div x-show="openFaq === 2" x-collapse class="px-6 pb-6 text-xs md:text-sm text-zinc-300 leading-relaxed border-t border-emerald-950/40 pt-4">
          We never add subscription fee on an already subscribed client.
        </div>
      </div>
       
    </div>
  </section>
  
  <!-- Footer with Contact Information & Social Media -->
  <footer class="bg-obsidian-950 pt-16 border-t border-brand-900/30 relative overflow-hidden">
    
    <div class="max-w-6xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-12 gap-10">
      
      <!-- Column 1: Brand Info -->
      <div class="md:col-span-5 space-y-4">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-500 to-amber-500 p-[2px] shadow-lg shadow-brand-500/20">
            <div class="w-full h-full bg-obsidian-950 rounded-[9px] flex items-center justify-center font-black text-brand-400 text-lg">A</div>
          </div>
          <div>
            <span class="font-black text-xl tracking-tight text-white uppercase leading-none block">AWAZE</span>
            <span class="text-brand-400 text-[8px] uppercase font-bold tracking-widest">Smart Menu Platform</span>
          </div>
        </div>
        <p class="text-xs text-zinc-400 font-medium leading-relaxed max-w-sm">
          Empowering restaurants, lounges, cafes, and hotels in Ethiopia with contactless, visually engaging digital menus that reduce overhead costs and boost average bill sizes.
        </p>
        <div class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider pt-2">
          <span>Supported by Bolale Creatives Group</span>
        </div>
      </div>

      <!-- Column 2: Direct Contact Information -->
      <div class="md:col-span-4 space-y-4">
        <h4 class="text-xs font-black uppercase text-white tracking-widest text-brand-400 mb-5 flex items-center space-x-2">
          <i class="fa-solid fa-headset"></i>
          <span>Contact Us</span>
        </h4>

        <div class="space-y-3 text-xs text-zinc-300 font-medium">
          <div class="flex items-start space-x-3">
            <i class="fa-solid fa-location-dot text-brand-400 mt-1"></i>
            <span>Not Currently Available on Single Location. <br><span class="block font-normal text-zinc-400 text-[11px]">በአንድ ቦታ ብቻ የተገደበ አይደለም።</span></span>
          </div>
          <div class="flex items-center space-x-3">
            <i class="fa-solid fa-phone text-amber-400"></i>
            <a href="tel:+251911234567" class="hover:text-brand-400 transition-colors">+251 973340691</a>
          </div>
          <div class="flex items-center space-x-3">
            <i class="fa-solid fa-envelope text-brand-400"></i>
            <a href="mailto:hello@awaze.et" class="hover:text-brand-400 transition-colors">kihlothager@gmail.com</a>
          </div>
          <div class="flex items-center space-x-3">
            <i class="fa-solid fa-clock text-amber-400"></i>
            <span>Always Available for Contact <br><span class="normal-case font-normal text-zinc-400">ሁል ጊዜ ለማግኘት ክፍት ነን</span></span>
          </div>
        </div>
      </div>

      <!-- Column 3: Social Media List -->
      <div class="md:col-span-3 space-y-4">
        <h4 class="text-xs font-black uppercase text-white tracking-widest text-amber-400 mb-4 flex items-center space-x-2">
          <i class="fa-solid fa-share-nodes"></i>
          <span>Follow Us</span>
        </h4>

        <div class="grid grid-cols-2 gap-2 text-xs font-bold uppercase tracking-wider">
          <a href="#" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-telegram text-sky-400"></i>
            <span class="text-[10px] text-zinc-500">Telegram</span>
          </a>
          <a href="https://www.instagram.com/awaze_dm?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-instagram text-pink-400"></i>
            <span class="text-[10px]">Instagram</span>
          </a>
          <a href="#" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-tiktok text-emerald-400"></i>
            <span class="text-[10px] text-zinc-500">TikTok</span>
          </a>
          <a href="#" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-whatsapp text-green-400"></i>
            <span class="text-[10px] text-zinc-500">WhatsApp</span>
          </a>
          <a href="#" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-linkedin text-blue-400"></i>
            <span class="text-[10px] text-zinc-500">LinkedIn</span>
          </a>
          <a href="#" class="p-2.5 rounded-xl bg-obsidian-900 hover:bg-brand-500 hover:text-black border border-zinc-800 text-zinc-300 flex items-center space-x-2 transition-all">
            <i class="fa-brands fa-facebook text-indigo-400"></i>
            <span class="text-[10px] text-zinc-500">Facebook</span>
          </a>
        </div>
      </div>

    </div>

    <!-- Bottom Copyright & Back To Top -->
    <div class="border-t border-brand-900/30 bg-obsidian-950 py-6 px-6">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        <span>© 2026 Bolale Creatives • Addis Ababa, Ethiopia •<span class="normal-case font-normal text-zinc-400">አዲስ አበባ፣ ኢትዮጵያ</span></span>
        <div class="flex space-x-6">
          <a href="#deliverables" class="hover:text-brand-400 transition-colors">Top of Page ↑</a>
        </div>
      </div>
    </div>

  </footer>

  <!-- Toast Notification Bar -->
  <!-- <div  -->
  <!--   x-show="showToast"  -->
  <!--   x-cloak  -->
  <!--   x-transition:enter="transition ease-out duration-300" -->
  <!--   x-transition:enter-start="opacity-0 translate-y-4" -->
  <!--   x-transition:enter-end="opacity-100 translate-y-0" -->
  <!--   x-transition:leave="transition ease-in duration-200" -->
  <!--   x-transition:leave-start="opacity-100 translate-y-0" -->
  <!--   x-transition:leave-end="opacity-0 translate-y-4" -->
  <!--   class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] bg-brand-500 text-black font-black text-xs px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2" -->
  <!-- > -->
  <!--   <span>✦</span> -->
  <!--   <span x-text="toastMessage"></span> -->
  <!-- </div> -->
    </div>
</template>

<style>
/* CSS Variables */
:root {
  --color-brand-50: #ecfdf5;
  --color-brand-100: #d1fae5;
  --color-brand-200: #a7f3d0;
  --color-brand-300: #6ee7b7;
  --color-brand-400: #34d399;
  --color-brand-500: #10b981;
  --color-brand-600: #059669;
  --color-brand-700: #047857;
  --color-brand-800: #065f46;
  --color-brand-900: #064e3b;
  --color-brand-950: #022c22;

  --color-amber-400: #fbbf24;
  --color-amber-500: #f59e0b;

  --color-obsidian-800: #121a14;
  --color-obsidian-900: #090e0b;
  --color-obsidian-950: #030604;

  --font-sans: "Plus Jakarta Sans", "Inter", sans-serif;
  --font-serif: "Playfair Display", serif;
}

/* Global Scrollbars */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #030604;
}
::-webkit-scrollbar-thumb {
  background: #064e3b;
  border-radius: 999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

/* Animations */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out 3s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 3s infinite linear;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-14px) rotate(1deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.08);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Custom UI Utilities */
.spotlight-hero {
  background: radial-gradient(
    circle at 50% 35%,
    rgba(16, 185, 129, 0.16) 0%,
    rgba(245, 158, 11, 0.08) 35%,
    rgba(3, 6, 4, 1) 75%
  );
}

.glass-panel {
  background: rgba(12, 18, 14, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(16, 185, 129, 0.12);
}

.phone-body {
  box-shadow:
    0 25px 60px -15px rgba(0, 0, 0, 0.9),
    0 0 40px 2px rgba(16, 185, 129, 0.25),
    inset 0 0 0 2px rgba(255, 255, 255, 0.15),
    inset 0 0 0 4px rgba(40, 45, 42, 0.8);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
}

.phone-body:hover {
  transform: translateY(-8px) scale(1.02) rotate(-0.5deg);
  box-shadow:
    0 35px 75px -15px rgba(0, 0, 0, 0.95),
    0 0 60px 8px rgba(16, 185, 129, 0.4),
    inset 0 0 0 2px rgba(255, 255, 255, 0.25);
}

.phone-screen-glare {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.02) 40%,
    transparent 60%
  );
}

.shimmer-button {
  position: relative;
  overflow: hidden;
}

.shimmer-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transform: translateX(-100%);
}

.shimmer-button:hover::after {
  animation: shimmer 1.5s infinite;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

<script setup lang="ts">


</script>

<template><!-- Hero Section -->
  <section class="relative min-h-[95vh] items-center px-4 py-16 overflow-hidden bg-black">
    <!-- Ambient Background Glow Circles -->
    <div class="absolute -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-800 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-transparent rounded-full blur-[90px] pointer-events-none"></div>
    <div class="mt-15 mx-auto max-w-350 pr-20 flex flex-row items-center text-left z-10 space-y-6 gap-80">
      
      <!-- Concise Pill Badge -->
      <!-- Ultra-Brief Typography Headline -->
      <div class="relative space-y-3 max-w-7xl text-left mt-auto">
        <h1 class="bg-clip-text text-transparent bg-linear-to-r from-brand-400 via-emerald-200 to-amber-400 uppercase tracking-widest font-semibold max-w-md">************  ************  ************  ************</h1>
        <h1 class="sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase leading-none">
          Digital infrastructure<br> for Ethiopian hospitality<br/>
          <!--<span class="font-bold block sm:inline-block bg-clip-text text-transparent bg-linear-to-r from-brand-400 via-emerald-200 to-amber-400">ዲጂታል የምግብ ዝርዝሮች</span><br>-->
        </h1>
        <p class="text-xs sm:text-sm block sm:inline-block bg-clip-text text-transparent bg-linear-to-r from-brand-400 via-emerald-200 to-amber-400 uppercase tracking-widest font-semibold max-w-md">
          Create Appetite. Eliminate Printing Costs.<br/>Digitalize Your Restaurant.
        </p>
        <!-- Action Button below Hero Mockup -->
        <div class="pt-2">
          <NuxtLink to="/menu" class="hover:bg-black inline-block bg-brand-400 text-black hover:text-brand-400 border border-brand-500/30 font-black px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl">
            Browse Restaurants
          </NuxtLink>
        </div>


        <section class="text-2xl sm:text-4xl font-black text-brand-400 tracking-tight mt-16">
          <div class="grid grid-cols-4">
            
            <div class="text-center sm:text-left sm:pl-4">
              <div class=" text-white">42%</div>
              <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold">Increase in Reach</p>
            </div>

            <div class="text-center sm:text-left sm:pl-8">
              <div class=" text-brand-400">100%</div>
              <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold">Uptime Guarantee</p>
            </div>

            <div class="text-center sm:text-left sm:pl-8">
              <div class=" text-amber-400">#1 </div>
              <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold">Search Discovery</p>
            </div>
            <div class="">
              <div class=" text-white">30%</div>
              <p class="text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold">More Repeat Visits</p>
            </div>

          </div>
        </section>
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
        <NuxtLink to="/menu">
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
              <div class="relative h-36 rounded-2xl overflow-hidden border border-brand-700/40 group-hover:scale-[1.02] transition-transform">
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
    </div>
  </section>
  </template>
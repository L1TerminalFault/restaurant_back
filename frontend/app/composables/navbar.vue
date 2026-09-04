<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur-md px-6 lg:px-12 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <!-- Brand Logo -->
      <a href="#" class="flex items-center space-x-3 group">
        <div
          class="w-10 h-10 p-[2px] group-hover:scale-105 transition-transform"
        >
          <img src="/assets/images/awaze_logo.png" alt="Logo" />
        </div>
        <div class="flex flex-col">
          <span
            class="font-black text-xl tracking-tight text-white uppercase leading-none"
            >AWAZE <span class="text-transparent text-[1px]">.</span
            ><span
              class="text-brand-400 text-xl uppercase font-bold tracking-widest mt-1"
            >
              አዋዜ</span
            ></span
          >
        </div>
      </a>

      <!-- Primary Action CTA -->
      <NuxtLink to="/sample-menu">
        <div class="flex items-center space-x-4">
          <h1
            class="shimmer-button bg-brand-500 hover:bg-brand-400 text-center text-black font-black text-[11px] uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
          >
            Sample Demo
          </h1>
        </div>
      </NuxtLink>
    </div>
  </header>
</template>
